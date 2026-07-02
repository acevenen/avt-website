"use client";
import { useState } from "react";
import Link from "next/link";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjrljje";

const EXPERIENCE_OPTIONS = [
  "Chud — No experience at all",
  "Noob — 1 to 3 years",
  "Pro — 5+ years",
];

type Status = "idle" | "submitting" | "success";

export default function ApplyPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const experience = String(data.get("experience") ?? "");

    if (!name || !email || !phone || !experience) {
      setError("Please fill out every field.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!/^[\d\s+\-()]{7,20}$/.test(phone)) {
      setError("Enter a valid phone number.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, experience, product: "Black Belt Coaching" }),
      });
      if (res.ok) {
        setConfirmedEmail(email);
        setStatus("success");
      } else {
        const body = await res.json().catch(() => null);
        setError(
          body?.errors?.map((err: { message: string }) => err.message).join(" ") ??
            "Submission failed. Please try again.",
        );
        setStatus("idle");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  const inputClass =
    "w-full rounded-md border border-white/10 bg-[var(--card)] px-4 py-3 text-[var(--paper)] placeholder:text-[var(--muted)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]";
  const labelClass =
    "text-xs font-medium uppercase tracking-widest text-[var(--muted)]";

  return (
    <main className="mx-auto w-full max-w-md px-5 py-16">
      <nav className="mb-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--paper)]"
        >
          Ace Venen Trading
        </Link>
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--gold)]">
          ← Back
        </Link>
      </nav>

      {status === "success" ? (
        <div className="py-12 text-center">
          <div
            aria-hidden
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-2xl text-[var(--gold)]"
          >
            ✓
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[var(--gold)]">
            Application received
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Ace will reach out to{" "}
            <strong className="text-[var(--paper)]">{confirmedEmail}</strong>
            <br />
            within 24 hours. Stay ready.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block border-b border-white/10 pb-0.5 text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--gold)]"
          >
            ← Back to home
          </Link>
        </div>
      ) : (
        <>
          <header className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Black Belt — Application
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-none text-[var(--paper)]">
              Let&apos;s get to work.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              10 seats, application-reviewed. Ace reads every application
              personally — you&apos;ll hear back{" "}
              <strong className="text-[var(--paper)]">within 24 hours.</strong>
            </p>
          </header>

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <label className={labelClass} htmlFor="name">
                Full name
              </label>
              <input
                className={inputClass}
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className={labelClass} htmlFor="email">
                Email address
              </label>
              <input
                className={inputClass}
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className={labelClass} htmlFor="phone">
                Phone number
              </label>
              <input
                className={inputClass}
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (000) 000-0000"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className={labelClass} htmlFor="experience">
                Trading experience
              </label>
              <select className={inputClass} id="experience" name="experience" required defaultValue="">
                <option value="" disabled>
                  Select your level
                </option>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 rounded-md bg-[var(--gold)] px-5 py-3 font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--paper)]"
            >
              {status === "submitting" ? "Submitting…" : "Submit application"}
            </button>
            <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
              No spam. Your info stays private.
              <br />
              Ace reads every application himself.
            </p>
          </form>
        </>
      )}
    </main>
  );
}
