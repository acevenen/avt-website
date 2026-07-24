"use client";

import { useState } from "react";
import Link from "next/link";
import { checkoutUrl } from "@/lib/checkout";

// TODO(Ace): this invite expired 2026-07-05 — replace with a permanent invite.
const DISCORD = "https://discord.gg/hReBrtPFx";

// ── Curriculum: the 9-belt spine (free White→Orange, paid Green→Brown III) ──
const belts = [
  { label: "White", color: "#f0ede6", tier: "free", title: "What trading actually is", blurb: "Mindset, tilt, revenge trading. Clearing the slate before a single setup." },
  { label: "Yellow", color: "#d4c44a", tier: "free", title: "The non-negotiable rules", blurb: "NQ only. 9:30–11:30. 2:1 minimum. 1–2% risk. The math before the chart." },
  { label: "Orange", color: "#d4843a", tier: "free", title: "Reading the chart", blurb: "Candles, structure, break of structure, supply & demand. The vocabulary." },
  { label: "Green", color: "#1db87e", tier: "paid", title: "Daily bias & alignment", blurb: "Set direction before the open, then align it down to the 5-minute." },
  { label: "Blue", color: "#4a8fd4", tier: "paid", title: "The 9/20 EMA setup", blurb: "The trigger. Retracement into a key level after a break of structure." },
  { label: "Purple", color: "#9b59b6", tier: "paid", title: "Flags & momentum", blurb: "When to pull the trigger, when to sit. Volume, breakouts vs fakeouts." },
  { label: "Brown", color: "#a0673a", tier: "paid", title: "Trade management", blurb: "Trailing stops, taking partials, adding to winners, cutting dead trades." },
  { label: "Brown II", color: "#8a5530", tier: "paid", title: "Funded account gameplan", blurb: "Topstep & Lucid. Drawdown, daily loss limits, passing the combine." },
  { label: "Brown III", color: "#5a3010", tier: "paid", title: "Discipline reinforcement", blurb: "Journaling, weekly reviews, diagnosing your own mistakes." },
];

type Plan = "course" | "trade" | "coach";

const faqs = [
  { q: "Do I need experience to start?", a: "No. White through Orange belts are free and assume zero knowledge — mindset, the rules, and how to read a chart. The paid course picks up where they leave off." },
  { q: "What do I actually trade?", a: "NQ futures, during the New York open (9:30–11:30 AM EST). One instrument, one window. You master one market instead of jumping between assets." },
  { q: "Signals, the bot, or the course — which is for me?", a: "The Course if you want to learn the system yourself, at your own pace. Black Belt if you want it rebuilt around you 1-on-1. Signals and Autopilot are being rebuilt right now and aren't on sale — the Course and Coaching are." },
  { q: "Is the bot available yet?", a: "Not yet — Autopilot is paused while the execution engine is rebuilt. When it ships it runs the AVT system with fixed stops and a daily circuit breaker built in. Course buyers get first access." },
  { q: "How does access work after I buy?", a: "The moment your payment clears you get a private username and password for the student portal — unique to you, shown once on the confirmation screen. The Course is one-time with lifetime access; Black Belt includes the full course plus 3 months 1-on-1." },
];

