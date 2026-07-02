import Link from "next/link";
import { checkoutUrl } from "@/lib/checkout";

// TODO(Ace): this invite expires 2026-07-03 — replace with a permanent invite.
const DISCORD = "https://discord.gg/hReBrtPFx";

const belts = [
  { label: "White", color: "#f0ede6" },
  { label: "Yellow", color: "#d4c44a" },
  { label: "Orange", color: "#d4843a" },
  { label: "Green", color: "#1db87e" },
  { label: "Blue", color: "#4a8fd4" },
  { label: "Purple", color: "#9b59b6" },
  { label: "Brown", color: "#a0673a" },
  { label: "Brown II", color: "#8a5530" },
  { label: "Black", color: "#3a3a3a" },
];

export default function Home() {
  return (
    <div className="lp-root">
      <style>{css}</style>

      <nav className="lp-nav">
        <Link href="/" className="lp-nav-logo">Ace Venen Trading</Link>
        <div className="lp-nav-links">
          <Link href="/learn">Free Course</Link>
          <Link href="/paid">Student Portal</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <h1 className="lp-headline">
          Discover The <span className="gold-italic">One System</span> That
          Took Me From <span className="gold-italic">$200 → $20,000</span> In
          90 Days Scalping NQ.
        </h1>
        <p className="lp-hero-sub">
          10 years of trading experience. The same approach that&apos;s helped
          students pass Topstep, Lucid, and bank consistent{" "}
          <strong>$1,500+ days.</strong>
        </p>

        <div className="lp-video-box">
          <div className="lp-play-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <div className="lp-video-label">Watch how the system works</div>
          <div className="lp-video-hint">Drop your video file here when ready</div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* RESULTS */}
      <section className="lp-results">
        <div className="lp-results-header">
          <h2 className="lp-results-title">
            Real <span className="gold-italic">Results</span> From Real{" "}
            <span className="gold-italic">Traders</span>
            <br />
            Inside Ace Venen Trading
          </h2>
          <p className="lp-results-sub">Receipts. Screenshots. Funded Payouts.</p>
        </div>
        <div className="lp-pnl-cards">
          {[
            { amount: "+$18,686", name: "Chris — 15 days, part-time", detail: "Topstep combine, working full-time job" },
            { amount: "+$1,510", name: "Tuesday session — NQ scalp", detail: "4 trades, 62 minutes" },
            { amount: "+$3,037", name: "April combine — passed Topstep $50K", detail: "Upload your screenshot here" },
          ].map((r) => (
            <div key={r.amount} className="lp-pnl-card">
              <div className="lp-pnl-screenshot"><span>P&amp;L Screenshot</span></div>
              <div className="lp-pnl-info">
                <div className="lp-pnl-amount">{r.amount}</div>
                <div className="lp-pnl-name">{r.name}</div>
                <div className="lp-pnl-detail">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-divider" />

      {/* QUOTE */}
      <section className="lp-quote">
        <blockquote className="lp-quote-text">
          &quot;First time my coach didn&apos;t ghost after the third call. He
          stays until you&apos;re actually{" "}
          <span className="underline-gold">profitable.</span>&quot;
        </blockquote>
        <p className="lp-quote-attr">— Student, 2026 Cohort</p>
      </section>

      {/* OFFERS — three products */}
      <section className="lp-offer" id="offers">
        <div className="lp-offer-inner">
          <div className="lp-offer-tag">Three Ways In</div>
          <h2 className="lp-offer-title">Pick your path.</h2>
          <p className="lp-offer-subtitle">
            Learn the system yourself, trade alongside me, or go 1-on-1.
            <br />
            Every path runs on the <strong>same AVT system.</strong>
          </p>

          {/* 1 — THE COURSE */}
          <div className="lp-offer-card">
            <div className="lp-card-tag">The Course</div>
            <div className="lp-offer-price"><sup>$</sup>297</div>
            <div className="lp-offer-period">One-time — lifetime access</div>
            <div className="lp-belt-strip" aria-label="Belt progression: White to Black">
              {belts.map((b) => (
                <span key={b.label} className="lp-belt-seg" style={{ background: b.color }} title={b.label} />
              ))}
            </div>
            <p className="lp-belt-caption">Level up belt by belt — White to Black.</p>
            <ul className="lp-offer-features">
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>The full belt curriculum, start to finish</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>The 9/20 EMA system, broken down step by step</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Risk, position management, and the mental game</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Funded account gameplan — Topstep and Lucid</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Lifetime access to the student portal</li>
            </ul>
            <a href={checkoutUrl("course")} className="lp-offer-cta">Get the Course</a>
            <p className="lp-offer-fine">
              White through Orange Belt are <strong>free forever</strong> —{" "}
              <Link href="/learn">start there</Link> before you spend a dollar.
            </p>
          </div>

          {/* 2 — SIGNALS / AUTOPILOT */}
          <div className="lp-offer-card">
            <div className="lp-card-tag">Trade With Me</div>
            <div className="lp-offer-price"><sup>$</sup>97<span className="lp-price-mo">/mo</span></div>
            <div className="lp-offer-period">Signals — my trade alerts, in real time</div>
            <ul className="lp-offer-features">
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Real-time entries, stops, and targets</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Context on every call — why the trade, not just the ticker</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Cancel anytime</li>
            </ul>
            <a href={checkoutUrl("signals")} className="lp-offer-cta">Start Signals</a>

            <div className="lp-card-split" />

            <div className="lp-offer-price"><sup>$</sup>197<span className="lp-price-mo">/mo</span></div>
            <div className="lp-offer-period">Autopilot — the AVT bot trades the system for you</div>
            <ul className="lp-offer-features">
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Automated execution of the AVT system</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Fixed stops and a daily circuit breaker built in</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Volume-adaptive trailing to lock in gains</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Setup guide and onboarding</li>
            </ul>
            <a href={checkoutUrl("autopilot")} className="lp-offer-cta lp-cta-outline">Get Autopilot</a>
          </div>

          {/* 3 — COACHING */}
          <div className="lp-offer-card lp-card-featured">
            <div className="lp-card-tag">Black Belt Coaching</div>
            <div className="lp-spots-badge">⚡ 10 seats only — application reviewed</div>
            <div className="lp-offer-price"><sup>$</sup>1,000</div>
            <div className="lp-offer-period">One-time — 3 month intensive</div>
            <ul className="lp-offer-features">
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>1-on-1 coaching with Ace for 3 full months</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>24/7 direct access — no ticket system, no delays</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Weekly 1-on-1 calls and live trade reviews</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Your trading reviewed and rebuilt around your goals</li>
              <li className="lp-offer-feature"><span className="lp-fcheck">✓</span>Coaching focused on passing your first funded account</li>
            </ul>
            <Link href="/apply" className="lp-offer-cta">Apply for Black Belt</Link>
            <p className="lp-offer-fine">
              Applications reviewed — not first-come. No ghosting. No upsells.
              One outcome.
            </p>
          </div>
        </div>
      </section>

      {/* DISCORD */}
      <section className="lp-discord">
        <div className="lp-discord-inner">
          <div className="lp-discord-tag">Free Community</div>
          <h2 className="lp-discord-title">
            Not ready to commit?
            <br />
            Join the free Discord.
          </h2>
          <p className="lp-discord-sub">
            See how Ace trades. Watch student results come in. Get a feel for
            the system before you commit a dollar.
          </p>
          <ul className="lp-discord-perks">
            <li className="lp-discord-perk">Daily trade breakdowns from Ace</li>
            <li className="lp-discord-perk">Market recaps after every session</li>
            <li className="lp-discord-perk">Student wins posted in real time</li>
            <li className="lp-discord-perk">Free NQ education and setups</li>
          </ul>
          <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="lp-discord-btn">
            Join the Free Discord
          </a>
          <p className="lp-discord-note">Free forever. No credit card. No catch.</p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="lp-disclaimer">
        <p>
          <strong>DISCLAIMER:</strong> Individuals&apos; Results May Vary. The
          figures stated above are our personal figures. Please understand our
          results are not typical, we are not implying you&apos;ll duplicate
          them (or do anything for that matter). The average person who buys
          any &quot;how to&quot; information gets little to no results. Your
          results will vary and depend on many factors including but not
          limited to your background, experience, and work ethic. All education
          programs require risk and the assumption of consistent action.
        </p>
        <p>© 2026 Ace Venen Trading. Trading involves substantial risk and may result in loss of capital.</p>
      </div>
    </div>
  );
}

const css = `
  .lp-root { background: var(--ink); color: var(--paper); min-height: 100vh; }

  /* NAV */
  .lp-nav { padding: 28px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; max-width: 680px; margin: 0 auto; }
  .lp-nav-logo { font-size: .75rem; letter-spacing: .25em; color: var(--muted); text-transform: uppercase; text-decoration: none; }
  .lp-nav-links { display: flex; gap: 18px; }
  .lp-nav-links a { font-size: .72rem; color: var(--muted); text-decoration: none; letter-spacing: .05em; transition: color .2s; }
  .lp-nav-links a:hover { color: var(--gold); }

  /* HERO */
  .lp-hero { padding: 80px 24px 72px; text-align: center; }
  .lp-headline { font-size: clamp(2rem, 7vw, 3.2rem); font-weight: 700; line-height: 1.2; letter-spacing: -.02em; max-width: 640px; margin: 0 auto 24px; }
  .gold-italic { color: var(--gold); font-family: var(--font-playfair), serif; font-style: italic; }
  .lp-hero-sub { font-size: 1rem; color: var(--muted); max-width: 480px; margin: 0 auto 48px; line-height: 1.7; }
  .lp-hero-sub strong { color: var(--paper); }

  /* VIDEO */
  .lp-video-box { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 64px 24px; max-width: 580px; margin: 0 auto; cursor: pointer; transition: border-color .2s; }
  .lp-video-box:hover { border-color: rgba(232,184,75,.3); }
  .lp-play-btn { width: 64px; height: 64px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .lp-play-btn svg { margin-left: 4px; }
  .lp-video-label { font-weight: 600; font-size: .95rem; margin-bottom: 6px; }
  .lp-video-hint { font-size: .78rem; color: var(--muted); }

  .lp-divider { height: 1px; background: var(--border); }

  /* RESULTS */
  .lp-results { padding: 80px 24px; }
  .lp-results-header { text-align: center; margin-bottom: 56px; }
  .lp-results-title { font-size: clamp(1.6rem, 5vw, 2.4rem); font-weight: 700; line-height: 1.25; margin-bottom: 10px; }
  .lp-results-sub { font-size: .78rem; letter-spacing: .15em; color: var(--muted); text-transform: uppercase; }
  .lp-pnl-cards { display: flex; flex-direction: column; gap: 16px; max-width: 580px; margin: 0 auto; }
  .lp-pnl-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .lp-pnl-screenshot { border: 1.5px dashed rgba(255,255,255,.12); border-radius: 6px; margin: 16px 16px 0; padding: 40px 16px; text-align: center; }
  .lp-pnl-screenshot span { font-size: .7rem; letter-spacing: .15em; color: rgba(255,255,255,.2); text-transform: uppercase; }
  .lp-pnl-info { padding: 16px 20px 20px; }
  .lp-pnl-amount { font-size: 1.6rem; font-weight: 700; color: var(--gold); margin-bottom: 4px; }
  .lp-pnl-name { font-size: .92rem; font-weight: 600; margin-bottom: 2px; }
  .lp-pnl-detail { font-size: .8rem; color: var(--muted); }

  /* QUOTE */
  .lp-quote { padding: 80px 24px; text-align: center; border-top: 1px solid var(--border); }
  .lp-quote-text { font-family: var(--font-playfair), serif; font-style: italic; font-size: clamp(1.25rem, 4vw, 1.75rem); line-height: 1.55; max-width: 560px; margin: 0 auto 20px; }
  .underline-gold { color: var(--gold); text-decoration: underline; text-decoration-color: rgba(232,184,75,.5); text-underline-offset: 4px; }
  .lp-quote-attr { font-size: .72rem; letter-spacing: .2em; color: var(--muted); text-transform: uppercase; }

  /* OFFERS */
  .lp-offer { padding: 80px 24px; border-top: 1px solid var(--border); }
  .lp-offer-inner { max-width: 580px; margin: 0 auto; text-align: center; }
  .lp-offer-tag { font-size: .68rem; letter-spacing: .2em; color: var(--gold); text-transform: uppercase; margin-bottom: 14px; }
  .lp-offer-title { font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 700; line-height: 1.1; margin-bottom: 12px; }
  .lp-offer-subtitle { font-size: .95rem; color: var(--muted); line-height: 1.8; margin-bottom: 48px; }
  .lp-offer-subtitle strong { color: var(--paper); }

  .lp-offer-card { background: var(--card); border: 1px solid rgba(232,184,75,.2); border-radius: 12px; padding: 40px 36px; text-align: left; margin-bottom: 24px; }
  .lp-card-featured { border-color: rgba(232,184,75,.45); }
  .lp-card-tag { font-size: .68rem; letter-spacing: .2em; color: var(--gold); text-transform: uppercase; margin-bottom: 20px; }
  .lp-offer-price { font-size: 3.5rem; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
  .lp-offer-price sup { font-size: 1.8rem; vertical-align: super; }
  .lp-price-mo { font-size: 1.2rem; font-weight: 600; color: var(--muted); }
  .lp-offer-period { font-size: .75rem; color: var(--muted); letter-spacing: .15em; text-transform: uppercase; margin-bottom: 28px; }
  .lp-offer-features { list-style: none; margin-bottom: 36px; padding: 0; }
  .lp-offer-feature { display: flex; align-items: flex-start; gap: 12px; font-size: .88rem; color: var(--muted); padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.05); }
  .lp-offer-feature:last-child { border-bottom: none; }
  .lp-fcheck { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
  .lp-offer-cta { display: block; text-align: center; background: var(--gold); color: #000; font-size: .85rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 18px; border-radius: 100px; text-decoration: none; transition: all .22s; }
  .lp-offer-cta:hover { background: #f0c85a; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(232,184,75,.22); }
  .lp-cta-outline { background: transparent; border: 1px solid rgba(232,184,75,.4); color: var(--gold); }
  .lp-cta-outline:hover { background: rgba(232,184,75,.08); box-shadow: none; }
  .lp-offer-fine { font-size: .72rem; color: var(--muted); text-align: center; margin-top: 16px; line-height: 1.8; }
  .lp-offer-fine strong { color: rgba(255,255,255,.4); }
  .lp-offer-fine a { color: var(--gold); text-decoration: none; }
  .lp-card-split { height: 1px; background: rgba(255,255,255,.08); margin: 32px 0; }

  .lp-spots-badge { display: inline-block; background: rgba(232,184,75,.08); border: 1px solid rgba(232,184,75,.2); color: var(--gold); font-size: .68rem; letter-spacing: .15em; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; margin-bottom: 32px; }

  /* BELT STRIP (course card) */
  .lp-belt-strip { display: flex; gap: 4px; margin-bottom: 10px; }
  .lp-belt-seg { height: 8px; flex: 1; border-radius: 2px; }
  .lp-belt-caption { font-size: .75rem; color: var(--muted); margin-bottom: 24px; }

  /* DISCORD */
  .lp-discord { padding: 80px 24px; border-top: 1px solid var(--border); }
  .lp-discord-inner { max-width: 580px; margin: 0 auto; text-align: center; }
  .lp-discord-tag { font-size: .68rem; letter-spacing: .2em; color: var(--muted); text-transform: uppercase; margin-bottom: 14px; }
  .lp-discord-title { font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
  .lp-discord-sub { font-size: .92rem; color: var(--muted); line-height: 1.8; margin-bottom: 32px; max-width: 440px; margin-left: auto; margin-right: auto; }
  .lp-discord-perks { list-style: none; text-align: left; max-width: 360px; margin: 0 auto 36px; display: flex; flex-direction: column; gap: 12px; padding: 0; }
  .lp-discord-perk { display: flex; align-items: center; gap: 12px; font-size: .88rem; color: var(--muted); }
  .lp-discord-perk::before { content: '→'; color: var(--gold); flex-shrink: 0; }
  .lp-discord-btn { display: inline-block; border: 1px solid rgba(232,184,75,.3); color: var(--gold); font-size: .8rem; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; padding: 16px 40px; border-radius: 100px; text-decoration: none; transition: all .22s; }
  .lp-discord-btn:hover { background: rgba(232,184,75,.08); transform: translateY(-2px); }
  .lp-discord-note { font-size: .68rem; color: var(--muted); margin-top: 14px; letter-spacing: .05em; }

  /* DISCLAIMER */
  .lp-disclaimer { padding: 48px 24px 40px; border-top: 1px solid var(--border); max-width: 640px; margin: 64px auto 0; }
  .lp-disclaimer p { font-size: .72rem; color: var(--muted); line-height: 1.8; margin-bottom: 14px; }
  .lp-disclaimer strong { color: rgba(255,255,255,.4); }

  @media (max-width: 480px) {
    .lp-offer-card { padding: 28px 20px; }
  }
`;
