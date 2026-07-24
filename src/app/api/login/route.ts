import { NextResponse } from "next/server";
import { ensureSchema, isDbConfigured, sql, type Student } from "@/lib/db";
import { createSession, verifyPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Accounts aren't switched on yet." }, { status: 503 });
  }

  let username: string | undefined, password: string | undefined;
  try {
    ({ username, password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required." }, { status: 400 });
  }

  await ensureSchema();
  const rows = (await sql()`
    SELECT * FROM students WHERE username = ${username.trim().toLowerCase()} LIMIT 1`) as unknown as Student[];
  const student = rows[0];

  // Same message either way — don't leak which usernames exist.
  const invalid = NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  if (!student?.password_hash) return invalid;
  if (!(await verifyPassword(password, student.password_hash))) return invalid;

  // Issuing a session kills any other active one (anti-sharing).
  const token = await createSession(student.id);
  await sql()`UPDATE students SET last_login_at = NOW() WHERE id = ${student.id}`;

  const res = NextResponse.json({
    ok: true,
    student: {
      username: student.username,
      product: student.product,
      tier1_passed: student.tier1_passed,
      tier2_passed: student.tier2_passed,
      is_admin: student.is_admin,
    },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
