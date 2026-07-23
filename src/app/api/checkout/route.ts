import { NextResponse } from "next/server";
import { PRODUCTS, getStripe, isStripeConfigured, siteOrigin, type ProductId } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments aren't switched on yet. Set STRIPE_SECRET_KEY in Vercel." },
      { status: 503 },
    );
  }

  let product: string | undefined;
  try {
    ({ product } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!product || !(product in PRODUCTS)) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  const item = PRODUCTS[product as ProductId];
  const origin = siteOrigin(req);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: item.amount,
            product_data: { name: item.name, description: item.description },
          },
        },
      ],
      // Needed so the webhook can create the student account.
      customer_creation: "always",
      metadata: { product },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=canceled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] failed:", err);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
