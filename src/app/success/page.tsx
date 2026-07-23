"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Creds {
  username: string;
  password: string;
  product: string;
}

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [creds, setCreds] = useState<Creds | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const reveal = useCallback(async (attempt = 0) => {
    if (!sessionId) {
      setError("Missing checkout session.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      // 202 = webhook hasn't created the account yet; back off and retry.
      if (res.status === 202 && attempt < 6) {
        setTimeout(() => reveal(attempt + 1), 1500);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load your account.");
      } else {
        setCreds(data);
      }
    } catch {
      setError("Network error loading your account.");
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    reveal();
  }, [reveal]);

  function copyAll() {
    if (!creds) return;
    navigator.clipboard
      ?.writeText(`AVT Student Portal\nUsername: ${creds.username}\nPassword: ${creds.password}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <main className="sc">
      <style>{css}</style>

      <div className="sc-card">
        <div className="sc-check" aria-hidden>✓</div>
        <p className="sc-eyebrow">Payment received</p>
        <h1 className="sc-title">You&apos;re in.</h1>

        {loading && <p className="sc-sub">Creating your student account…</p>}

        {!loading && creds && (
          <>
            <p className="sc-sub">
              These are your personal portal credentials. They&apos;re shown{" "}
              <strong>once</strong> — save them now.
            </p>
            <div className="sc-creds">
              <div className="sc-row">
                <span className="sc-k">Username</span>
                <code className="sc-v">{creds.username}</code>
              </div>
              <div className="sc-row">
                <span className="sc-k">Password</span>
                <code className="sc-v">{creds.password}</code>
              </div>
            </div>
            <button className="sc-copy" onClick={copyAll}>
              {copied ? "Copied ✓" : "Copy credentials"}
            </button>
            <p className="sc-warn">
              ⚠ Screenshot or save these. For your security they can&apos;t be shown again —
              if you lose them, contact Ace for a reset.
            </p>
            <Link href="/paid" className="sc-btn">Enter the Student Portal →</Link>
          </>
        )}

        {!loading && !creds && (
          <>
            <p className="sc-sub sc-err">{error}</p>
            <p className="sc-warn">
              Your payment went through. If your credentials didn&apos;t appear, contact Ace
              with your receipt and he&apos;ll sort you out immediately.
            </p>
            <Link href="/paid" className="sc-btn">Go to the portal</Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="sc" />}>
      <SuccessInner />
    </Suspense>
  );
}

const css = `
  .sc { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem 1.25rem;
    background:#060606; color:#fff; font-family:var(--font-inter),sans-serif; }
  .sc-card { width:100%; max-width:460px; text-align:center; background:#111; border:1px solid rgba(255,255,255,.09);
    border-radius:18px; padding:2.5rem 1.75rem; }
  .sc-check { width:60px; height:60px; margin:0 auto 1.25rem; border-radius:50%; display:flex; align-items:center;
    justify-content:center; font-size:1.6rem; color:#e8b84b; background:rgba(232,184,75,.1); border:1px solid rgba(232,184,75,.3); }
  .sc-eyebrow { font-size:.65rem; letter-spacing:.22em; text-transform:uppercase; color:#e8b84b; margin-bottom:.5rem; }
  .sc-title { font-size:2rem; font-weight:800; letter-spacing:-.03em; margin-bottom:.75rem; }
  .sc-sub { font-size:.9rem; color:#8f8f8f; line-height:1.6; margin-bottom:1.25rem; }
  .sc-sub strong { color:#fff; }
  .sc-err { color:#e0a0a0; }
  .sc-creds { text-align:left; background:#0a0a0a; border:1px solid rgba(255,255,255,.09); border-radius:12px;
    padding:1rem; margin-bottom:.85rem; }
  .sc-row { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:.5rem 0; }
  .sc-row + .sc-row { border-top:1px solid rgba(255,255,255,.06); }
  .sc-k { font-size:.68rem; letter-spacing:.14em; text-transform:uppercase; color:#8f8f8f; }
  .sc-v { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:1rem; color:#e8b84b; word-break:break-all; }
  .sc-copy { width:100%; padding:.75rem; margin-bottom:1rem; font-size:.82rem; font-weight:600; cursor:pointer;
    color:#fff; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12); border-radius:100px; }
  .sc-warn { font-size:.72rem; color:#8f8f8f; line-height:1.6; margin-bottom:1.25rem; }
  .sc-btn { display:block; padding:.95rem; border-radius:100px; background:#e8b84b; color:#000; font-weight:700;
    font-size:.9rem; text-decoration:none; }
`;
