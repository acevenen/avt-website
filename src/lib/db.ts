import { neon } from "@neondatabase/serverless";

// Postgres (Neon free tier). Everything degrades gracefully when DATABASE_URL
// isn't set yet — the portal keeps working on the legacy shared password.
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

let schemaReady = false;

/** Creates the tables on first use. Safe to call on every request. */
export async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  const q = sql();
  await q`
    CREATE TABLE IF NOT EXISTS students (
      id                BIGSERIAL PRIMARY KEY,
      email             TEXT NOT NULL,
      username          TEXT NOT NULL UNIQUE,
      password_hash     TEXT,
      product           TEXT NOT NULL,
      stripe_session_id TEXT UNIQUE,
      credentials_shown BOOLEAN NOT NULL DEFAULT FALSE,
      belt_level        TEXT NOT NULL DEFAULT 'beginner',
      tier1_passed      BOOLEAN NOT NULL DEFAULT FALSE,
      tier2_passed      BOOLEAN NOT NULL DEFAULT FALSE,
      is_admin          BOOLEAN NOT NULL DEFAULT FALSE,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login_at     TIMESTAMPTZ
    )`;
  // Additive migration for DBs created before is_admin existed.
  await q`ALTER TABLE students ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE`;
  await q`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    )`;
  await q`CREATE INDEX IF NOT EXISTS sessions_student_idx ON sessions(student_id)`;
  schemaReady = true;
}

export interface Student {
  id: number;
  email: string;
  username: string;
  password_hash: string | null;
  product: string;
  stripe_session_id: string | null;
  credentials_shown: boolean;
  belt_level: string;
  tier1_passed: boolean;
  tier2_passed: boolean;
  is_admin: boolean;
  created_at?: string;
  last_login_at?: string | null;
}
