import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ensureSchema, isDbConfigured, sql } from "@/lib/db";
import { generateUsername } from "@/lib/auth";

export const runtime = "nodejs";

// Stripe needs the raw body to verify the signature, so nothing may parse it first.
export async function POST(req: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      raw,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("[webhook] bad signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await createStudent(session);
      }
    }
    // 200 tells Stripe to stop retrying.
    return NextResponse.json({ received: true });
  } catch (err) {
    // 500 so Stripe retries rather than silently dropping a paid customer.
    console.error("[webhook] handler failed:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}

async function createStudent(session: Stripe.Checkout.Session) {
  if (!isDbConfigured()) {
    // Don't lose the sale: log loudly so it can be reconciled by hand.
    console.error(
      "[webhook] PAID BUT NO DATABASE — reconcile manually:",
      JSON.stringify({
        session: session.id,
        email: session.customer_details?.email,
        product: session.metadata?.product,
        amount: session.amount_total,
      }),
    );
    return;
  }

  await ensureSchema();
  const q = sql();
  const email = session.customer_details?.email ?? "";
  const product = session.metadata?.product ?? "course";
  const username = generateUsername(email);

  // Password is deliberately NOT set here — it's generated once, on the success
  // page, so a plaintext password never has to be stored or emailed.
  // ON CONFLICT makes this idempotent if Stripe redelivers the event.
  await q`
    INSERT INTO students (email, username, product, stripe_session_id)
    VALUES (${email}, ${username}, ${product}, ${session.id})
    ON CONFLICT (stripe_session_id) DO NOTHING`;

  console.log(`[webhook] student created: ${username} (${product}) ${email}`);
}
