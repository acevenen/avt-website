import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ensureSchema, isDbConfigured, sql, type Student } from "@/lib/db";
import { generatePassword, hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * One-time credential reveal for a paid checkout session.
 *
 * The password is generated HERE and returned exactly once — only its scrypt
 * hash is persisted, so plaintext is never stored anywhere. A second call for
 * the same session returns 410.
 */
export async function POST(req: Request) {
  if (!isStripeConfigured() || !isDbConfigured()) {
    return NextResponse.json({ error: "Accounts aren't switched on yet." }, { status: 503 });
  }

  let sessionId: string | undefined;
  try {
    ({ sessionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!sessionId) return NextResponse.json({ error: "Missing session." }, { status: 400 });

  // Verify with Stripe that this session exists and was actually paid.
  let paid = false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
  } catch {
    return NextResponse.json({ error: "Unknown checkout session." }, { status: 404 });
  }
  if (!paid) return NextResponse.json({ error: "Payment not completed." }, { status: 402 });

  await ensureSchema();
  const q = sql();
  const rows = (await q`
    SELECT * FROM students WHERE stripe_session_id = ${sessionId} LIMIT 1`) as unknown as Student[];
  const student = rows[0];

  if (!student) {
    // Webhook may not have landed yet — the client retries.
    return NextResponse.json({ error: "Account still being created.", retry: true }, { status: 202 });
  }
  if (student.credentials_shown) {
    return NextResponse.json(
      { error: "Credentials were already shown. Use them to log in, or contact Ace for a reset." },
      { status: 410 },
    );
  }

  const password = generatePassword();
  const password_hash = await hashPassword(password);
  await q`
    UPDATE students
    SET password_hash = ${password_hash}, credentials_shown = TRUE
    WHERE id = ${student.id}`;

  return NextResponse.json({
    username: student.username,
    password, // shown once, never persisted in plaintext
    product: student.product,
  });
}
