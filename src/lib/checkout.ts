// Static references so Next.js inlines them at build time.
// Never index process.env by a variable — dynamic access returns
// undefined in the client bundle and silently ships dead CTAs.
const links: Record<string, string | undefined> = {
  signals: process.env.NEXT_PUBLIC_STRIPE_SIGNALS,
  autopilot: process.env.NEXT_PUBLIC_STRIPE_AUTOPILOT,
  course: process.env.NEXT_PUBLIC_STRIPE_COURSE,
};

export function checkoutUrl(id: string): string {
  return links[id] ?? "#";
}
