// Tier placement tests — the "belt promotion" roadblocks.
// Test 1 gates Beginner (White/Yellow/Orange) → Intermediate (Green/Blue/Purple).
// Test 2 gates Intermediate → Advanced (Brown/Brown II/Brown III).
// Comprehension-level, not tricky. Pass = 75% (question count chosen so that's ~6/8).

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
  explain: string; // shown after grading — teaches the point
}

export interface TierQuiz {
  id: "tier1" | "tier2";
  title: string;
  subtitle: string;
  unlocks: string; // human label of the tier it promotes into
  passFraction: number;
  questions: QuizQuestion[];
}

export const tier1: TierQuiz = {
  id: "tier1",
  title: "Beginner Belt Test",
  subtitle: "Recap of White, Yellow & Orange — mindset, the rules, and reading a chart.",
  unlocks: "Intermediate (Green Belt)",
  passFraction: 0.75,
  questions: [
    {
      q: "The market is ranging and nothing is clear. What's the correct move?",
      options: [
        "Sit out — not trading is a position",
        "Force a small trade to stay sharp",
        "Double size to catch the next move",
        "Switch to a different instrument",
      ],
      answer: 0,
      explain: "Sitting on your hands IS a position. No clear setup means no trade — protecting capital on a bad day is how you're around for the good ones.",
    },
    {
      q: "After every trade, the question that matters most is:",
      options: [
        "Did I make money?",
        "Did I follow my rules?",
        "Was the market trending?",
        "Did I beat my last trade?",
      ],
      answer: 1,
      explain: "A disciplined losing trade is a win; a lucky rule-breaking winner is a problem, because it teaches you to break rules. Judge the process, not the P&L.",
    },
    {
      q: "The AVT system trades:",
      options: [
        "Any liquid stock, all day",
        "Crypto, 24/7",
        "NQ futures, during the NY open (9:30–11:30 EST)",
        "Whatever is moving that day",
      ],
      answer: 2,
      explain: "One instrument, one window. NQ during the NY open is the highest-volume, cleanest part of the session. Master one market before touching anything else.",
    },
    {
      q: "What is the minimum reward-to-risk you'll take a trade at?",
      options: ["1:1", "1.5:1", "2:1", "It doesn't matter"],
      answer: 2,
      explain: "2:1 minimum. If the previous swing high doesn't give you at least 2:1 from your stop, the setup doesn't qualify — skip it.",
    },
    {
      q: "With a 2:1 reward-to-risk, what win rate do you need to break even?",
      options: [
        "You need to win at least 70%",
        "You need a 50%+ win rate",
        "About 1 in 3 (~33%) — you can be wrong most of the time",
        "Win rate is irrelevant",
      ],
      answer: 2,
      explain: "At 2:1, winning ~1 in 3 breaks even — so being right even 40–50% of the time is profitable. The math works for you when your winners are bigger than your losers.",
    },
    {
      q: "Maximum account risk per trade should be:",
      options: ["1–2%", "5–10%", "As much as you're confident in", "25%"],
      answer: 0,
      explain: "1–2% per trade. Prop firms have daily loss limits around 2–4% — staying at 1–2% keeps you well inside them and keeps a bad streak survivable.",
    },
    {
      q: "A \"break of structure\" (BoS) is when:",
      options: [
        "Two EMAs cross",
        "Price takes out a recent swing high or low",
        "Volume spikes",
        "The session opens",
      ],
      answer: 1,
      explain: "A BoS is price taking out a prior swing point — the market showing its hand. It's the context that makes a retracement setup valid.",
    },
    {
      q: "Supply & demand zones are used to:",
      options: [
        "Predict the exact top",
        "Mark levels pre-market where price is likely to react",
        "Replace your stop loss",
        "Decide position size",
      ],
      answer: 1,
      explain: "You mark 2–3 key levels before the open — previous day high/low and obvious S&D zones. Setups that line up with a marked level have real confluence.",
    },
  ],
};

export const tier2: TierQuiz = {
  id: "tier2",
  title: "Intermediate Belt Test",
  subtitle: "Recap of Green, Blue & Purple — bias, the 9/20 setup, and flags.",
  unlocks: "Advanced (Brown Belt)",
  passFraction: 0.75,
  questions: [
    {
      q: "When do you set your directional bias?",
      options: [
        "After the first 5-minute candle",
        "Before 9:30 — pre-market, and you write it down",
        "Once you're already in a trade",
        "Whenever price tells you",
      ],
      answer: 1,
      explain: "Bias is decided before the open and written down. Written down = committed. It filters every setup you'll consider that session.",
    },
    {
      q: "Your bias is invalidated when:",
      options: [
        "A single wick pokes your level",
        "Price stalls for a few minutes",
        "Structure breaks on volume with a strong close against you",
        "You start to doubt it",
      ],
      answer: 2,
      explain: "You flip when structure breaks — not when your stomach does. Noise and single wicks don't count; a decisive structural break does.",
    },
    {
      q: "The AVT entry trades the:",
      options: [
        "EMA crossover",
        "Retracement into the 9/20 EMA zone",
        "First green candle of the day",
        "News release",
      ],
      answer: 1,
      explain: "You're not trading the crossover — you're trading the pullback into the 9/20 zone after a break of structure. The zone is a retracement magnet in a trend.",
    },
    {
      q: "How many of the five setup conditions must be present to take the trade?",
      options: ["Three", "Four", "All five", "Just bias + entry"],
      answer: 2,
      explain: "Three is a maybe, four is a consideration, five is the trade. Missing confluence especially drops the probability — wait for all five.",
    },
    {
      q: "You enter on the ___ of the confirmation candle.",
      options: ["wick", "open", "close", "midpoint"],
      answer: 2,
      explain: "Enter on the close, not the wick. Wait for the candle to actually confirm the rejection off the zone before clicking.",
    },
    {
      q: "Where does the stop go?",
      options: [
        "At the entry price",
        "Below the zone and below the key level, max ~2% risk",
        "Wherever gives 1:1",
        "You trade without a stop",
      ],
      answer: 1,
      explain: "Below the EMA zone and below the key level, never more than ~2% of the account. If the level breaks, you were wrong — that's what the stop is for.",
    },
    {
      q: "A flag that breaks out on flat / low volume is most likely:",
      options: [
        "The strongest kind of breakout",
        "A fakeout (the \"rug pull\")",
        "A reason to add size",
        "Irrelevant — price is all that matters",
      ],
      answer: 1,
      explain: "Price can lie; volume can't. A breakout with no volume spike is where retail gets trapped. You need the volume to confirm the move is real.",
    },
    {
      q: "The three parts of a flag pattern are:",
      options: [
        "Pole, flag (consolidation), breakout",
        "Entry, stop, target",
        "Bias, setup, management",
        "Open, high, close",
      ],
      answer: 0,
      explain: "The pole (a strong 3+ candle push), the flag (a tight, controlled pullback — a rest, not a reversal), then the breakout in the pole's direction.",
    },
  ],
};

export const tierQuizzes = { tier1, tier2 };
