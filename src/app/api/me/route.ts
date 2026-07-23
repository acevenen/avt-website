import { NextResponse } from "next/server";
import { isDbConfigured, ensureSchema, sql } from "@/lib/db";
import {
  getCurrentStudent,
  destroySession,
  SESSION_COOKIE,
} from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/** Current student + progress, or {student:null} when logged out. */
export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ student: null, dbConfigured: false });
  const s = await getCurrentStudent();
  return NextResponse.json({
    dbConfigured: true,
    student: s && {
      username: s.username,
      product: s.product,
      tier1_passed: s.tier1_passed,
      tier2_passed: s.tier2_passed,
      belt_level: s.belt_level,
    },
  });
}

/** Records a passed tier test against the logged-in student. */
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ error: "No database." }, { status: 503 });
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  let tier: string | undefined;
  try {
    ({ tier } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await ensureSchema();
  const q = sql();
  if (tier === "tier1") {
    await q`UPDATE students SET tier1_passed = TRUE, belt_level = 'intermediate' WHERE id = ${student.id}`;
  } else if (tier === "tier2") {
    await q`UPDATE students SET tier2_passed = TRUE, belt_level = 'advanced' WHERE id = ${student.id}`;
  } else {
    return NextResponse.json({ error: "Unknown tier." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

/** Logout. */
export async function DELETE() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && isDbConfigured()) await destroySession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
