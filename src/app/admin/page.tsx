"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StudentRow {
  id: number;
  email: string;
  username: string;
  product: string;
  belt_level: string;
  tier1_passed: boolean;
  tier2_passed: boolean;
  credentials_shown: boolean;
  is_admin: boolean;
  created_at: string;
  last_login_at: string | null;
}

type Status = "checking" | "gate" | "unauthorized" | "in";

export default function AdminPage() {
  const [status, setStatus] = useState<Status>("checking");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [q, setQ] = useState("");

  async function loadRoster() {
    const r = await fetch("/api/admin/students");
    if (r.status === 403) {
      setStatus("unauthorized");
      return;
    }
    const data = await r.json();
    setStudents(data.students ?? []);
    setStatus("in");
  }

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/me");
      const data = await r.json();
      if (data.student?.is_admin) {
        loadRoster();
      } else if (data.student) {
        setStatus("unauthorized");
      } else {
        setStatus("gate");
      }
    })();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await r.json();
      if (!r.ok) {
        setErr(data.error ?? "Login failed.");
        return;
      }
      if (!data.student?.is_admin) {
        setErr("This account isn't an admin.");
        setStatus("unauthorized");
        return;
      }
      await loadRoster();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  const filtered = students.filter((s) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return s.username.includes(needle) || s.email.toLowerCase().includes(needle) || s.product.includes(needle);
  });

  const counts = {
    total: students.filter((s) => !s.is_admin).length,
    beginner: students.filter((s) => !s.is_admin && s.belt_level === "beginner").length,
    intermediate: students.filter((s) => !s.is_admin && s.belt_level === "intermediate").length,
    advanced: students.filter((s) => !s.is_admin && s.belt_level === "advanced").length,
  };

  return (
    <div className="ad-root">
      <style>{css}</style>

      {status === "checking" && <div className="ad-loading">Loading…</div>}

      {status === "unauthorized" && (
        <div className="ad-gate">
          <div className="ad-gate-box">
            <p className="ad-gate-title">Not authorized</p>
            <p className="ad-gate-sub">This account doesn&apos;t have admin access.</p>
            <Link href="/paid" className="ad-gate-link">← Back to the portal</Link>
          </div>
        </div>
      )}

      {status === "gate" && (
        <div className="ad-gate">
          <form className="ad-gate-box" onSubmit={login}>
            <p className="ad-gate-title">Admin Login</p>
            <p className="ad-gate-sub">Ace Venen Trading — staff only</p>
            <input
              className="ad-input"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <input
              className="ad-input"
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="ad-btn" disabled={busy}>
              {busy ? "Checking…" : "Log in →"}
            </button>
            {err && <p className="ad-err">{err}</p>}
          </form>
        </div>
      )}

      {status === "in" && (
        <>
          <nav className="ad-nav">
            <Link href="/" className="ad-logo">▲ AVT — Admin</Link>
            <div className="ad-nav-right">
              <span className="ad-nav-count">{counts.total} students</span>
              <Link href="/" className="ad-nav-ghost">← Home</Link>
            </div>
          </nav>

          <div className="ad-stats">
            <div className="ad-stat"><span className="ad-stat-n">{counts.total}</span><span className="ad-stat-l">Total</span></div>
            <div className="ad-stat"><span className="ad-stat-n" style={{ color: "#f0ede6" }}>{counts.beginner}</span><span className="ad-stat-l">Beginner</span></div>
            <div className="ad-stat"><span className="ad-stat-n" style={{ color: "#1db87e" }}>{counts.intermediate}</span><span className="ad-stat-l">Intermediate</span></div>
            <div className="ad-stat"><span className="ad-stat-n" style={{ color: "#a0673a" }}>{counts.advanced}</span><span className="ad-stat-l">Advanced</span></div>
          </div>

          <div className="ad-toolbar">
            <input
              className="ad-search"
              placeholder="Search username, email, product…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="ad-refresh" onClick={loadRoster}>↻ Refresh</button>
          </div>

          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Belt</th>
                  <th>Tests</th>
                  <th>Joined</th>
                  <th>Last login</th>
                </tr>
              </thead>
              <tbody>
                {filtered.filter((s) => !s.is_admin).map((s) => (
                  <tr key={s.id}>
                    <td className="ad-mono">{s.username}</td>
                    <td>{s.email || "—"}</td>
                    <td><span className="ad-pill">{s.product}</span></td>
                    <td><span className={`ad-belt ad-belt-${s.belt_level}`}>{s.belt_level}</span></td>
                    <td className="ad-tests">
                      <span title="Beginner test">{s.tier1_passed ? "✓" : "·"}</span>
                      <span title="Intermediate test">{s.tier2_passed ? "✓" : "·"}</span>
                      {!s.credentials_shown && <span className="ad-pending">unclaimed</span>}
                    </td>
                    <td className="ad-mono">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="ad-mono">
                      {s.last_login_at ? new Date(s.last_login_at).toLocaleDateString() : "never"}
                    </td>
                  </tr>
                ))}
                {filtered.filter((s) => !s.is_admin).length === 0 && (
                  <tr><td colSpan={7} className="ad-empty">No students match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const css = `
  .ad-root { --a-black:#080808; --a-surface:#0f0f0f; --a-surface2:#141414;
    --a-white:#f0ede6; --a-green:#1db87e; --a-gold:#d4a843;
    --a-border:rgba(240,237,230,0.08); --a-border-b:rgba(240,237,230,0.15);
    --a-muted:rgba(240,237,230,0.5); --a-muted2:rgba(240,237,230,0.7);
    font-family:'Inter',sans-serif; background:var(--a-black); color:var(--a-white); min-height:100vh; }
  .ad-loading { padding:4rem; text-align:center; color:var(--a-muted); }

  .ad-gate { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
  .ad-gate-box { width:100%; max-width:340px; background:var(--a-surface); border:0.5px solid var(--a-border-b); border-radius:12px; padding:2rem 1.5rem; text-align:center; }
  .ad-gate-title { font-size:1.1rem; font-weight:800; margin-bottom:.3rem; }
  .ad-gate-sub { font-size:.75rem; color:var(--a-muted); margin-bottom:1.25rem; }
  .ad-input { width:100%; padding:11px 14px; background:var(--a-surface2); border:0.5px solid var(--a-border-b); border-radius:8px; color:var(--a-white); font-size:.85rem; margin-bottom:10px; outline:none; text-align:center; }
  .ad-input:focus { border-color:var(--a-green); }
  .ad-btn { width:100%; padding:11px; border-radius:8px; background:var(--a-green); color:#080808; font-weight:800; font-size:.85rem; border:none; cursor:pointer; }
  .ad-btn:disabled { opacity:.6; cursor:default; }
  .ad-err { font-size:.72rem; color:#c94a2a; margin-top:8px; }
  .ad-gate-link { display:inline-block; margin-top:1rem; font-size:.75rem; color:var(--a-green); text-decoration:none; }

  .ad-nav { position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; padding:.9rem 1.25rem; background:rgba(8,8,8,.9); backdrop-filter:blur(10px); border-bottom:0.5px solid var(--a-border); }
  .ad-logo { font-size:.75rem; letter-spacing:.1em; color:var(--a-green); text-decoration:none; font-weight:700; }
  .ad-nav-right { display:flex; align-items:center; gap:.9rem; }
  .ad-nav-count { font-size:.72rem; color:var(--a-muted); }
  .ad-nav-ghost { font-size:.72rem; color:var(--a-muted); text-decoration:none; }

  .ad-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:1.25rem; max-width:900px; margin:0 auto; }
  .ad-stat { background:var(--a-surface); border:0.5px solid var(--a-border); border-radius:10px; padding:14px 8px; text-align:center; }
  .ad-stat-n { display:block; font-size:1.5rem; font-weight:800; }
  .ad-stat-l { display:block; font-size:.62rem; letter-spacing:.08em; text-transform:uppercase; color:var(--a-muted); margin-top:2px; }

  .ad-toolbar { display:flex; gap:8px; padding:0 1.25rem 1rem; max-width:900px; margin:0 auto; }
  .ad-search { flex:1; padding:10px 14px; background:var(--a-surface); border:0.5px solid var(--a-border-b); border-radius:8px; color:var(--a-white); font-size:.82rem; outline:none; }
  .ad-search:focus { border-color:var(--a-green); }
  .ad-refresh { padding:10px 14px; background:var(--a-surface); border:0.5px solid var(--a-border-b); border-radius:8px; color:var(--a-muted2); font-size:.78rem; cursor:pointer; }
  .ad-refresh:hover { color:var(--a-white); }

  .ad-table-wrap { max-width:900px; margin:0 auto; padding:0 1.25rem 2rem; overflow-x:auto; }
  .ad-table { width:100%; border-collapse:collapse; font-size:.78rem; }
  .ad-table th { text-align:left; padding:8px 10px; color:var(--a-muted); font-weight:600; font-size:.66rem; letter-spacing:.06em; text-transform:uppercase; border-bottom:0.5px solid var(--a-border-b); white-space:nowrap; }
  .ad-table td { padding:10px; border-bottom:0.5px solid var(--a-border); white-space:nowrap; }
  .ad-mono { font-family:monospace; color:var(--a-muted2); }
  .ad-pill { font-size:.68rem; padding:2px 8px; border-radius:20px; background:rgba(255,255,255,0.05); }
  .ad-belt { font-size:.68rem; padding:2px 8px; border-radius:20px; text-transform:capitalize; }
  .ad-belt-beginner { background:rgba(240,237,230,0.08); color:var(--a-white); }
  .ad-belt-intermediate { background:rgba(29,184,126,.12); color:var(--a-green); }
  .ad-belt-advanced { background:rgba(160,103,58,.18); color:#c98a55; }
  .ad-tests { letter-spacing:4px; }
  .ad-pending { display:inline-block; margin-left:8px; letter-spacing:0; font-size:.62rem; padding:1px 6px; border-radius:10px; background:rgba(201,74,42,.15); color:#e07a5f; }
  .ad-empty { text-align:center; color:var(--a-muted); padding:2rem; }
`;
