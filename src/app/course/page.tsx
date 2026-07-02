"use client";

import { useState } from "react";
import Link from "next/link";
import { checkoutUrl } from "@/lib/checkout";

const STRIPE_STUDENT = checkoutUrl("course");
const STRIPE_BLACK_BELT = "/apply";

// ─── Belt data ────────────────────────────────────────────────────────────────

const belts = [
  {
    id: "white",
    color: "#f0ede6",
    colorDim: "rgba(240,237,230,0.15)",
    colorBg: "rgba(240,237,230,0.04)",
    label: "White Belt",
    tier: "free",
    tierLabel: "Free — Ace's Dojo",
    title: "What trading actually is",
    desc: "Why most people fail before they learn a single setup. Mindset, ego, tilt — clearing the slate.",
    topics: ["Tilt & revenge trading", "FOMO & overtrading", "Discipline as the edge", "Emotional state = entry criteria"],
  },
  {
    id: "yellow",
    color: "#d4c44a",
    colorDim: "rgba(212,196,74,0.25)",
    colorBg: "rgba(212,196,74,0.05)",
    label: "Yellow Belt",
    tier: "free",
    tierLabel: "Free — Ace's Dojo",
    title: "The non-negotiable rules",
    desc: "Stop loss, take profit, risk/reward, account risk per trade. The math before the chart.",
    topics: ["NQ futures only", "NY open 9:30–11:30 AM EST", "2:1 min / 3:1 target R:R", "1–2% account risk per trade"],
  },
  {
    id: "orange",
    color: "#d4843a",
    colorDim: "rgba(212,132,58,0.25)",
    colorBg: "rgba(212,132,58,0.05)",
    label: "Orange Belt",
    tier: "free-intro",
    tierLabel: "Free intro · Paid application",
    title: "Reading the chart",
    desc: "Candles, market structure, HH/HL, break of structure, supply & demand zones. The vocabulary.",
    topics: ["Candle reading & wicks", "Higher highs / higher lows", "Break of structure", "Supply & demand zones"],
  },
  {
    id: "green",
    color: "#1db87e",
    colorDim: "#0d5c40",
    colorBg: "#091a12",
    label: "Green Belt",
    tier: "paid",
    tierLabel: "AVT Student — $297",
    title: "Daily bias & timeframe alignment",
    desc: "How to set your directional bias before the market opens, then align it down to the 5-minute for entry.",
    topics: ["Pre-market bias read", "Higher timeframe to 5m drill-down", "Level identification", "Bias invalidation rules"],
  },
  {
    id: "blue",
    color: "#4a8fd4",
    colorDim: "rgba(74,143,212,0.25)",
    colorBg: "rgba(74,143,212,0.05)",
    label: "Blue Belt",
    tier: "paid",
    tierLabel: "AVT Student — $297",
    title: "The 9/20 EMA setup",
    desc: "The actual trigger. 9 and 20 EMA retracement into a key level after a break of structure. This is the system.",
    topics: ["9/20 EMA crossover behavior", "Retracement into key levels", "Entry after BoS confirmation", "5-minute chart execution"],
  },
  {
    id: "purple",
    color: "#9b59b6",
    colorDim: "rgba(155,89,182,0.25)",
    colorBg: "rgba(155,89,182,0.05)",
    label: "Purple Belt",
    tier: "paid",
    tierLabel: "AVT Student — $297",
    title: "Flags, momentum & execution",
    desc: "When to pull the trigger and when to sit on your hands. Flags, volume confirmation, breakouts vs fakeouts.",
    topics: ["Flag pattern identification", "Volume confirmation", "Breakout vs fakeout reads", "Momentum entry criteria"],
  },
  {
    id: "brown",
    color: "#a0673a",
    colorDim: "rgba(160,103,58,0.25)",
    colorBg: "rgba(160,103,58,0.05)",
    label: "Brown Belt",
    tier: "paid",
    tierLabel: "AVT Student — $297",
    title: "Trade management & scaling",
    desc: "Good entry vs good trade. Trailing stops, previous highs as TPs, adding to winners, knowing when to cut early.",
    topics: ["Trailing stop mechanics", "Previous highs as TPs", "Adding to winners", "Early exit vs hold criteria"],
  },
  {
    id: "brown2",
    color: "#8a5530",
    colorDim: "rgba(138,85,48,0.25)",
    colorBg: "rgba(138,85,48,0.05)",
    label: "Brown Belt II",
    tier: "paid",
    tierLabel: "AVT Student — $297",
    title: "Funded account gameplan",
    desc: "Topstep, Lucid — passing evals, drawdown rules, daily loss limits, building toward consistent payouts.",
    topics: ["Topstep & Lucid eval rules", "Drawdown & daily loss limits", "Combine passing strategy", "Payout consistency"],
  },
  {
    id: "black",
    color: "#1a1a1a",
    colorDim: "rgba(255,255,255,0.15)",
    colorBg: "rgba(255,255,255,0.03)",
    label: "Black Belt",
    tier: "black",
    tierLabel: "Black Belt — $1,000",
    title: "Discipline reinforcement + 1-on-1",
    desc: "Journaling, weekly trade reviews, diagnosing your own mistakes — plus direct access to Ace for 3 months.",
    topics: ["Trade journaling system", "Weekly self-review process", "Diagnosing your mistakes", "3 months 1-on-1 with Ace"],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoursePage() {
  return (
    <div className="cp-root">
      <style>{css}</style>

      {/* NAV */}
      <nav className="cp-nav">
        <Link href="/" className="cp-nav-logo">▲ AVT — Ace&apos;s Dojo</Link>
        <div className="cp-nav-right">
          <Link href="/learn" className="cp-nav-ghost">Free pillars</Link>
          <a href={STRIPE_BLACK_BELT} className="cp-nav-cta">Enroll now →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="cp-hero">
        <p className="cp-eyebrow">Trading Time for Money</p>
        <h1 className="cp-h1">
          <span style={{ color: "var(--lv-white, #f0ede6)" }}>The full system.</span><br />
          <em>Belt by belt.</em>
        </h1>
        <p className="cp-hero-sub">
          Nine belts. Two offers. One proven system for trading NQ futures and building toward a funded account — taught by someone who&apos;s done it.
        </p>

        <div className="cp-proof">
          <span className="cp-proof-icon">⬡</span>
          <div>
            <p className="cp-proof-name">Emilio — first student</p>
            <p className="cp-proof-quote">
              Zero experience → consistent $300/day in a single 90-minute session. The system works when you follow the belts in order.
            </p>
          </div>
        </div>

        {/* TWO OFFERS */}
        <div className="cp-offers">
          <OfferCard
            badge="Most popular"
            badgeColor="green"
            title="AVT Student"
            price="$297"
            sub="One-time · Lifetime access"
            features={[
              "All 8 belt levels (Green → Brown II)",
              "Video lessons + written breakdown",
              "AVT exclusive Discord section",
              "Live trade review drops",
              "Future module updates included",
            ]}
            cta="Enroll — $297"
            href={STRIPE_STUDENT}
            highlight={true}
          />
          <OfferCard
            badge="Highest touch"
            badgeColor="gold"
            title="Black Belt"
            price="$1,000"
            sub="3-month coaching engagement"
            features={[
              "Everything in AVT Student",
              "3 months 1-on-1 with Ace",
              "Personal trade feedback",
              "Funded account gameplan built for you",
              "Black Belt Discord access",
              "Limited — 10 spots total",
            ]}
            cta="Apply — $1,000"
            href={STRIPE_BLACK_BELT}
            highlight={false}
          />
        </div>
      </section>

      {/* BELT BREAKDOWN */}
      <section className="cp-belts-section">
        <p className="cp-section-label">The belt system — what you&apos;re learning</p>
        <div className="cp-belts">
          {belts.map((belt, i) => (
            <BeltRow key={belt.id} belt={belt} index={i} />
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="cp-proof-section">
        <p className="cp-section-label">Why it works</p>
        <div className="cp-why-grid">
          {[
            { icon: "◈", title: "One instrument", body: "NQ futures only. No jumping between assets. Master one market before anything else." },
            { icon: "◈", title: "Two hours a day", body: "NY open, 9:30–11:30 AM EST. Highest volume. Cleanest setups. The rest of the day is yours." },
            { icon: "◈", title: "The math is built in", body: "2:1 minimum R:R means you can be wrong 40% of the time and still be profitable. The numbers work for you." },
            { icon: "◈", title: "Real proof", body: "Emilio went from zero to $300/day in one session. The system is teachable. The results are replicable." },
          ].map((item) => (
            <div key={item.title} className="cp-why-card">
              <span className="cp-why-icon">{item.icon}</span>
              <p className="cp-why-title">{item.title}</p>
              <p className="cp-why-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="cp-bottom-cta">
        <p className="cp-cta-eyebrow">Ready to start</p>
        <h2 className="cp-cta-h2">
          Pick your belt.<br /><em>Start today.</em>
        </h2>
        <p className="cp-cta-sub">
          Not sure which offer is right for you? Start with the free pillars first — White, Yellow, and Orange are fully free in Ace&apos;s Dojo.
        </p>
        <div className="cp-cta-btns">
          <a href={STRIPE_STUDENT} className="cp-btn-primary">Enroll as AVT Student — $297</a>
          <a href={STRIPE_BLACK_BELT} className="cp-btn-gold">Apply for Black Belt — $1,000</a>
          <Link href="/learn" className="cp-btn-ghost">Start with free content first →</Link>
        </div>
      </section>

      <footer className="cp-footer">
        <span className="cp-footer-logo"><span style={{color:"var(--cp-green)",opacity:0.5}}>▲ </span>AVT · Trading Time for Money · ace.venen</span>
        <span className="cp-footer-right">© 2026</span>
      </footer>
    </div>
  );
}

// ─── Belt Row ─────────────────────────────────────────────────────────────────

function BeltRow({ belt, index }: { belt: (typeof belts)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const isFree = belt.tier === "free" || belt.tier === "free-intro";
  const isBlack = belt.tier === "black";

  return (
    <div
      className="cp-belt-row"
      style={{ animationDelay: `${index * 0.04}s` }}
      onClick={() => setOpen((o) => !o)}
      role="button"
      tabIndex={0}
    >
      <div className="cp-belt-left">
        <div
          className="cp-belt-swatch"
          style={{ background: belt.color, boxShadow: `0 0 12px ${belt.colorDim}` }}
        />
        <div className="cp-belt-meta">
          <div className="cp-belt-top-row">
            <span className="cp-belt-label" style={{ color: belt.color }}>{belt.label}</span>
            <span
              className="cp-belt-tier-badge"
              style={{
                color: isFree ? "var(--cp-green)" : isBlack ? "var(--cp-gold)" : "var(--cp-muted2)",
                background: isFree ? "var(--cp-green-bg)" : isBlack ? "var(--cp-gold-bg)" : "rgba(255,255,255,0.04)",
                border: isFree ? "0.5px solid var(--cp-green-dim)" : isBlack ? "0.5px solid rgba(212,168,67,0.3)" : "0.5px solid var(--cp-border)",
              }}
            >
              {belt.tierLabel}
            </span>
          </div>
          <p className="cp-belt-title">{belt.title}</p>
          <p className="cp-belt-desc">{belt.desc}</p>
        </div>
      </div>
      <span className="cp-belt-toggle">{open ? "↑" : "↓"}</span>

      {open && (
        <div className="cp-belt-topics">
          {belt.topics.map((t) => (
            <div key={t} className="cp-belt-topic">
              <span style={{ color: belt.color }}>→</span>
              <span>{t}</span>
            </div>
          ))}
          {(belt.tier === "paid" || belt.tier === "black") && (
            <a
              href={belt.tier === "black" ? STRIPE_BLACK_BELT : STRIPE_STUDENT}
              className="cp-belt-enroll-btn"
              onClick={(e) => e.stopPropagation()}
            >
              {belt.tier === "black" ? "Apply for Black Belt →" : "Unlock with AVT Student →"}
            </a>
          )}
          {isFree && (
            <Link href="/learn" className="cp-belt-free-btn" onClick={(e) => e.stopPropagation()}>
              Access free →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────

function OfferCard({
  badge, badgeColor, title, price, sub, features, cta, href, highlight,
}: {
  badge: string; badgeColor: "green" | "gold"; title: string; price: string;
  sub: string; features: string[]; cta: string; href: string; highlight: boolean;
}) {
  return (
    <div className={`cp-offer-card ${highlight ? "cp-offer-highlight" : ""}`}>
      <span className={`cp-offer-badge cp-offer-badge-${badgeColor}`}>{badge}</span>
      <p className="cp-offer-title">{title}</p>
      <p className="cp-offer-price">{price}</p>
      <p className="cp-offer-sub">{sub}</p>
      <ul className="cp-offer-features">
        {features.map((f) => (
          <li key={f}>
            <span className={badgeColor === "green" ? "cp-check-green" : "cp-check-gold"}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a href={href} className={`cp-offer-cta ${highlight ? "cp-offer-cta-green" : "cp-offer-cta-gold"}`}>
        {cta}
      </a>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = `
  .cp-root {
    --cp-black: #080808;
    --cp-surface: #0f0f0f;
    --cp-surface2: #141414;
    --cp-white: #f0ede6;
    --cp-green: #1db87e;
    --cp-green-dim: #0d5c40;
    --cp-green-bg: #091a12;
    --cp-gold: #d4a843;
    --cp-gold-bg: #1a1204;
    --cp-border: rgba(240,237,230,0.08);
    --cp-border-b: rgba(240,237,230,0.15);
    --cp-muted: rgba(240,237,230,0.38);
    --cp-muted2: rgba(240,237,230,0.62);
    font-family: 'Syne', sans-serif;
    background: var(--cp-black);
    color: var(--cp-white);
    min-height: 100vh;
  }

  /* NAV */
  .cp-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.25rem; background: rgba(8,8,8,0.93); backdrop-filter: blur(12px); border-bottom: 0.5px solid var(--cp-border); }
  .cp-nav-logo { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--cp-green); text-transform: uppercase; text-decoration: none; }
  .cp-nav-logo::before { content: '▲'; font-size: 8px; margin-right: 6px; opacity: 0.6; }
  .cp-nav-right { display: flex; align-items: center; gap: 0.75rem; }
  .cp-nav-ghost { font-size: 11px; color: var(--cp-muted); text-decoration: none; font-family: 'DM Mono', monospace; letter-spacing: 0.03em; }
  .cp-nav-cta { font-size: 11px; font-weight: 700; padding: 6px 13px; border-radius: 6px; background: var(--cp-green); color: var(--cp-black); text-decoration: none; }

  /* HERO */
  .cp-hero { padding: 3rem 1.25rem 2rem; border-bottom: 0.5px solid var(--cp-border); animation: cpFadeUp 0.4s ease both; position: relative; overflow: hidden; }
  .cp-hero::after { content: '▲'; position: absolute; right: 1rem; top: 1rem; font-size: 80px; color: var(--cp-green); opacity: 0.03; pointer-events: none; line-height: 1; }
  .cp-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cp-green); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px; }
  .cp-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--cp-green); }
  .cp-h1 { font-size: 34px; font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1rem; }
  .cp-h1 em { font-style: normal; color: var(--cp-green); }
  .cp-hero-sub { font-size: 14px; color: var(--cp-muted2); max-width: 400px; line-height: 1.6; margin-bottom: 1.5rem; font-weight: 400; }
  .cp-proof { display: flex; align-items: flex-start; gap: 10px; background: var(--cp-green-bg); border: 0.5px solid var(--cp-green-dim); border-radius: 8px; padding: 12px 14px; margin-bottom: 1.75rem; }
  .cp-proof-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .cp-proof-name { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cp-green); margin-bottom: 3px; }
  .cp-proof-quote { font-size: 12px; color: var(--cp-muted2); line-height: 1.5; font-weight: 400; }

  /* OFFERS */
  .cp-offers { display: flex; flex-direction: column; gap: 12px; }
  .cp-offer-card { border: 0.5px solid var(--cp-border-b); border-radius: 12px; padding: 1.25rem; background: var(--cp-surface); position: relative; }
  .cp-offer-highlight { border-color: var(--cp-green-dim); background: var(--cp-green-bg); }
  .cp-offer-badge { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 8px; border-radius: 20px; position: absolute; top: -10px; left: 16px; }
  .cp-offer-badge-green { background: var(--cp-green-bg); color: var(--cp-green); border: 0.5px solid var(--cp-green-dim); }
  .cp-offer-badge-gold { background: var(--cp-gold-bg); color: var(--cp-gold); border: 0.5px solid rgba(212,168,67,0.3); }
  .cp-offer-title { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.25rem; }
  .cp-offer-price { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.25rem; }
  .cp-offer-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--cp-muted); letter-spacing: 0.05em; margin-bottom: 1rem; }
  .cp-offer-features { list-style: none; display: flex; flex-direction: column; gap: 7px; margin-bottom: 1.25rem; }
  .cp-offer-features li { font-size: 12px; color: var(--cp-muted2); display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
  .cp-check-green { color: var(--cp-green); flex-shrink: 0; }
  .cp-check-gold { color: var(--cp-gold); flex-shrink: 0; }
  .cp-offer-cta { display: block; text-align: center; padding: 13px; border-radius: 8px; font-weight: 800; font-size: 14px; text-decoration: none; letter-spacing: -0.01em; }
  .cp-offer-cta-green { background: var(--cp-green); color: var(--cp-black); }
  .cp-offer-cta-gold { background: var(--cp-gold); color: var(--cp-black); }

  /* BELT SECTION */
  .cp-belts-section { padding: 2rem 1.25rem; border-bottom: 0.5px solid var(--cp-border); }
  .cp-section-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cp-muted); margin-bottom: 1rem; }
  .cp-belts { display: flex; flex-direction: column; gap: 2px; }
  .cp-belt-row { border: 0.5px solid var(--cp-border); border-radius: 8px; padding: 12px 14px; cursor: pointer; animation: cpFadeUp 0.4s ease both; display: flex; flex-direction: column; gap: 0; background: rgba(255,255,255,0.02); transition: background 0.15s; }
  .cp-belt-row:hover { background: rgba(255,255,255,0.04); }
  .cp-belt-left { display: flex; align-items: flex-start; gap: 12px; }
  .cp-belt-swatch { width: 4px; height: 100%; min-height: 44px; border-radius: 2px; flex-shrink: 0; }
  .cp-belt-meta { flex: 1; min-width: 0; }
  .cp-belt-top-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; flex-wrap: wrap; }
  .cp-belt-label { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.08em; }
  .cp-belt-tier-badge { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 20px; letter-spacing: 0.05em; white-space: nowrap; }
  .cp-belt-title { font-size: 14px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 3px; }
  .cp-belt-desc { font-size: 12px; color: var(--cp-muted); line-height: 1.45; font-weight: 400; }
  .cp-belt-toggle { font-size: 12px; color: var(--cp-muted); align-self: flex-start; margin-left: auto; padding-top: 2px; flex-shrink: 0; }
  .cp-belt-topics { margin-top: 12px; padding-top: 12px; border-top: 0.5px solid var(--cp-border); display: flex; flex-direction: column; gap: 6px; }
  .cp-belt-topic { display: flex; gap: 8px; font-size: 12px; color: var(--cp-muted2); }
  .cp-belt-enroll-btn { display: inline-block; margin-top: 8px; font-size: 11px; font-weight: 700; padding: 7px 14px; border-radius: 6px; background: var(--cp-green); color: var(--cp-black); text-decoration: none; text-align: center; }
  .cp-belt-free-btn { display: inline-block; margin-top: 8px; font-size: 11px; font-weight: 600; padding: 7px 14px; border-radius: 6px; background: var(--cp-green-bg); color: var(--cp-green); border: 0.5px solid var(--cp-green-dim); text-decoration: none; }

  /* WHY GRID */
  .cp-proof-section { padding: 2rem 1.25rem; border-bottom: 0.5px solid var(--cp-border); }
  .cp-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cp-why-card { background: var(--cp-surface2); border: 0.5px solid var(--cp-border); border-radius: 8px; padding: 14px 12px; position: relative; overflow: hidden; }
  .cp-why-card::after { content: '▲'; position: absolute; bottom: -4px; right: 6px; font-size: 24px; color: var(--cp-green); opacity: 0.05; pointer-events: none; }
  .cp-why-icon { font-size: 16px; color: var(--cp-green); display: block; margin-bottom: 6px; }
  .cp-why-title { font-size: 13px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 5px; }
  .cp-why-body { font-size: 11px; color: var(--cp-muted); line-height: 1.5; font-weight: 400; }

  /* BOTTOM CTA */
  .cp-bottom-cta { padding: 2.5rem 1.25rem; text-align: center; position: relative; overflow: hidden; }
  .cp-bottom-cta::before { content: '▲'; position: absolute; left: 50%; transform: translateX(-50%); top: 0.5rem; font-size: 130px; color: var(--cp-green); opacity: 0.02; pointer-events: none; line-height: 1; }
  .cp-cta-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cp-muted); margin-bottom: 0.75rem; }
  .cp-cta-h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.5rem; line-height: 1.1; }
  .cp-cta-h2 em { font-style: normal; color: var(--cp-green); }
  .cp-cta-sub { font-size: 13px; color: var(--cp-muted); margin-bottom: 1.5rem; font-weight: 400; line-height: 1.5; max-width: 340px; margin-left: auto; margin-right: auto; }
  .cp-cta-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
  .cp-btn-primary { display: block; width: 100%; max-width: 340px; padding: 13px 20px; border-radius: 8px; background: var(--cp-green); color: var(--cp-black); font-weight: 800; font-size: 14px; text-decoration: none; text-align: center; }
  .cp-btn-gold { display: block; width: 100%; max-width: 340px; padding: 13px 20px; border-radius: 8px; background: var(--cp-gold); color: var(--cp-black); font-weight: 800; font-size: 14px; text-decoration: none; text-align: center; }
  .cp-btn-ghost { font-size: 12px; color: var(--cp-muted); text-decoration: none; font-family: 'DM Mono', monospace; letter-spacing: 0.03em; margin-top: 4px; }

  /* FOOTER */
  .cp-footer { padding: 1.25rem; border-top: 0.5px solid var(--cp-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
  .cp-footer-logo { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.08em; color: var(--cp-muted); text-transform: uppercase; }
  .cp-footer-right { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--cp-muted); }

  @keyframes cpFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
