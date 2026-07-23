"use client";

import { useState } from "react";
import { beltVideos, embedUrl } from "@/data/videos";

const DISCORD = "https://discord.gg/hReBrtPFx";
const AVT_HOME = "https://avt-website.vercel.app";

// ─── Data ────────────────────────────────────────────────────────────────────

const pillars = [
  {
    id: "p1",
    beltId: "white",
    num: "01",
    tier: "free",
    eyebrow: "Free — Full access",
    title: "Mindset & Emotional Discipline",
    videoLabel: "Pillar 1 — Video lesson (swap in your Loom / YouTube link)",
    videoSrc: "", // TODO: paste embed URL here
    content: <Pillar1 />,
  },
  {
    id: "p2",
    beltId: "yellow",
    num: "02",
    tier: "free",
    eyebrow: "Free — Full access",
    title: "Foundational Rules",
    videoLabel: "Pillar 2 — Video lesson (swap in your Loom / YouTube link)",
    videoSrc: "",
    content: <Pillar2 />,
  },
  {
    id: "p3",
    beltId: "orange",
    num: "03",
    tier: "partial",
    eyebrow: "Free intro · Application is paid",
    title: "Reading Price Action",
    videoLabel: "Pillar 3 — Price action intro (swap in your Loom / YouTube link)",
    videoSrc: "",
    content: <Pillar3 />,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPage() {
  return (
    <div className="learn-root">
      <style>{css}</style>

      {/* NAV */}
      <nav className="l-nav">
        <span className="l-nav-logo">AVT — Ace&apos;s Dojo</span>
        <div className="l-nav-right">
          <span className="l-pill">free content</span>
          <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="l-nav-cta">
            Join the Dojo →
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="l-hero">
        <p className="l-eyebrow">Trading Time for Money</p>
        <h1 className="l-h1">
          Learn the system.<br /><em>Free.</em>
        </h1>
        <p className="l-hero-sub">
          Three foundational pillars. No fluff, no gatekeeping. This is what separates traders who survive from traders who blow up.
        </p>

        <div className="l-proof">
          <span className="l-proof-icon">⬡</span>
          <div>
            <p className="l-proof-name">Emilio — first student</p>
            <p className="l-proof-quote">
              Zero trading knowledge → consistent $300/day after one 90-minute session. That&apos;s what these pillars make possible.
            </p>
          </div>
        </div>

        <div className="l-hero-mods">
          <a href="#p1" className="l-mod l-mod-free">01 — Mindset</a>
          <a href="#p2" className="l-mod l-mod-free">02 — The Rules</a>
          <a href="#p3" className="l-mod l-mod-free">03 — Price Action ↗</a>
          <span className="l-mod l-mod-locked">04–08 — The Strategy 🔒</span>
        </div>
      </section>

      {/* PILLARS */}
      {pillars.map((p) => (
        <PillarModule key={p.id} pillar={p} />
      ))}

      {/* CTA */}
      <section className="l-cta">
        <p className="l-cta-eyebrow">You&apos;ve got the foundation</p>
        <h2 className="l-cta-h2">
          Now learn the<br /><em>actual setup.</em>
        </h2>
        <p className="l-cta-sub">
          The 9/20 EMA flag system. Daily bias to 5-minute entry. How to pass a funded account. Everything is inside the Dojo.
        </p>
        <div className="l-cta-btns">
          <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="l-btn-primary">
            Join Ace&apos;s Dojo — Free
          </a>
          <a href={AVT_HOME} className="l-btn-secondary">
            Learn more about AVT →
          </a>
        </div>
      </section>

      <footer className="l-footer">
        <span className="l-footer-logo">AVT · ace.venen</span>
        <span className="l-footer-right">© 2026</span>
      </footer>
    </div>
  );
}

// ─── Module accordion ─────────────────────────────────────────────────────────

function PillarModule({ pillar }: { pillar: (typeof pillars)[0] }) {
  const [open, setOpen] = useState(true);
  const isFree = pillar.tier === "free";

  return (
    <div className="l-module" id={pillar.id}>
      <div className="l-mod-header" onClick={() => setOpen((o) => !o)} role="button" tabIndex={0}>
        <div className={`l-mod-num ${isFree ? "l-mod-num-free" : "l-mod-num-partial"}`}>
          {pillar.num}
        </div>
        <div className="l-mod-meta">
          <p className="l-mod-eyebrow">{pillar.eyebrow}</p>
          <p className={`l-mod-title ${isFree ? "l-title-free" : "l-title-partial"}`}>
            {pillar.title}
          </p>
        </div>
        <span className={`l-badge ${isFree ? "l-badge-free" : "l-badge-partial"}`}>
          {open ? "collapse ↑" : "open ↓"}
        </span>
      </div>

      {open && (
        <div className="l-mod-body">
          {/* Video block — pulls from the central belt-video config */}
          {beltVideos[pillar.beltId]?.youTubeId ? (
            <div className="l-video-embed">
              <iframe
                src={embedUrl(beltVideos[pillar.beltId].youTubeId!)}
                title={beltVideos[pillar.beltId].label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : beltVideos[pillar.beltId]?.src ? (
            <div className="l-video-embed">
              <video
                src={beltVideos[pillar.beltId].src}
                controls
                preload="metadata"
                playsInline
                title={beltVideos[pillar.beltId].label}
              />
            </div>
          ) : (
            <div className="l-video-placeholder">
              <div className="l-play" />
              <span className="l-video-label">{pillar.videoLabel}</span>
            </div>
          )}

          {pillar.content}
        </div>
      )}
    </div>
  );
}

// ─── Pillar content components ────────────────────────────────────────────────

function Pillar1() {
  return (
    <>
      <p className="l-intro">
        Most people don&apos;t fail trading because they couldn&apos;t find a setup. They fail because they couldn&apos;t handle the emotion of being wrong. Tilt, revenge trading, FOMO, ego — these kill funded accounts faster than any bad entry.
      </p>

      <p className="l-section-title">The four killers</p>
      <ul className="l-list">
        <li><strong>Tilt</strong> — Taking a loss badly and immediately re-entering without a setup. You&apos;re not trading anymore, you&apos;re reacting.</li>
        <li><strong>Revenge trading</strong> — Doubling size after a loss to &quot;get it back.&quot; The market doesn&apos;t owe you anything. You&apos;re now at 2x risk while emotional.</li>
        <li><strong>FOMO</strong> — Entering late because a move is already in motion. You&apos;re chasing. Your entry is garbage and you know it.</li>
        <li><strong>Overtrading</strong> — Taking 6 trades when your system only gave you 2 setups. More trades ≠ more money.</li>
      </ul>

      <div className="l-callout">
        <p className="l-callout-label">The real edge</p>
        <p>Discipline is the strategy. A perfect setup executed badly is a loss. A mediocre setup executed with full discipline is often a win. Your job is to follow the rules, not outsmart the market.</p>
      </div>

      <p className="l-section-title">How to build the habit</p>
      <ul className="l-list">
        <li>Set a daily loss limit and treat it like a circuit breaker — once hit, session over. No exceptions.</li>
        <li>If you take two losses back to back, step away for 15 minutes minimum before re-entering.</li>
        <li>Journal every trade. Not just the P&amp;L — how you felt before and after the entry. Patterns will emerge.</li>
        <li>Ask after every trade: &quot;Did I follow my rules?&quot; Not &quot;Did I make money?&quot;</li>
      </ul>

      <div className="l-callout">
        <p className="l-callout-label">Ace&apos;s rule</p>
        <p>If I wouldn&apos;t take the trade fresh and fully calm, I don&apos;t take it. Emotional state is part of the entry criteria.</p>
      </div>
    </>
  );
}

function Pillar2() {
  const rules = [
    { label: "Instrument", value: "NQ Futures (Nasdaq 100)", note: "Highly liquid. Predictable volatility. Clean technical structure. Don't add instruments until you've mastered one." },
    { label: "Session", value: "NY Open · 9:30–11:30 AM EST", note: "Highest volume, cleanest moves. Outside this window the setup probability drops significantly." },
    { label: "Stop Loss", value: "Always set before entry", note: "No SL = no trade. This is the rule that keeps you in the game when you're wrong." },
    { label: "Risk / Reward", value: "2:1 minimum · 3:1 target", note: "You can be wrong 40% of the time and still be profitable at 2:1. The math works for you, not against you." },
    { label: "Risk per trade", value: "1–2% of account max", note: "Prop firm accounts (Topstep, Lucid) typically have 2–4% daily loss limits. Stay well inside them." },
  ];

  const math = [
    { scenario: "2:1 RR, average trader", trades: 10, wr: "50%", result: "+5R profit", win: true },
    { scenario: "2:1 RR, bad week", trades: 10, wr: "40%", result: "+2R profit", win: true },
    { scenario: "No RR, no system", trades: 10, wr: "60%", result: "−2R loss", win: false },
  ];

  const checklist = [
    "SL is placed and I know the exact dollar risk",
    "TP is at least 2x my SL distance",
    "I'm trading NQ during NY open hours",
    "This trade risks 2% of account or less",
    "I'm not in a revenge/FOMO state",
  ];

  return (
    <>
      <p className="l-intro">
        This is the math before the chart. You can have the best setup in the world — if your risk management is broken, you will blow up. These are non-negotiables. Not guidelines. Not suggestions.
      </p>

      <p className="l-section-title">The non-negotiables</p>
      {rules.map((r) => (
        <div key={r.label} className="l-rule-block">
          <p className="l-rule-label">{r.label}</p>
          <p className="l-rule-value">{r.value}</p>
          <p className="l-rule-note">{r.note}</p>
        </div>
      ))}

      <p className="l-section-title" style={{ marginTop: "1.25rem" }}>The math</p>
      <table className="l-table">
        <thead>
          <tr>
            <th>Scenario</th><th>Trades</th><th>Win rate</th><th>Result</th>
          </tr>
        </thead>
        <tbody>
          {math.map((row) => (
            <tr key={row.scenario}>
              <td>{row.scenario}</td>
              <td>{row.trades}</td>
              <td>{row.wr}</td>
              <td style={{ color: row.win ? "var(--lv-green)" : "var(--lv-red)" }}>{row.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="l-callout">
        <p className="l-callout-label">Why most people fail</p>
        <p>They take 1:1 trades at best, let losers run and cut winners early. Even with a 60% win rate, the math kills them. Fix the ratio first.</p>
      </div>

      <p className="l-section-title">Before every trade</p>
      <div className="l-checklist">
        {checklist.map((item) => (
          <div key={item} className="l-check-item">
            <div className="l-check-box" />
            <span className="l-check-text">{item}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Pillar3() {
  return (
    <>
      <p className="l-intro">
        Before you can trade a setup, you need to speak the language of the chart. This is the vocabulary — what price is actually telling you, candle by candle.
      </p>

      <p className="l-section-title">Reading candles</p>
      <div className="l-candle-row">
        <div className="l-candle-card">
          <div className="l-candle-visual">
            <div className="l-candle-bull">
              <div className="l-wick l-wick-top" />
              <div className="l-wick l-wick-bot" />
            </div>
          </div>
          <p className="l-candle-label">Bullish — closed higher. Buyers in control.</p>
        </div>
        <div className="l-candle-card">
          <div className="l-candle-visual">
            <div className="l-candle-bear">
              <div className="l-wick l-wick-top" />
              <div className="l-wick l-wick-bot" />
            </div>
          </div>
          <p className="l-candle-label">Bearish — closed lower. Sellers in control.</p>
        </div>
      </div>
      <p className="l-caption">The wicks tell you where price was rejected. Long wick = failed push. That rejection is information.</p>

      <p className="l-section-title">Market structure</p>
      <ul className="l-list">
        <li><strong>Higher Highs / Higher Lows (HH/HL)</strong> — Uptrend confirmed. Each pullback creates a higher low before pushing to a new high.</li>
        <li><strong>Lower Highs / Lower Lows (LH/LL)</strong> — Downtrend confirmed. Each bounce gets rejected lower.</li>
        <li><strong>Break of Structure (BoS)</strong> — When a swing high or low is taken out. Often the start of a new move or reversal signal.</li>
      </ul>

      <p className="l-section-title">Supply &amp; Demand zones</p>
      <ul className="l-list">
        <li>Supply zone (resistance) — Area where price moved down aggressively from. Sellers were there before, likely still there.</li>
        <li>Demand zone (support) — Area where price moved up aggressively from. Buyers were there before, likely still there.</li>
        <li>The more times a zone holds, the more significant it becomes. Too many tests = weakening zone.</li>
      </ul>

      <div className="l-lock-gate">
        <p className="l-lock-label">🔒 Paid — application continues here</p>
        <p>You now understand the vocabulary. The next module is where it clicks: daily bias, the 9/20 EMA flag setup, 5-minute entries. That&apos;s where the money is.</p>
        <a href={DISCORD} target="_blank" rel="noopener noreferrer">Join the Dojo to get access →</a>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = `
  .learn-root {
    --lv-black: #080808;
    --lv-surface: #0f0f0f;
    --lv-surface2: #141414;
    --lv-white: #f0ede6;
    --lv-green: #1db87e;
    --lv-green-dim: #0d5c40;
    --lv-green-bg: #091a12;
    --lv-red: #c94a2a;
    --lv-red-bg: #1a0b07;
    --lv-gold: #d4a843;
    --lv-gold-bg: #1a1204;
    --lv-border: rgba(240,237,230,0.08);
    --lv-border-b: rgba(240,237,230,0.15);
    --lv-muted: rgba(240,237,230,0.38);
    --lv-muted2: rgba(240,237,230,0.62);
    font-family: 'Syne', sans-serif;
    background: var(--lv-black);
    color: var(--lv-white);
    min-height: 100vh;
  }

  /* NAV */
  .l-nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.9rem 1.25rem;
    background: rgba(8,8,8,0.93);
    backdrop-filter: blur(12px);
    border-bottom: 0.5px solid var(--lv-border);
  }
  .l-nav-logo { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--lv-green); text-transform: uppercase; }
  .l-nav-right { display: flex; align-items: center; gap: 0.75rem; }
  .l-pill { font-size: 10px; font-family: 'DM Mono', monospace; padding: 4px 10px; border-radius: 20px; background: var(--lv-green-bg); color: var(--lv-green); border: 0.5px solid var(--lv-green-dim); letter-spacing: 0.05em; }
  .l-nav-cta { font-size: 11px; font-weight: 700; padding: 6px 13px; border-radius: 6px; background: var(--lv-green); color: var(--lv-black); text-decoration: none; letter-spacing: -0.01em; }

  /* HERO */
  .l-hero { padding: 3rem 1.25rem 2rem; border-bottom: 0.5px solid var(--lv-border); animation: lvFadeUp 0.4s ease both; }
  .l-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lv-green); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px; }
  .l-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--lv-green); }
  .l-h1 { font-size: 34px; font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 1rem; }
  .l-h1 em { font-style: normal; color: var(--lv-green); }
  .l-hero-sub { font-size: 14px; color: var(--lv-muted2); max-width: 380px; line-height: 1.6; margin-bottom: 1.5rem; font-weight: 400; }
  .l-proof { display: flex; align-items: flex-start; gap: 10px; background: var(--lv-green-bg); border: 0.5px solid var(--lv-green-dim); border-radius: 8px; padding: 12px 14px; margin-bottom: 1.5rem; }
  .l-proof-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .l-proof-name { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--lv-green); margin-bottom: 3px; }
  .l-proof-quote { font-size: 12px; color: var(--lv-muted2); line-height: 1.5; font-weight: 400; }
  .l-hero-mods { display: flex; gap: 6px; flex-wrap: wrap; }
  .l-mod { font-size: 10px; font-family: 'DM Mono', monospace; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.03em; text-decoration: none; transition: opacity 0.15s; }
  .l-mod-free { background: var(--lv-green-bg); color: var(--lv-green); border: 0.5px solid var(--lv-green-dim); }
  .l-mod-locked { background: rgba(255,255,255,0.04); color: var(--lv-muted); border: 0.5px solid var(--lv-border); cursor: default; }

  /* MODULE */
  .l-module { border-bottom: 0.5px solid var(--lv-border); animation: lvFadeUp 0.45s ease both; }
  .l-mod-header { display: flex; align-items: center; gap: 14px; padding: 1.5rem 1.25rem 1.25rem; cursor: pointer; user-select: none; }
  .l-mod-num { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; flex-shrink: 0; }
  .l-mod-num-free { background: var(--lv-green-bg); color: var(--lv-green); border: 0.5px solid var(--lv-green-dim); }
  .l-mod-num-partial { background: var(--lv-gold-bg); color: var(--lv-gold); border: 0.5px solid rgba(212,168,67,0.3); }
  .l-mod-meta { flex: 1; min-width: 0; }
  .l-mod-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lv-muted); margin-bottom: 3px; }
  .l-mod-title { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
  .l-title-free { color: var(--lv-white); }
  .l-title-partial { color: var(--lv-white); }
  .l-badge { font-size: 9px; font-family: 'DM Mono', monospace; padding: 3px 8px; border-radius: 20px; letter-spacing: 0.05em; white-space: nowrap; flex-shrink: 0; }
  .l-badge-free { background: var(--lv-green-bg); color: var(--lv-green); border: 0.5px solid var(--lv-green-dim); }
  .l-badge-partial { background: var(--lv-gold-bg); color: var(--lv-gold); border: 0.5px solid rgba(212,168,67,0.3); }
  .l-mod-body { padding: 0 1.25rem 1.75rem; }

  /* VIDEO */
  .l-video-placeholder { background: var(--lv-surface2); border: 0.5px solid var(--lv-border-b); border-radius: 10px; aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-bottom: 1.25rem; cursor: pointer; position: relative; overflow: hidden; }
  .l-video-placeholder::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(29,184,126,0.04) 0%, transparent 60%); }
  .l-play { width: 48px; height: 48px; border-radius: 50%; background: rgba(29,184,126,0.15); border: 1px solid var(--lv-green-dim); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
  .l-play::after { content: ''; width: 0; height: 0; border-style: solid; border-width: 8px 0 8px 14px; border-color: transparent transparent transparent var(--lv-green); margin-left: 3px; }
  .l-video-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--lv-muted); letter-spacing: 0.1em; text-transform: uppercase; position: relative; z-index: 1; text-align: center; padding: 0 1rem; }
  .l-video-embed { margin-bottom: 1.25rem; border-radius: 10px; overflow: hidden; aspect-ratio: 16/9; }
  .l-video-embed iframe, .l-video-embed video { width: 100%; height: 100%; border: none; object-fit: contain; background: #000; display: block; }

  /* CONTENT PIECES */
  .l-intro { font-size: 13px; color: var(--lv-muted2); line-height: 1.7; margin-bottom: 1.25rem; font-weight: 400; }
  .l-section-title { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lv-green); margin-bottom: 0.6rem; margin-top: 1.25rem; }
  .l-list { list-style: none; display: flex; flex-direction: column; gap: 6px; margin-bottom: 0.5rem; }
  .l-list li { font-size: 12px; color: var(--lv-muted2); line-height: 1.55; padding-left: 16px; position: relative; font-weight: 400; }
  .l-list li::before { content: '→'; position: absolute; left: 0; color: var(--lv-green); font-size: 11px; }
  .l-callout { border-left: 2px solid var(--lv-green); padding: 10px 14px; background: var(--lv-green-bg); border-radius: 0 6px 6px 0; margin: 1rem 0; }
  .l-callout-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--lv-green); margin-bottom: 4px; }
  .l-callout p { font-size: 12px; color: var(--lv-muted2); line-height: 1.55; font-weight: 400; }
  .l-rule-block { background: var(--lv-surface2); border: 0.5px solid var(--lv-border); border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; }
  .l-rule-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--lv-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
  .l-rule-value { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; color: var(--lv-white); }
  .l-rule-note { font-size: 11px; color: var(--lv-muted); margin-top: 4px; font-weight: 400; line-height: 1.4; }
  .l-table { width: 100%; border-collapse: collapse; margin: 0.75rem 0 1rem; font-size: 11px; }
  .l-table th { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lv-muted); text-align: left; padding: 6px 8px; border-bottom: 0.5px solid var(--lv-border); }
  .l-table td { padding: 7px 8px; border-bottom: 0.5px solid var(--lv-border); color: var(--lv-muted2); }
  .l-table td:first-child { font-size: 11px; color: var(--lv-white); }
  .l-table tr:last-child td { border-bottom: none; }
  .l-checklist { display: flex; flex-direction: column; gap: 6px; margin: 0.75rem 0; }
  .l-check-item { display: flex; align-items: flex-start; gap: 10px; background: var(--lv-surface2); border: 0.5px solid var(--lv-border); border-radius: 6px; padding: 9px 12px; }
  .l-check-box { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--lv-green-dim); flex-shrink: 0; margin-top: 1px; }
  .l-check-text { font-size: 12px; color: var(--lv-muted2); line-height: 1.4; font-weight: 400; }
  .l-candle-row { display: flex; gap: 10px; margin: 0.75rem 0; }
  .l-candle-card { flex: 1; background: var(--lv-surface2); border: 0.5px solid var(--lv-border); border-radius: 8px; padding: 10px; text-align: center; }
  .l-candle-visual { display: flex; align-items: center; justify-content: center; height: 44px; margin-bottom: 6px; }
  .l-candle-bull, .l-candle-bear { width: 14px; height: 28px; border-radius: 2px; position: relative; }
  .l-candle-bull { background: var(--lv-green); }
  .l-candle-bear { background: var(--lv-red); }
  .l-wick { position: absolute; left: 50%; transform: translateX(-50%); width: 1.5px; background: rgba(240,237,230,0.35); height: 8px; }
  .l-wick-top { top: -8px; }
  .l-wick-bot { bottom: -8px; }
  .l-candle-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--lv-muted); line-height: 1.4; }
  .l-caption { font-size: 11px; color: var(--lv-muted); font-family: 'DM Mono', monospace; font-style: italic; margin-bottom: 1rem; line-height: 1.4; }
  .l-lock-gate { background: var(--lv-red-bg); border: 0.5px solid rgba(201,74,42,0.3); border-radius: 8px; padding: 14px; margin-top: 1.25rem; text-align: center; }
  .l-lock-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--lv-red); margin-bottom: 6px; }
  .l-lock-gate p { font-size: 12px; color: var(--lv-muted); line-height: 1.5; margin-bottom: 10px; font-weight: 400; }
  .l-lock-gate a { display: inline-block; font-size: 11px; font-weight: 700; padding: 7px 16px; border-radius: 6px; background: var(--lv-green); color: var(--lv-black); text-decoration: none; }

  /* CTA */
  .l-cta { padding: 2.5rem 1.25rem; text-align: center; }
  .l-cta-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--lv-muted); margin-bottom: 0.75rem; }
  .l-cta-h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.5rem; line-height: 1.1; }
  .l-cta-h2 em { font-style: normal; color: var(--lv-green); }
  .l-cta-sub { font-size: 13px; color: var(--lv-muted); margin-bottom: 1.5rem; font-weight: 400; line-height: 1.5; }
  .l-cta-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
  .l-btn-primary { display: block; width: 100%; max-width: 320px; padding: 13px 20px; border-radius: 8px; background: var(--lv-green); color: var(--lv-black); font-weight: 800; font-size: 14px; text-decoration: none; letter-spacing: -0.01em; text-align: center; }
  .l-btn-secondary { display: block; width: 100%; max-width: 320px; padding: 12px 20px; border-radius: 8px; background: transparent; color: var(--lv-muted2); font-weight: 600; font-size: 13px; text-decoration: none; border: 0.5px solid var(--lv-border-b); text-align: center; }

  /* FOOTER */
  .l-footer { padding: 1.25rem; border-top: 0.5px solid var(--lv-border); display: flex; justify-content: space-between; align-items: center; }
  .l-footer-logo { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: var(--lv-muted); text-transform: uppercase; }
  .l-footer-right { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--lv-muted); }

  @keyframes lvFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
