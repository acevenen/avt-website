import { NextResponse } from "next/server";
import { ensureSchema, isDbConfigured, sql, type Student } from "@/lib/db";
import { getCurrentStudent } from "@/lib/auth";

export const runtime = "nodejs";

/** Full roster for the admin dashboard. Server-side admin check — never trust the frontend alone. */
export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ error: "No database." }, { status: 503 });

  const me = await getCurrentStudent();
  if (!me || !me.is_admin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await ensureSchema();
  const rows = (await sql()`
    SELECT id, email, username, product, belt_level, tier1_passed, tier2_passed,
           credentials_shown, is_admin, created_at, last_login_at
    FROM students
    ORDER BY created_at DESC`) as unknown as Student[];

  return NextResponse.json({ students: rows });
}
