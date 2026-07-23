"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { beltVideos, embedUrl } from "@/data/videos";
import { tier1, tier2 } from "@/data/quizzes";
import TierTest from "@/components/TierTest";

const DISCORD = "https://discord.gg/hReBrtPFx";
const CORRECT_PASSWORD = "AVTDOJO"; // TODO: change before going live

const belts = [
  { id: "green",   color: "#1db87e", label: "Green",     title: "Daily Bias & Timeframe Alignment", tier: "intermediate" },
  { id: "blue",    color: "#4a8fd4", label: "Blue",      title: "The 9/20 EMA Setup",                tier: "intermediate" },
  { id: "purple",  color: "#9b59b6", label: "Purple",    title: "Flags, Momentum & Execution",       tier: "intermediate" },
  { id: "brown",   color: "#a0673a", label: "Brown",     title: "Trade Management & Scaling",        tier: "advanced" },
  { id: "brown2",  color: "#7a4520", label: "Brown II",  title: "Funded Account Gameplan",           tier: "advanced" },
  { id: "brown3",  color: "#5a3010", label: "Brown III", title: "Discipline Reinforcement",          tier: "advanced" },
];

export default function PaidPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw]         = useState("");
  const [err, setErr]       = useState(false);
  const [active, setActive] = useState("green");
  const [passed1, setPassed1] = useState(false); // Beginner test cleared
  const [passed2, setPassed2] = useState(false); // Intermediate test cleared

  useEffect(() => {
    if (sessionStorage.getItem("avt_auth") === "1") setAuthed(true);
    // NOTE: local progress for now — rebinds to the per-user account once auth ships.
    if (localStorage.getItem("avt_tier1") === "1") setPassed1(true);
    if (localStorage.getItem("avt_tier2") === "1") setPassed2(true);
  }, []);

  function passTier1() {
    localStorage.setItem("avt_tier1", "1");
    setPassed1(true);
  }
  function passTier2() {
    localStorage.setItem("avt_tier2", "1");
    setPassed2(true);
  }

  const activeBelt = belts.find((b) => b.id === active)!;
  const beltLocked = (b: (typeof belts)[number]) =>
    (b.tier === "intermediate" && !passed1) || (b.tier === "advanced" && !passed2);
  const activeLocked = beltLocked(activeBelt);

  function checkPassword() {
    if (pw.trim().toUpperCase() === CORRECT_PASSWORD) {
      sessionStorage.setItem("avt_auth", "1");
      setAuthed(true);
    } else {
      setErr(true);
      setPw("");
    }
  }

  return (
    <div className="pd-root">
      <style>{css}</style>

      {/* GATE */}
      {!authed && (
        <div className="pd-gate">
          <div className="pd-gate-box">
            <span className="pd-gate-tri">▲</span>
            <p className="pd-gate-title">AVT Student Portal</p>
            <p className="pd-gate-sub">Enter your access password to continue</p>
            <input
              type="password"
              className="pd-gate-input"
              placeholder="PASSWORD"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr(false); }}
              onKeyDown={e => e.key === "Enter" && checkPassword()}
              autoFocus
            />
            <button className="pd-gate-btn" onClick={checkPassword}>Enter the Dojo →</button>
            {err && <p className="pd-gate-error">Incorrect password. Check your confirmation email.</p>}
            <p className="pd-gate-footer">Not a student yet? <Link href="/course">Enroll here →</Link></p>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="pd-nav">
        <Link href="/" className="pd-nav-logo">▲ AVT — Ace&apos;s Dojo</Link>
        <div className="pd-nav-right">
          <span className="pd-nav-badge">AVT Student</span>
          <Link href="/" className="pd-nav-ghost">← Home</Link>
        </div>
      </nav>

      {/* HEADER */}
      <div className="pd-header">
        <p className="pd-eyebrow">Trading Time for Money</p>
        <h1>Welcome back, <em>Student.</em></h1>
        <p className="pd-sub">Work through each belt in order. Don&apos;t skip.</p>
      </div>

      {/* TABS */}
      <div className="pd-tabs">
        {belts.map((b, i) => {
          const prevTier = belts[i - 1]?.tier;
          const showDivider = i > 0 && b.tier !== prevTier;
          return (
            <span key={b.id} style={{ display: "contents" }}>
              {showDivider && <span className="pd-tier-div" aria-hidden />}
              <button
                className={`pd-tab ${active === b.id ? "pd-tab-active" : ""} ${beltLocked(b) ? "pd-tab-locked" : ""}`}
                onClick={() => setActive(b.id)}
              >
                <span className="pd-tab-dot" style={{ background: b.color }} />
                {b.label}
                {beltLocked(b) && <span className="pd-tab-lock">🔒</span>}
              </button>
            </span>
          );
        })}
      </div>

      {/* BELT CONTENT — tier tests gate the jump between tiers */}
      <div className="pd-content">
        {activeLocked ? (
          activeBelt.tier === "advanced" ? (
            <div className="pd-gate-test">
              <p className="pd-gate-test-note">
                🥋 Pass the Intermediate test to unlock the Advanced belts.
              </p>
              <TierTest quiz={tier2} onPass={passTier2} />
            </div>
          ) : (
            <div className="pd-gate-test">
              <p className="pd-gate-test-note">
                🥋 Quick placement test — clears the Intermediate belts. Not hard,
                just proves the fundamentals stuck.
              </p>
              <TierTest quiz={tier1} onPass={passTier1} />
            </div>
          )
        ) : (
          <>
            {active === "green"  && <GreenBelt  setActive={setActive} />}
            {active === "blue"   && <BlueBelt   setActive={setActive} />}
            {active === "purple" && <PurpleBelt setActive={setActive} />}
            {active === "brown"  && <BrownBelt  setActive={setActive} />}
            {active === "brown2" && <Brown2Belt setActive={setActive} />}
            {active === "brown3" && <Brown3Belt />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function VideoBlock({ beltId }: { beltId: string }) {
  const v = beltVideos[beltId];
  if (v?.youTubeId) {
    return (
      <div className="pd-video-embed">
        <iframe
          src={embedUrl(v.youTubeId)}
          title={v.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  if (v?.src) {
    return (
      <div className="pd-video-embed">
        <video src={v.src} controls preload="metadata" playsInline title={v.label} />
      </div>
    );
  }
  return (
    <div className="pd-video">
      <div className="pd-play" />
      <span className="pd-video-label">{v?.label ?? beltId} — video coming soon</span>
    </div>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pd-callout">
      <p className="pd-callout-label">{title}</p>
      <p>{children}</p>
    </div>
  );
}

function RuleBlock({ label, value, note }: { label: string; value: React.ReactNode; note: string }) {
  return (
    <div className="pd-rule">
      <p className="pd-rule-label">{label}</p>
      <p className="pd-rule-value">{value}</p>
      <p className="pd-rule-note">{note}</p>
    </div>
  );
}

function StepBlock({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="pd-step">
      <div className="pd-step-num">{num}</div>
      <div>
        <p className="pd-step-title">{title}</p>
        <p className="pd-step-desc">{desc}</p>
      </div>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="pd-checklist">
      {items.map(item => (
        <div key={item} className="pd-check-item">
          <div className="pd-check-box" />
          <span className="pd-check-text">{item}</span>
        </div>
      ))}
    </div>
  );
}

function NextBelt({ label, next, setActive }: { label: string; next: string; setActive: (s: string) => void }) {
  return (
    <div className="pd-next">
      <p>{label}</p>
      <button className="pd-next-btn" onClick={() => { setActive(next); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
        {belts.find(b => b.id === next)?.label} Belt — {belts.find(b => b.id === next)?.title} →
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="pd-section-title">{children}</p>;
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="pd-list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <div className="pd-highlight"><p>{children}</p></div>;
}

// ─── GREEN BELT ───────────────────────────────────────────────────────────────

function GreenBelt({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="pd-module">
      <p className="pd-belt-ey" style={{ color: "#1db87e" }}>Green Belt</p>
      <h2>Daily Bias & Timeframe Alignment</h2>
      <p className="pd-desc">Before you place a single trade, you already know the direction. This belt is your pre-market routine — how to read the higher timeframes and build a directional thesis before the NY open.</p>

      <VideoBlock beltId="green" />

      <SectionTitle>What is daily bias</SectionTitle>
      <p className="pd-intro">Daily bias is the single most important decision you make before each session. Before you look at a 5-minute chart, you need to know: am I bullish, bearish, or flat today? That answer filters every setup you consider.</p>
      <List items={[
        <><strong>Bullish bias</strong> — Only looking for long setups. You do not short until the bias changes.</>,
        <><strong>Bearish bias</strong> — Shorts only. Don&apos;t look for longs against the trend.</>,
        <><strong>Neutral</strong> — Market is ranging or unclear. Sit out until structure develops. Sitting on your hands is a position.</>,
      ]} />

      <SectionTitle>Pre-market routine — step by step</SectionTitle>
      <StepBlock num={1} title="Daily chart — macro trend" desc="Where is the overall trend? Higher highs and higher lows, or breaking down? What are the most significant swing levels in the last 5–10 days?" />
      <StepBlock num={2} title="1-hour chart — session structure" desc="What happened yesterday? Where did price close? Is there a clear directional move forming into the open, or is price consolidating near a level?" />
      <StepBlock num={3} title="Mark your key levels" desc="Draw 2–3 horizontal lines that matter: previous day high, previous day low, and any obvious supply or demand zone nearby." />
      <StepBlock num={4} title="Set your bias — write it down" desc="Bullish, bearish, or neutral. Write it before 9:30 AM EST and commit to it unless structure clearly invalidates it." />

      <Callout title="Bias invalidation">
        If you&apos;re bullish and price breaks below your key demand zone on volume with a strong bearish close — your bias is wrong. Reassess. Don&apos;t adjust on noise or a single wick. Adjust when structure breaks.
      </Callout>

      <SectionTitle>Drill-down to 5-minute</SectionTitle>
      <p className="pd-intro">You&apos;ve got your bias and your levels. It&apos;s 9:30. The market opens. Do not touch anything for the first 5–10 minutes.</p>
      <List items={[
        "Watch how price reacts to the open. Is it immediately pushing in your bias direction, or is there a fake-out first?",
        "Let the first move play out. The first candle of the day is almost never the trade.",
        "You're looking for a pullback into a level you already marked — that's where the setup forms.",
        "Once price is near your level on the 5-minute, move to Blue Belt to find the exact entry.",
      ]} />

      <Highlight><strong>The mental checklist before 9:30:</strong> I know the trend. I know my key levels. I know my bias. I know what would invalidate it. Now I wait.</Highlight>

      <NextBelt label="Ready for the entry trigger?" next="blue" setActive={setActive} />
    </div>
  );
}

// ─── BLUE BELT ────────────────────────────────────────────────────────────────

function BlueBelt({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="pd-module">
      <p className="pd-belt-ey" style={{ color: "#4a8fd4" }}>Blue Belt</p>
      <h2>The 9/20 EMA Setup</h2>
      <p className="pd-desc">This is the system. Everything before this belt was building to this moment — the actual trigger. The 9 and 20 EMA retracement into a key level after a break of structure.</p>

      <VideoBlock beltId="blue" />

      <SectionTitle>Understanding the EMAs</SectionTitle>
      <p className="pd-intro">The 9 and 20 EMA are plotted on the 5-minute chart. Together they act as a dynamic support zone during a trend — a level price tends to retrace to before continuing.</p>
      <RuleBlock label="9 EMA" value={<>Fast line — <em>reacts quickly to price</em></>} note="Tracks recent momentum. When price is above the 9 EMA, short-term momentum is bullish." />
      <RuleBlock label="20 EMA" value={<>Slow line — <em>trend direction</em></>} note="Smooths out the noise. The 20 EMA tells you the prevailing direction on the 5-minute timeframe." />
      <RuleBlock label="The zone between them" value={<>EMA zone = <em>retracement magnet</em></>} note="During a trend, price repeatedly pulls back into this zone before continuing. This is where you look for entries — not the crossover, the retracement." />

      <SectionTitle>The full setup — all 5 conditions required</SectionTitle>
      <List items={[
        <><strong>Bias confirmed</strong> — Directional read from Green Belt. Bullish = longs only.</>,
        <><strong>Break of structure</strong> — A recent swing high (for longs) has been taken out. The market has shown its hand.</>,
        <><strong>Retracement into EMA zone</strong> — After the BoS, price pulls back into the 9/20 EMA area.</>,
        <><strong>Key level confluence</strong> — The EMA zone sits on or near a level you marked pre-market.</>,
        <><strong>Confirmation candle</strong> — A bullish candle closes off the EMA zone, price starting to push back in your direction.</>,
      ]} />

      <Callout title="All five conditions = high conviction trade">
        Missing one condition — especially confluence — drops the probability significantly. Three conditions is a maybe. Four is a consideration. Five is the trade.
      </Callout>

      <SectionTitle>Entry, stop, and target</SectionTitle>
      <RuleBlock label="Entry" value={<>Close of confirmation candle <em>off the EMA zone</em></>} note="Enter on the close, not the wick. Wait for the candle to confirm the rejection before clicking buy." />
      <RuleBlock label="Stop Loss" value={<>Below EMA zone + <em>below the key level</em></>} note="Give it room to breathe but not more than 2% of account. If the key level breaks, you were wrong." />
      <RuleBlock label="Take Profit" value={<>Previous swing high — <em>minimum 2:1 R:R</em></>} note="The most recent swing high before your entry is the natural first target." />

      <SectionTitle>What invalidates the setup</SectionTitle>
      <List items={[
        "Price rips through the EMA zone on high volume with no pause — that's a reversal, not a retracement.",
        "EMA touch with no key level nearby — probability drops. Wait for confluence.",
        "Your higher timeframe bias flipped — reassess everything before entering.",
        "Confirmation candle has a long wick in your direction but closes back inside the EMA zone — wait for a clean close.",
      ]} />

      <NextBelt label="Now add confluence with flags" next="purple" setActive={setActive} />
    </div>
  );
}

// ─── PURPLE BELT ──────────────────────────────────────────────────────────────

function PurpleBelt({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="pd-module">
      <p className="pd-belt-ey" style={{ color: "#9b59b6" }}>Purple Belt</p>
      <h2>Flags, Momentum & Execution</h2>
      <p className="pd-desc">The EMA gets you in the right area. Flags tell you when the move is actually ready. This belt is about reading momentum — knowing when to pull the trigger and when to sit out.</p>

      <VideoBlock beltId="purple" />

      <SectionTitle>Anatomy of a flag</SectionTitle>
      <RuleBlock label="The Pole" value={<>Strong directional move — <em>3+ clean candles</em></>} note="Aggressive push with clear momentum. This is what you're riding the continuation of." />
      <RuleBlock label="The Flag" value={<>Tight consolidation — <em>controlled pullback</em></>} note="Price moves sideways or slightly counter-trend in a tight channel. Not a reversal — a rest." />
      <RuleBlock label="The Breakout" value={<>Price breaks above the flag — <em>entry signal</em></>} note="When the flag breaks in the direction of the pole, buyers are back. Combined with the EMA setup, this is your highest-probability entry." />

      <SectionTitle>Volume — the confirmation you can&apos;t skip</SectionTitle>
      <List items={[
        <><strong>During the pole</strong> — Volume should be elevated. Strong participation. Momentum is real.</>,
        <><strong>During the flag</strong> — Volume dries up. Declining bars. Sellers aren&apos;t showing up in force.</>,
        <><strong>At the breakout</strong> — Volume spikes again. Buyers stepping back in with size. This is the real signal.</>,
      ]} />

      <Callout title="Low volume breakout = fakeout">
        Price breaks the flag but volume is flat? That&apos;s a trap. Most retail traders get caught here — they entered on price alone and ignored the volume check. You don&apos;t.
      </Callout>

      <SectionTitle>Breakout vs fakeout checklist</SectionTitle>
      <Checklist items={[
        "Flag channel is tight and clean — controlled lower highs, no random spikes",
        "Volume dried up during the consolidation",
        "Breakout candle closes decisively outside the channel — not just a wick",
        "Volume spikes on or before the breakout candle",
        "Price immediately continues with momentum after the break",
      ]} />

      <SectionTitle>When to sit on your hands</SectionTitle>
      <List items={[
        "No clean flag — just choppy back-and-forth with no clear channel.",
        "Volume is random throughout consolidation — no dry-up, no pattern.",
        "You've already hit your daily profit target or daily loss limit — session is done.",
        "Market is ranging on the higher timeframe with no directional structure.",
        "You're emotional or second-guessing. If you have to ask, the answer is no.",
      ]} />

      <Highlight><strong>Two clean trades executed with discipline beat six forced trades every time.</strong> Quality over quantity. If the flag isn&apos;t clean, it isn&apos;t a setup.</Highlight>

      <NextBelt label="You're in the trade — now learn what to do" next="brown" setActive={setActive} />
    </div>
  );
}

// ─── BROWN BELT ───────────────────────────────────────────────────────────────

function BrownBelt({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="pd-module">
      <p className="pd-belt-ey" style={{ color: "#a0673a" }}>Brown Belt</p>
      <h2>Trade Management & Scaling</h2>
      <p className="pd-desc">Getting in is half the job. What you do after you&apos;re in determines whether you actually make money. Most traders enter well and then self-sabotage. This belt fixes that.</p>

      <VideoBlock beltId="brown" />

      <SectionTitle>Setting your take profit</SectionTitle>
      <RuleBlock label="First target" value={<>Previous swing high — <em>minimum 2:1 from stop</em></>} note="Mark it before you enter. If the previous swing high doesn't give you 2:1 R:R from your stop, the setup doesn't meet criteria. Skip it." />
      <RuleBlock label="Extended target" value={<>Next significant level — <em>3:1 or beyond</em></>} note="Only hold for this if you've already secured partial profits at the first target." />

      <SectionTitle>Trailing stops — letting winners run</SectionTitle>
      <List items={[
        <><strong>Hit first target</strong> — Close half the position. Move stop to entry. You&apos;re now risk-free on the remainder.</>,
        <><strong>Trail behind structure</strong> — As price makes new higher lows, move your stop up to just below each new HL.</>,
        <><strong>Stay in until stopped</strong> — Don&apos;t predict the top. If the trail gets hit, you exit. Let the structure tell you when it&apos;s done.</>,
      ]} />

      <Callout title="The risk-free trade">
        Once you&apos;ve taken partial profits and moved your stop to entry, you literally cannot lose on this trade. You&apos;ve locked in money. Now you&apos;re playing with the house&apos;s chips. This mental shift changes everything about how you manage the rest of the position.
      </Callout>

      <SectionTitle>Adding to winners</SectionTitle>
      <List items={[
        "Only add on a pullback — never chase a winner by adding at a higher price.",
        "The pullback needs to show the same setup as your original entry — EMA touch, key level, confirmation candle.",
        "Same stop logic applies to the add. New position, new stop, new TP.",
      ]} />

      <SectionTitle>When to cut early</SectionTitle>
      <List items={[
        "Price reaches your TP level and stalls with no continuation momentum — take it.",
        "Your bias gets invalidated mid-trade by a structural break on the higher timeframe.",
        "A major news event drops unexpectedly — get out first, assess after.",
        "You've been in 30+ minutes with no movement. Dead money. Cut it and redeploy.",
      ]} />

      <Highlight><strong>Good entry vs good trade:</strong> You can have a perfect entry and still have a mediocre trade. That&apos;s fine. Cut it, move on. The system wins over a series of trades, not individual ones.</Highlight>

      <NextBelt label="Now learn how to trade a funded account" next="brown2" setActive={setActive} />
    </div>
  );
}

// ─── BROWN BELT II ────────────────────────────────────────────────────────────

function Brown2Belt({ setActive }: { setActive: (s: string) => void }) {
  return (
    <div className="pd-module">
      <p className="pd-belt-ey" style={{ color: "#7a4520" }}>Brown Belt II</p>
      <h2>Funded Account Gameplan</h2>
      <p className="pd-desc">This belt is about turning everything you&apos;ve learned into real payouts. I passed Topstep in February 2025. Here&apos;s exactly how.</p>

      <VideoBlock beltId="brown2" />

      <SectionTitle>How prop firms work</SectionTitle>
      <RuleBlock label="Topstep — $50K account" value={<>Profit target: <em>$3,000</em></>} note="Daily loss limit ~$1,000 (2%). Trailing drawdown ~$2,500–$3,000. No time limit to pass." />
      <RuleBlock label="Lucid" value={<>Similar structure — <em>verify current rules</em></>} note="Rules change periodically. Always check current eval parameters before starting a combine." />

      <SectionTitle>The combine strategy</SectionTitle>
      <List items={[
        "Target 1–2 quality setups per day. The combine rewards consistency, not big days.",
        "Set your own daily profit target: $300–$500. Hit it — log off. Done.",
        "If you take two losses and you're at 50% of the daily loss limit — session over. No revenge.",
        "Ten trading days at $300–$400 average = $3,000–$4,000. Combine passed with room to spare.",
      ]} />

      <Callout title="Trailing drawdown — the thing that trips everyone">
        On Topstep, the drawdown trails your highest account value. Run it from $50K to $52K, your floor is now $48K. Give back $2K from there and you&apos;re out — even though you&apos;re above the starting point. Once you&apos;re up, get conservative. You&apos;re not trying to be a hero, you&apos;re trying to get paid.
      </Callout>

      <SectionTitle>Pre-combine checklist</SectionTitle>
      <Checklist items={[
        "I know the exact daily loss limit in dollars",
        "I know the trailing drawdown rules and how they work",
        "I have a personal daily profit target set before I start",
        "I will not trade more than 2 setups per session",
        "I will stop immediately at 50% of daily loss limit",
        "I am treating this like a job, not a casino",
      ]} />

      <NextBelt label="One belt left in the student curriculum" next="brown3" setActive={setActive} />
    </div>
  );
}

// ─── BROWN BELT III ───────────────────────────────────────────────────────────

function Brown3Belt() {
  return (
    <div className="pd-module">
      <p className="pd-belt-ey" style={{ color: "#5a3010" }}>Brown Belt III</p>
      <h2>Discipline Reinforcement</h2>
      <p className="pd-desc">The belt system gave you the tools. This belt keeps them sharp. Journaling, weekly trade reviews, diagnosing your own mistakes — the process that keeps psychology alive under pressure.</p>

      <VideoBlock beltId="brown3" />

      <SectionTitle>The trade journal — what to log</SectionTitle>
      <RuleBlock label="Every trade — required fields" value={<>Date · Direction · Size · <em>Result</em></>} note="Entry price, stop price, target price, actual exit. R:R planned vs actual. Did you follow your rules? Y/N." />
      <RuleBlock label="Emotional state — before and after" value={<>1–10 scale · <em>note what you felt</em></>} note="Calm, anxious, rushed, confident? Patterns in your emotional state directly correlate to your performance." />
      <RuleBlock label="Screenshot the chart" value={<>Mark your <em>entry, stop, and target</em></>} note="You'll see things in the chart review that you missed in the moment. Always." />

      <SectionTitle>Weekly review process</SectionTitle>
      <List items={[
        <><strong>Every Sunday</strong> — Go through every trade from the week. Not to judge, to learn.</>,
        "Separate trades into three buckets: system trades, system trades with poor execution, and trades outside the system.",
        "Look for patterns: overtrading on Mondays? Revenge trades after 10:30 AM? Cutting winners early when up on the week?",
        "Write one thing you did well. Write one thing you'll fix next week. Keep it actionable.",
      ]} />

      <Callout title="The question that matters">
        After every trade: &quot;Did I follow my rules?&quot; Not &quot;Did I make money?&quot; A disciplined losing trade is a win. A lucky winning trade outside the system is a problem — it teaches you to break rules.
      </Callout>

      <SectionTitle>Diagnosing your mistakes</SectionTitle>
      <List items={[
        <><strong>Consistent stops getting hit</strong> — Stop placement is off. Are you placing at obvious levels everyone else sees?</>,
        <><strong>Cutting winners too early</strong> — Likely emotional. Are your TPs at real structure levels?</>,
        <><strong>Overtrading</strong> — Count trades per session over two weeks. More than 2–3 good setups daily means you&apos;re forcing.</>,
        <><strong>Breaking rules after wins</strong> — Overconfidence. Every session is independent.</>,
        <><strong>Breaking rules after losses</strong> — Revenge mindset. Re-read White Belt. The circuit breaker exists for a reason.</>,
      ]} />

      <Highlight><strong>You now have the full student curriculum.</strong> Bias. Entry. Flags. Management. Funded accounts. Discipline. The only variable left is execution. That&apos;s yours to own.</Highlight>

      {/* BLACK BELT UPGRADE */}
      <div className="pd-blackbelt-cta">
        <p className="pd-bb-label">Ready for the next level?</p>
        <p className="pd-bb-body">Black Belt is 1-on-1 with Ace for 3 months. Personal trade feedback, your funded account gameplan built specifically for you, and direct access to someone who&apos;s done it.</p>
        <Link href="/course" className="pd-bb-btn">Apply for Black Belt — $1,000</Link>
        <span className="pd-bb-sub">Limited to 10 spots · 3-month coaching engagement</span>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="pd-next-btn">
          Join Ace&apos;s Dojo →
        </a>
      </div>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const css = `
  .pd-root {
    --pd-black:#080808; --pd-surface:#0f0f0f; --pd-surface2:#141414;
    --pd-white:#f0ede6; --pd-green:#1db87e; --pd-green-dim:#0d5c40; --pd-green-bg:#091a12;
    --pd-gold:#d4a843; --pd-gold-bg:#1a1204; --pd-red:#c94a2a;
    --pd-border:rgba(240,237,230,0.08); --pd-border-b:rgba(240,237,230,0.15);
    --pd-muted:rgba(240,237,230,0.38); --pd-muted2:rgba(240,237,230,0.62);
    font-family:'Syne',sans-serif; background:var(--pd-black); color:var(--pd-white); min-height:100vh;
  }
  /* GATE */
  .pd-gate { position:fixed; inset:0; background:var(--pd-black); z-index:999; display:flex; align-items:center; justify-content:center; padding:1.5rem; }
  .pd-gate-box { width:100%; max-width:360px; background:var(--pd-surface); border:0.5px solid var(--pd-border-b); border-radius:12px; padding:2rem 1.5rem; text-align:center; }
  .pd-gate-tri { font-size:32px; color:var(--pd-green); opacity:0.7; display:block; margin-bottom:1rem; }
  .pd-gate-title { font-size:20px; font-weight:800; letter-spacing:-0.02em; margin-bottom:0.4rem; }
  .pd-gate-sub { font-size:12px; color:var(--pd-muted); font-family:'DM Mono',monospace; margin-bottom:1.5rem; }
  .pd-gate-input { width:100%; padding:11px 14px; background:var(--pd-surface2); border:0.5px solid var(--pd-border-b); border-radius:8px; color:var(--pd-white); font-family:'DM Mono',monospace; font-size:13px; letter-spacing:0.08em; margin-bottom:10px; outline:none; text-align:center; }
  .pd-gate-input:focus { border-color:var(--pd-green-dim); }
  .pd-gate-btn { width:100%; padding:12px; border-radius:8px; background:var(--pd-green); color:var(--pd-black); font-weight:800; font-size:14px; border:none; cursor:pointer; font-family:'Syne',sans-serif; }
  .pd-gate-error { font-size:11px; color:var(--pd-red); font-family:'DM Mono',monospace; margin-top:8px; }
  .pd-gate-footer { font-size:10px; color:var(--pd-muted); font-family:'DM Mono',monospace; margin-top:1.25rem; }
  .pd-gate-footer a { color:var(--pd-green); text-decoration:none; }
  /* NAV */
  .pd-nav { position:sticky; top:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0.9rem 1.25rem; background:rgba(8,8,8,0.93); backdrop-filter:blur(12px); border-bottom:0.5px solid var(--pd-border); }
  .pd-nav-logo { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.12em; color:var(--pd-green); text-transform:uppercase; text-decoration:none; }
  .pd-nav-right { display:flex; align-items:center; gap:0.75rem; }
  .pd-nav-badge { font-family:'DM Mono',monospace; font-size:9px; padding:3px 8px; border-radius:20px; background:var(--pd-green-bg); color:var(--pd-green); border:0.5px solid var(--pd-green-dim); }
  .pd-nav-ghost { font-size:11px; color:var(--pd-muted); text-decoration:none; font-family:'DM Mono',monospace; }
  /* HEADER */
  .pd-header { padding:2rem 1.25rem 1.5rem; border-bottom:0.5px solid var(--pd-border); position:relative; overflow:hidden; animation:pdFadeUp 0.4s ease both; }
  .pd-header::after { content:'▲'; position:absolute; right:1rem; top:1rem; font-size:80px; color:var(--pd-green); opacity:0.03; pointer-events:none; line-height:1; }
  .pd-eyebrow { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--pd-green); margin-bottom:0.6rem; display:flex; align-items:center; gap:8px; }
  .pd-eyebrow::before { content:''; width:20px; height:1px; background:var(--pd-green); }
  .pd-header h1 { font-size:28px; font-weight:800; line-height:1.05; letter-spacing:-0.03em; margin-bottom:0.5rem; }
  .pd-header h1 em { font-style:normal; color:var(--pd-green); }
  .pd-sub { font-size:12px; color:var(--pd-muted); font-family:'DM Mono',monospace; }
  /* TABS */
  .pd-tabs { display:flex; overflow-x:auto; gap:2px; padding:1rem 1.25rem 0; border-bottom:0.5px solid var(--pd-border); scrollbar-width:none; }
  .pd-tabs::-webkit-scrollbar { display:none; }
  .pd-tab { flex-shrink:0; padding:7px 12px; font-size:10px; font-family:'DM Mono',monospace; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; border-radius:6px 6px 0 0; border:0.5px solid transparent; color:var(--pd-muted); background:transparent; transition:all 0.15s; display:flex; align-items:center; gap:6px; position:relative; bottom:-1px; }
  .pd-tab:hover { color:var(--pd-muted2); }
  .pd-tab-active { color:var(--pd-white); background:var(--pd-surface); border-color:var(--pd-border); border-bottom-color:var(--pd-surface); }
  .pd-tab-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .pd-tab-locked { opacity:0.55; }
  .pd-tab-lock { font-size:9px; margin-left:2px; }
  .pd-tier-div { width:1px; align-self:center; height:16px; background:var(--pd-border-b); margin:0 6px; flex-shrink:0; }
  .pd-gate-test { padding:1.75rem 1.25rem; animation:pdFadeUp 0.3s ease both; }
  .pd-gate-test-note { max-width:640px; margin:0 auto 1.5rem; text-align:center; font-size:12px; color:var(--pd-muted2); line-height:1.6; background:var(--pd-surface2); border:0.5px solid var(--pd-border); border-radius:10px; padding:12px 16px; }
  .pd-video-embed { position:relative; width:100%; aspect-ratio:16/9; border-radius:10px; overflow:hidden; border:0.5px solid var(--pd-border-b); margin-bottom:1.5rem; background:#000; }
  .pd-video-embed iframe, .pd-video-embed video { position:absolute; inset:0; width:100%; height:100%; border:0; object-fit:contain; background:#000; }
  /* CONTENT */
  .pd-content { animation:pdFadeUp 0.3s ease both; }
  .pd-module { padding:1.5rem 1.25rem; }
  .pd-belt-ey { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:0.5rem; display:flex; align-items:center; gap:8px; }
  .pd-belt-ey::before { content:''; width:16px; height:1px; background:currentColor; }
  .pd-module h2 { font-size:22px; font-weight:800; letter-spacing:-0.02em; margin-bottom:0.5rem; line-height:1.1; }
  .pd-desc { font-size:13px; color:var(--pd-muted2); line-height:1.6; margin-bottom:1.5rem; font-weight:400; }
  .pd-intro { font-size:13px; color:var(--pd-muted2); line-height:1.7; margin-bottom:1rem; font-weight:400; }
  .pd-section-title { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--pd-green); margin-bottom:0.6rem; margin-top:1.25rem; }
  /* VIDEO */
  .pd-video { background:var(--pd-surface2); border:0.5px solid var(--pd-border-b); border-radius:10px; aspect-ratio:16/9; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; margin-bottom:1.5rem; cursor:pointer; position:relative; overflow:hidden; }
  .pd-video::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(29,184,126,0.04) 0%,transparent 60%); }
  .pd-play { width:52px; height:52px; border-radius:50%; background:rgba(29,184,126,0.15); border:1px solid var(--pd-green-dim); position:relative; z-index:1; }
  .pd-play::after { content:''; position:absolute; top:50%; left:52%; transform:translate(-50%,-50%); width:0; height:0; border-style:solid; border-width:9px 0 9px 16px; border-color:transparent transparent transparent var(--pd-green); margin-left:2px; }
  .pd-video-label { font-family:'DM Mono',monospace; font-size:10px; color:var(--pd-muted); letter-spacing:0.08em; text-transform:uppercase; position:relative; z-index:1; text-align:center; padding:0 1rem; }
  /* COMPONENTS */
  .pd-list { list-style:none; display:flex; flex-direction:column; gap:7px; margin-bottom:0.5rem; }
  .pd-list li { font-size:12px; color:var(--pd-muted2); line-height:1.55; padding-left:16px; position:relative; font-weight:400; }
  .pd-list li::before { content:'→'; position:absolute; left:0; color:var(--pd-green); font-size:11px; }
  .pd-callout { border-left:2px solid var(--pd-green); padding:10px 14px; background:var(--pd-green-bg); border-radius:0 6px 6px 0; margin:1rem 0; }
  .pd-callout-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--pd-green); margin-bottom:4px; }
  .pd-callout p { font-size:12px; color:var(--pd-muted2); line-height:1.55; font-weight:400; }
  .pd-rule { background:var(--pd-surface2); border:0.5px solid var(--pd-border); border-radius:8px; padding:12px 14px; margin-bottom:8px; }
  .pd-rule-label { font-size:10px; font-family:'DM Mono',monospace; color:var(--pd-muted); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:4px; }
  .pd-rule-value { font-size:15px; font-weight:700; letter-spacing:-0.02em; color:var(--pd-white); }
  .pd-rule-value em { font-style:normal; color:var(--pd-green); }
  .pd-rule-note { font-size:11px; color:var(--pd-muted); margin-top:4px; font-weight:400; line-height:1.4; }
  .pd-step { background:var(--pd-surface2); border:0.5px solid var(--pd-border); border-radius:8px; padding:12px 14px; margin-bottom:8px; display:flex; gap:12px; align-items:flex-start; }
  .pd-step-num { width:24px; height:24px; border-radius:50%; background:var(--pd-green-bg); border:0.5px solid var(--pd-green-dim); color:var(--pd-green); font-family:'DM Mono',monospace; font-size:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .pd-step-title { font-size:12px; font-weight:700; margin-bottom:3px; letter-spacing:-0.01em; }
  .pd-step-desc { font-size:11px; color:var(--pd-muted); line-height:1.45; font-weight:400; }
  .pd-checklist { display:flex; flex-direction:column; gap:6px; margin:0.75rem 0; }
  .pd-check-item { display:flex; align-items:flex-start; gap:10px; background:var(--pd-surface2); border:0.5px solid var(--pd-border); border-radius:6px; padding:9px 12px; }
  .pd-check-box { width:16px; height:16px; border-radius:4px; border:1.5px solid var(--pd-green-dim); flex-shrink:0; margin-top:1px; }
  .pd-check-text { font-size:12px; color:var(--pd-muted2); line-height:1.4; font-weight:400; }
  .pd-highlight { background:var(--pd-surface2); border:0.5px solid var(--pd-border-b); border-radius:8px; padding:14px; margin:1rem 0; }
  .pd-highlight p { font-size:12px; color:var(--pd-muted2); line-height:1.6; }
  .pd-next { margin-top:1.5rem; padding-top:1.5rem; border-top:0.5px solid var(--pd-border); text-align:center; }
  .pd-next p { font-size:12px; color:var(--pd-muted); font-family:'DM Mono',monospace; margin-bottom:0.75rem; }
  .pd-next-btn { display:inline-block; padding:10px 20px; border-radius:8px; background:var(--pd-green); color:var(--pd-black); font-weight:800; font-size:13px; text-decoration:none; cursor:pointer; border:none; font-family:'Syne',sans-serif; }
  .pd-blackbelt-cta { margin-top:1.5rem; background:var(--pd-green-bg); border:0.5px solid var(--pd-green-dim); border-radius:8px; padding:1.25rem; text-align:center; }
  .pd-bb-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.15em; text-transform:uppercase; color:var(--pd-green); margin-bottom:0.5rem; }
  .pd-bb-body { font-size:13px; color:var(--pd-muted2); margin-bottom:1rem; font-weight:400; line-height:1.5; }
  .pd-bb-btn { display:inline-block; padding:10px 20px; border-radius:8px; background:var(--pd-gold); color:var(--pd-black); font-weight:800; font-size:13px; text-decoration:none; margin-bottom:8px; }
  .pd-bb-sub { font-size:11px; color:var(--pd-muted); font-family:'DM Mono',monospace; display:block; }
  @keyframes pdFadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;
