import { randomBytes, scrypt as _scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ensureSchema, sql, type Student } from "./db";

const scrypt = promisify(_scrypt) as (
  pw: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

export const SESSION_COOKIE = "avt_session";
const SESSION_DAYS = 30;

// ── passwords ────────────────────────────────────────────────────────────────
// scrypt with a random per-user salt. Stored as "salt:hash" (both hex).
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;
  const key = await scrypt(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  if (key.length !== expected.length) return false;
  return timingSafeEqual(key, expected); // constant-time
}

// ── generated credentials ────────────────────────────────────────────────────
const PW_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** Unambiguous, high-entropy password (no look-alike chars). */
export function generatePassword(len = 14): string {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += PW_ALPHABET[bytes[i] % PW_ALPHABET.length];
  return out;
}

/** Stable, unique-ish handle derived from the buyer's email. */
export function generateUsername(email: string): string {
  const base = (email.split("@")[0] || "student")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12) || "student";
  return `${base}-${randomBytes(3).toString("hex")}`;
}

// ── sessions ─────────────────────────────────────────────────────────────────
// Opaque random token in an HttpOnly cookie; only its SHA-256 lives in the DB.
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/**
 * Issues a session and (critically for anti-sharing) deletes every other
 * session for that student — logging in anywhere kicks the previous device.
 */
export async function createSession(studentId: number): Promise<string> {
  await ensureSchema();
  const q = sql();
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await q`DELETE FROM sessions WHERE student_id = ${studentId}`;
  await q`INSERT INTO sessions (token_hash, student_id, expires_at)
          VALUES (${sha256(token)}, ${studentId}, ${expires.toISOString()})`;
  return token;
}

export async function destroySession(token: string): Promise<void> {
  await ensureSchema();
  await sql()`DELETE FROM sessions WHERE token_hash = ${sha256(token)}`;
}

/** Resolves the logged-in student from the session cookie, or null. */
export async function getCurrentStudent(): Promise<Student | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  await ensureSchema();
  const rows = (await sql()`
    SELECT s.* FROM students s
    JOIN sessions ses ON ses.student_id = s.id
    WHERE ses.token_hash = ${sha256(token)} AND ses.expires_at > NOW()
    LIMIT 1`) as unknown as Student[];
  return rows[0] ?? null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  };
}
