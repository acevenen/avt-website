export type Cadence = "free" | "monthly" | "one-time" | "application";

export interface Product {
  id: string;
  belt: string;
  beltColor: string;
  name: string;
  tagline: string;      // collapsed one-liner
  price: number | null; // null = free
  cadence: Cadence;
  includes: string[];   // revealed on expand
  ctaLabel: string;
  href?: string;        // direct link (Discord, application) — takes priority
  spotsCap?: number;    // e.g. Black Belt = 10
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "dojo",
    belt: "White Belt",
    beltColor: "#E8E4D8",
    name: "Ace's Dojo",
    tagline: "Free Discord community — start here.",
    price: null,
    cadence: "free",
    includes: [
      "A community of traders learning the AVT system",
      "Daily market recaps and conversation",
      "Intro lessons and the full belt roadmap",
      "First look at drops, calls, and events",
    ],
    ctaLabel: "Join the Dojo",
    // TODO(Ace): this invite expires 2026-07-03 — replace with a permanent invite.
    href: "https://discord.gg/hReBrtPFx",
  },
  {
    id: "signals",
    belt: "Blue Belt",
    beltColor: "#2E5EAA",
    name: "Signals",
    tagline: "My trade alerts, in real time.",
    price: 97,
    cadence: "monthly",
    includes: [
      "Real-time entries, stops, and targets on the AVT Flag System",
      "Context on every call — why the trade, not just the ticker",
      "Alerts delivered where you already are",
      "Cancel anytime",
    ],
    ctaLabel: "Start Signals",
  },
  {
    id: "autopilot",
    belt: "Purple Belt",
    beltColor: "#6B4C9A",
    name: "Autopilot",
    tagline: "The AVT bot trades the system for you.",
    price: 197,
    cadence: "monthly",
    includes: [
      "Automated execution of the AVT Flag System",
      "Built-in risk controls: fixed stops and a daily circuit breaker",
      "Volume-adaptive trailing to lock in gains",
      "Setup guide and onboarding",
    ],
    ctaLabel: "Get Autopilot",
  },
  {
    id: "course",
    belt: "Brown Belt",
    beltColor: "#7A4E2B",
    name: "The Course",
    tagline: "The full AVT system, White to Black Belt.",
    price: 297,
    cadence: "one-time",
    includes: [
      "The complete belt curriculum, start to finish",
      "The 9-condition AVT Flag System, broken down",
      "Risk, position management, and the mental game",
      "Lifetime access to the course portal",
    ],
    ctaLabel: "Get the Course",
  },
  {
    id: "blackbelt",
    belt: "Black Belt",
    beltColor: "#111114",
    name: "Black Belt Coaching",
    tagline: "1-on-1 with me. 10 seats, that's it.",
    price: 1000,
    cadence: "application",
    includes: [
      "Direct 1-on-1 coaching with Ace",
      "Your trading reviewed and rebuilt around your goals",
      "Personal accountability and direct access",
      "Applications reviewed — not first-come",
    ],
    ctaLabel: "Apply for Black Belt",
    href: "/apply",
    spotsCap: 10,
    featured: true,
  },
];
