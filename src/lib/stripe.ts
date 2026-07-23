import Stripe from "stripe";

// Products are defined here (not in the Stripe dashboard) so prices can't drift
// between the site and checkout. Amounts are in cents.
export const PRODUCTS = {
  course: {
    name: "The Course — AVT Belt Curriculum",
    description: "Lifetime access to the full 9-belt curriculum and student portal.",
    amount: 29700,
  },
  coaching: {
    name: "Black Belt Coaching — 3 Month Intensive",
    description: "1-on-1 coaching with Ace for 3 months, plus full course access.",
    amount: 100000,
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

/** Absolute site origin for Stripe redirect URLs. */
export function siteOrigin(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return new URL(req.url).origin;
}