export default function Home() {
  const [plan, setPlan] = useState<Plan>("course");
  const [openBelt, setOpenBelt] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [buyError, setBuyError] = useState("");

  async function buy(product: "course" | "coaching") {
    setBuying(product);
    setBuyError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // hand off to Stripe
        return;
      }
      setBuyError(data.error || "Could not start checkout.");
    } catch {
      setBuyError("Network error — please try again.");
    }
    setBuying(null);
  }

  return (
    <div className="av">
      <style>{css}</style>
      <GrainGlow />

      {/* NAV */}
      <nav className="av-nav">
        <Link href="/" className="av-logo">
          <span className="av-spade">♠</span> Ace Venen Trading
        </Link>
        <div className="av-nav-links">
          <Link href="/learn">Free Course</Link>
          <Link href="/paid" className="av-nav-portal">Portal</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="av-hero">
        <div className="av-hero-badge"><span className="av-dot" /> Live cohort · 2026</div>
        <h1 className="av-hero-h1">
          Turn <span className="gi">two hours a day</span> into a{" "}
          <span className="gi">funded paycheck.</span>
        </h1>
        <p className="av-hero-sub">
          One system for scalping NQ futures — the same one that took me{" "}
          <strong>$200 → $20,000 in 90 days.</strong> Start free. Rank up when you&apos;re ready.
        </p>
        <div className="av-hero-cta">
          <Link href="/learn" className="btn btn-gold">Start free →</Link>
          <a href="#pricing" className="btn btn-ghost">See the paths</a>
        </div>

        {/* live wins ticker */}
        <div className="av-ticker" aria-hidden>
          <div className="av-ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="av-tick">
                <span className="av-tick-amt">{t.amt}</span> {t.who}
                <span className="av-tick-dot">♠</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* PRICING — segmented, one path at a time (mobile: no scroll wall) */}
      <section className="av-pricing" id="pricing">
        <p className="av-eyebrow">Three ways in — one system</p>
        <h2 className="av-h2">Pick your path.</h2>

        <div className="av-seg" role="tablist">
          <button className={`av-seg-btn ${plan === "course" ? "on" : ""}`} onClick={() => setPlan("course")} role="tab" aria-selected={plan === "course"}>
            <span>The Course</span><span className="av-seg-price">$297</span>
          </button>
          <button className={`av-seg-btn ${plan === "trade" ? "on" : ""}`} onClick={() => setPlan("trade")} role="tab" aria-selected={plan === "trade"}>
            <span>Trade With Me</span><span className="av-seg-price">$97+/mo</span>
          </button>
          <button className={`av-seg-btn ${plan === "coach" ? "on" : ""}`} onClick={() => setPlan("coach")} role="tab" aria-selected={plan === "coach"}>
            <span>Coaching</span><span className="av-seg-price">$1K</span>
          </button>
          <span className={`av-seg-glow seg-${plan}`} aria-hidden />
        </div>

        {plan === "course" && (
          <div className="av-panel">
            <div className="av-panel-head">
              <div>
                <div className="av-panel-name">The Course</div>
                <div className="av-panel-price"><sup>$</sup>297 <span className="av-panel-per">once · lifetime</span></div>
              </div>
              <div className="av-belt-strip" title="White → Black">
                {belts.map((b) => <span key={b.label} style={{ background: b.color }} />)}
                <span style={{ background: "#3a3a3a" }} />
              </div>
            </div>
            <ul className="av-feat">
              <li>The full belt curriculum — 9 animated modules</li>
              <li>The 9/20 EMA flag system, broken down step by step</li>
              <li>Risk, position management & the mental game</li>
              <li>Funded-account gameplan — Topstep & Lucid</li>
              <li>Lifetime access to the student portal</li>
            </ul>
            <button className="btn btn-gold btn-block" onClick={() => buy("course")} disabled={buying === "course"}>
              {buying === "course" ? "Redirecting…" : "Get the Course — $297"}
            </button>
            {buyError && plan === "course" && <p className="av-buy-err">{buyError}</p>}
            <p className="av-fine">White → Orange are <strong>free forever</strong> — <Link href="/learn">start there</Link> first.</p>
          </div>
        )}

        {plan === "trade" && (
          <div className="av-panel av-panel-soon">
            <div className="av-soon-banner">
              🔧 Signals &amp; Autopilot are being rebuilt — not for sale yet.{" "}
              <Link href="/learn">Start free</Link> or grab the Course meanwhile.
            </div>
            <div className="av-duo">
              <div className="av-duo-col">
                <div className="av-panel-name">Signals</div>
                <div className="av-panel-price"><sup>$</sup>97<span className="av-panel-per">/mo</span></div>
                <ul className="av-feat">
                  <li>Real-time entries, stops & targets</li>
                  <li>Context on every call — the why</li>
                  <li>Cancel anytime</li>
                </ul>
                <button className="btn btn-disabled btn-block" disabled aria-disabled="true">
                  Coming soon
                </button>
              </div>
              <div className="av-duo-col">
                <div className="av-panel-name">Autopilot <span className="av-tag-bot">BOT</span></div>
                <div className="av-panel-price"><sup>$</sup>197<span className="av-panel-per">/mo</span></div>
                <ul className="av-feat">
                  <li>Automated execution of the system</li>
                  <li>Fixed stops + daily circuit breaker</li>
                  <li>Volume-adaptive trailing</li>
                </ul>
                <button className="btn btn-disabled btn-block" disabled aria-disabled="true">
                  Coming soon
                </button>
              </div>
            </div>
          </div>
        )}

        {plan === "coach" && (
          <div className="av-panel av-panel-feat">
            <div className="av-spots">⚡ 10 seats · application reviewed</div>
            <div className="av-panel-price"><sup>$</sup>1,000 <span className="av-panel-per">3-month intensive</span></div>
            <ul className="av-feat">
              <li>1-on-1 coaching with Ace for 3 full months</li>
              <li>24/7 direct access — no ticket system</li>
              <li>Weekly calls + live trade reviews</li>
              <li>Your trading rebuilt around your goals</li>
              <li>Focused on passing your first funded account</li>
            </ul>
            <button className="btn btn-gold btn-block" onClick={() => buy("coaching")} disabled={buying === "coaching"}>
              {buying === "coaching" ? "Redirecting…" : "Claim your seat — $1,000"}
            </button>
            {buyError && plan === "coach" && <p className="av-buy-err">{buyError}</p>}
            <p className="av-fine">
              Prefer to talk first? <Link href="/apply">Apply and Ace will reach out</Link> — no payment up front.
            </p>
          </div>
        )}
      </section>

      {/* CURRICULUM — interactive belt spine */}
      <section className="av-curriculum" id="system">
        <p className="av-eyebrow">The belt system</p>
        <h2 className="av-h2">Level up, belt by belt.</h2>
        <div className="av-belts">
          {belts.map((b, i) => {
            const open = openBelt === i;
            return (
              <div key={b.label} className={`av-belt ${open ? "open" : ""}`} style={{ ["--bc" as string]: b.color }}>
                <button className="av-belt-head" onClick={() => setOpenBelt(open ? null : i)} aria-expanded={open}>
                  <span className="av-belt-edge" />
                  <span className="av-belt-main">
                    <span className="av-belt-label">{b.label} Belt</span>
                    <span className="av-belt-title">{b.title}</span>
                  </span>
                  <span className={`av-belt-tag ${b.tier}`}>{b.tier === "free" ? "FREE" : "🔒"}</span>
                  <span className="av-belt-plus">{open ? "×" : "+"}</span>
                </button>
                <div className="av-belt-body" hidden={!open}>
                  <p>{b.blurb}</p>
                  {b.tier === "free" ? (
                    <Link href="/learn" className="av-belt-link">Watch free →</Link>
                  ) : (
                    <a href={checkoutUrl("course")} className="av-belt-link">Unlock with the Course →</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="av-faq">
        <h2 className="av-h2">Questions?</h2>
        <div className="av-faq-list">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={`av-faq-item ${open ? "open" : ""}`}>
                <button className="av-faq-q" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                  {f.q}<span>{open ? "−" : "+"}</span>
                </button>
                <div className="av-faq-a" hidden={!open}><p>{f.a}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="av-final">
        <span className="av-spade-big">♠</span>
        <h2 className="av-final-h2">Start free. <span className="gi">Rank up when you&apos;re ready.</span></h2>
        <div className="av-hero-cta">
          <Link href="/learn" className="btn btn-gold">Start free →</Link>
          <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Join the Dojo</a>
        </div>
      </section>

      <footer className="av-footer">
        <div className="av-footer-links">
          <Link href="/learn">Free Course</Link>
          <Link href="/paid">Portal</Link>
          <Link href="/apply">Apply</Link>
          <a href={DISCORD} target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
        <p className="av-disc">
          Trading involves substantial risk and may result in loss of capital. Figures shown are not typical
          and not a guarantee of results. © 2026 Ace Venen Trading.
        </p>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="av-sticky">
        <Link href="/learn" className="btn btn-ghost av-sticky-ghost">Free</Link>
        <button className="btn btn-gold av-sticky-main" onClick={() => buy("course")} disabled={buying === "course"}>
          {buying === "course" ? "Redirecting…" : "Get the Course — $297"}
        </button>
      </div>
    </div>
  );
}

const tickerItems = [
  { amt: "+$18,686", who: "Chris · 15 days" },
  { amt: "+$1,510", who: "NQ scalp · 62 min" },
  { amt: "+$3,037", who: "Topstep $50K passed" },
  { amt: "+$300/day", who: "Emilio · 1 session" },
  { amt: "+$2,140", who: "Tuesday open" },
];

function GrainGlow() {
  return (
    <>
      <div className="av-glow" aria-hidden />
      <svg className="av-grain" aria-hidden xmlns="http://www.w3.org/2000/svg">
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </>
  );
}

const css = `
  .av { --edge: rgba(255,255,255,0.08); position: relative; min-height: 100vh; overflow-x: clip; }
  .av * { box-sizing: border-box; }

  /* texture that kills the generic look */
  .av-grain { position: fixed; inset: 0; width: 100%; height: 100%; opacity: 0.04; pointer-events: none; z-index: 0; mix-blend-mode: screen; }
  .av-glow { position: fixed; top: -20%; left: 50%; transform: translateX(-50%); width: 900px; height: 700px; z-index: 0; pointer-events: none;
    background: radial-gradient(closest-side, rgba(232,184,75,0.18), transparent 70%); filter: blur(20px); }
  .av > *:not(.av-grain):not(.av-glow) { position: relative; z-index: 1; }

  .gi { font-family: var(--font-display), serif; font-style: italic; color: var(--gold); }
  .av-h2 { font-size: clamp(1.7rem, 6vw, 2.6rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; margin: 6px 0 20px; }
  .av-eyebrow { font-size: .68rem; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); }

  /* buttons */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: .92rem; font-weight: 700;
    padding: 15px 26px; border-radius: 100px; text-decoration: none; transition: transform .18s, box-shadow .18s, background .18s; white-space: nowrap; cursor: pointer; border: none; }
  .btn-gold { background: var(--gold); color: #000; box-shadow: 0 8px 30px rgba(232,184,75,.25); }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(232,184,75,.35); }
  .btn-ghost { background: rgba(255,255,255,0.04); color: var(--paper); border: 1px solid var(--edge); }
  .btn-ghost:hover { border-color: rgba(232,184,75,.5); transform: translateY(-2px); }
  .btn-block { display: flex; width: 100%; }
  .av-buy-err { margin-top: 10px; font-size: .78rem; color: #e0a0a0; text-align: center; }
  .btn-disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border: 1px dashed var(--edge); cursor: not-allowed; font-family: inherit; }
  .av-panel-soon .av-duo-col { opacity: .62; }
  .av-soon-banner { font-size: .78rem; line-height: 1.6; color: var(--muted); background: rgba(255,255,255,0.03);
    border: 1px dashed var(--edge); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; text-align: center; }
  .av-soon-banner a { color: var(--gold); text-decoration: none; font-weight: 600; }

  /* nav */
  .av-nav { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; backdrop-filter: blur(14px); background: rgba(6,6,6,.7); border-bottom: 1px solid var(--edge); }
  .av-logo { font-size: .72rem; letter-spacing: .22em; text-transform: uppercase; color: var(--muted); text-decoration: none; display: flex; align-items: center; gap: 8px; }
  .av-spade { color: var(--gold); }
  .av-nav-links { display: flex; gap: 8px; align-items: center; }
  .av-nav-links a { font-size: .74rem; color: var(--muted); text-decoration: none; padding: 8px 12px; border-radius: 100px; transition: color .2s, background .2s; }
  .av-nav-links a:hover { color: var(--paper); }
  .av-nav-portal { border: 1px solid var(--edge); color: var(--paper) !important; }

  /* hero */
  .av-hero { max-width: 780px; margin: 0 auto; padding: 46px 22px 30px; text-align: center; }
  .av-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase;
    color: var(--muted); border: 1px solid var(--edge); border-radius: 100px; padding: 6px 14px; margin-bottom: 22px; }
  .av-dot { width: 7px; height: 7px; border-radius: 50%; background: #1db87e; box-shadow: 0 0 10px #1db87e; animation: pulse 1.8s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
  .av-hero-h1 { font-size: clamp(2.1rem, 8.5vw, 4rem); font-weight: 800; line-height: 1.04; letter-spacing: -0.035em; margin-bottom: 18px; }
  .av-hero-sub { font-size: 1rem; color: var(--muted); line-height: 1.65; max-width: 520px; margin: 0 auto 26px; }
  .av-hero-sub strong { color: var(--paper); }
  .av-hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ticker */
  .av-ticker { margin-top: 34px; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); border-top: 1px solid var(--edge); border-bottom: 1px solid var(--edge); padding: 12px 0; }
  .av-ticker-track { display: inline-flex; gap: 34px; white-space: nowrap; animation: scroll 26s linear infinite; }
  @keyframes scroll { to { transform: translateX(-50%); } }
  .av-tick { display: inline-flex; align-items: center; gap: 10px; font-size: .82rem; color: var(--muted); }
  .av-tick-amt { color: #1db87e; font-weight: 700; }
  .av-tick-dot { color: var(--gold); opacity: .4; }

  /* section shells */
  .av-pricing, .av-curriculum, .av-faq, .av-final { max-width: 680px; margin: 0 auto; padding: 40px 22px; }

  /* segmented control */
  .av-seg { position: relative; display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; background: rgba(255,255,255,0.03);
    border: 1px solid var(--edge); border-radius: 16px; padding: 5px; margin-bottom: 18px; }
  .av-seg-btn { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 12px 6px;
    background: none; border: none; color: var(--muted); cursor: pointer; border-radius: 12px; font-size: .82rem; font-weight: 600; transition: color .2s; }
  .av-seg-btn.on { color: #000; }
  .av-seg-price { font-size: .72rem; opacity: .8; }
  .av-seg-glow { position: absolute; top: 5px; bottom: 5px; width: calc((100% - 10px) / 3); border-radius: 12px; background: var(--gold); z-index: 1; transition: transform .28s cubic-bezier(.4,1.3,.5,1); }
  .seg-course { transform: translateX(0); }
  .seg-trade { transform: translateX(100%); }
  .seg-coach { transform: translateX(200%); }

  .av-panel { border: 1px solid var(--edge); border-radius: 18px; padding: 24px; background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent); animation: rise .3s ease; }
  .av-panel-feat { border-color: rgba(232,184,75,.35); box-shadow: 0 0 60px rgba(232,184,75,.06) inset; }
  @keyframes rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
  .av-panel-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
  .av-panel-name { font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; }
  .av-tag-bot { font-size: .58rem; letter-spacing: .1em; background: rgba(74,143,212,.18); color: #7bb0e8; padding: 2px 6px; border-radius: 4px; vertical-align: middle; }
  .av-panel-price { font-size: 2.4rem; font-weight: 800; color: var(--gold); letter-spacing: -.03em; line-height: 1; }
  .av-panel-price sup { font-size: 1.1rem; vertical-align: super; }
  .av-panel-per { font-size: .7rem; font-weight: 500; color: var(--muted); letter-spacing: .06em; text-transform: uppercase; vertical-align: middle; }
  .av-belt-strip { display: flex; gap: 3px; flex-shrink: 0; padding-top: 6px; }
  .av-belt-strip span { width: 9px; height: 26px; border-radius: 3px; }
  .av-feat { list-style: none; padding: 0; margin: 6px 0 20px; display: flex; flex-direction: column; gap: 10px; }
  .av-feat li { font-size: .88rem; color: var(--muted); padding-left: 26px; position: relative; line-height: 1.4; }
  .av-feat li::before { content: "✓"; position: absolute; left: 0; color: var(--gold); font-weight: 700; }
  .av-fine { font-size: .74rem; color: var(--muted); text-align: center; margin-top: 14px; }
  .av-fine a { color: var(--gold); }
  .av-duo { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .av-duo-col { display: flex; flex-direction: column; }
  .av-duo-col .btn { margin-top: auto; }
  .av-spots { display: inline-block; font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; color: var(--gold);
    border: 1px solid rgba(232,184,75,.3); background: rgba(232,184,75,.07); border-radius: 100px; padding: 5px 12px; margin-bottom: 14px; }

  /* curriculum */
  .av-belts { display: flex; flex-direction: column; gap: 8px; }
  .av-belt { border: 1px solid var(--edge); border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.02); transition: border-color .2s; }
  .av-belt.open { border-color: color-mix(in srgb, var(--bc) 45%, transparent); }
  .av-belt-head { width: 100%; display: flex; align-items: center; gap: 12px; padding: 15px 16px; background: none; border: none; cursor: pointer; text-align: left; color: var(--paper); }
  .av-belt-edge { width: 5px; align-self: stretch; border-radius: 4px; background: var(--bc); box-shadow: 0 0 12px color-mix(in srgb, var(--bc) 60%, transparent); flex-shrink: 0; }
  .av-belt-main { flex: 1; min-width: 0; }
  .av-belt-label { display: block; font-size: .62rem; letter-spacing: .14em; text-transform: uppercase; color: var(--bc); margin-bottom: 3px; }
  .av-belt-title { display: block; font-size: .96rem; font-weight: 600; }
  .av-belt-tag { font-size: .58rem; letter-spacing: .08em; padding: 3px 8px; border-radius: 100px; flex-shrink: 0; }
  .av-belt-tag.free { background: rgba(29,184,126,.15); color: #4fd39e; }
  .av-belt-tag.paid { background: rgba(255,255,255,0.05); }
  .av-belt-plus { font-size: 1.3rem; color: var(--muted); width: 20px; text-align: center; flex-shrink: 0; }
  .av-belt-body { padding: 0 16px 16px 33px; animation: rise .25s ease; }
  .av-belt-body p { font-size: .86rem; color: var(--muted); line-height: 1.55; margin-bottom: 10px; }
  .av-belt-link { font-size: .8rem; font-weight: 600; color: var(--gold); text-decoration: none; }

  /* proof */

  /* faq */
  .av-faq-list { display: flex; flex-direction: column; gap: 8px; }
  .av-faq-item { border: 1px solid var(--edge); border-radius: 14px; overflow: hidden; background: rgba(255,255,255,0.02); }
  .av-faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 14px; padding: 16px; background: none; border: none;
    color: var(--paper); font-size: .9rem; font-weight: 600; text-align: left; cursor: pointer; }
  .av-faq-q span { color: var(--gold); font-size: 1.2rem; flex-shrink: 0; }
  .av-faq-a { padding: 0 16px 16px; animation: rise .25s ease; }
  .av-faq-a p { font-size: .85rem; color: var(--muted); line-height: 1.6; }

  /* final */
  .av-final { text-align: center; }
  .av-spade-big { font-size: 2.6rem; color: var(--gold); opacity: .8; display: block; margin-bottom: 6px; }
  .av-final-h2 { font-size: clamp(1.8rem, 7vw, 2.8rem); font-weight: 800; letter-spacing: -.03em; line-height: 1.1; margin-bottom: 24px; }

  /* footer */
  .av-footer { max-width: 680px; margin: 0 auto; padding: 30px 22px 120px; border-top: 1px solid var(--edge); text-align: center; }
  .av-footer-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 18px; }
  .av-footer-links a { font-size: .78rem; color: var(--muted); text-decoration: none; }
  .av-footer-links a:hover { color: var(--gold); }
  .av-disc { font-size: .66rem; color: rgba(255,255,255,.32); line-height: 1.7; max-width: 460px; margin: 0 auto; }

  /* sticky mobile CTA */
  .av-sticky { position: fixed; bottom: 0; left: 0; right: 0; z-index: 30; display: none; gap: 10px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    background: rgba(6,6,6,.86); backdrop-filter: blur(14px); border-top: 1px solid var(--edge); }
  .av-sticky-ghost { flex: 0 0 auto; padding: 15px 22px; }
  .av-sticky-main { flex: 1; }

  @media (max-width: 720px) {
    .av-duo { grid-template-columns: 1fr; }
    .av-sticky { display: flex; }
    .av-nav-links a:first-child { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .av-ticker-track { animation: none; }
    .av-dot { animation: none; }
  }
`;
