import { NextResponse } from "next/server";
import { ensureSchema, isDbConfigured, sql, type Student } from "@/lib/db";
import { generatePassword, hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * One-time(ish) admin account creation.
 *
 * Gated entirely by ADMIN_SETUP_KEY — a secret Ace generates himself and sets
 * in Vercel. Claude never sees it. Whoever holds that key can call this route
 * directly (e.g. from the browser address bar or curl) to mint an admin
 * account; nobody else can, since there's no other way to reach it.
 *
 * Password is generated here, hashed, and returned exactly once — same
 * "never store plaintext" pattern as the student credential reveal.
 */
export async function POST(req: Request) {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  if (!setupKey) {
    return NextResponse.json(
      { error: "ADMIN_SETUP_KEY isn't set in Vercel yet." },
      { status: 503 },
    );
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database isn't configured yet." }, { status: 503 });
  }

  let key: string | undefined, username: string | undefined;
  try {
    ({ key, username } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (key !== setupKey) {
    // Same response either way — don't confirm the key is close/wrong.
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const handle = (username || "ace").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!handle) return NextResponse.json({ error: "Invalid username." }, { status: 400 });

  await ensureSchema();
  const q = sql();

  const password = generatePassword();
  const password_hash = await hashPassword(password);

  const existing = (await q`
    SELECT * FROM students WHERE username = ${handle} LIMIT 1`) as unknown as Student[];

  if (existing[0]) {
    // Re-running with the same key resets that admin's password instead of
    // duplicating — handy if the first reveal is lost.
    await q`UPDATE students SET password_hash = ${password_hash}, is_admin = TRUE,
             credentials_shown = TRUE WHERE id = ${existing[0].id}`;
  } else {
    await q`
      INSERT INTO students (email, username, password_hash, product, is_admin, credentials_shown)
      VALUES (${`${handle}@admin.local`}, ${handle}, ${password_hash}, 'admin', TRUE, TRUE)`;
  }

  return NextResponse.json({
    username: handle,
    password, // shown once — write it down now
  });
}
