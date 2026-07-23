// Central belt → lesson video config.
//
// Two supported sources, checked in this order:
//   1. youTubeId — paste an unlisted YouTube ID to serve from YouTube instead
//      (better streaming + no Vercel bandwidth). One-line swap per belt.
//   2. src       — self-hosted MP4 in /public/videos (current default).
export interface BeltVideo {
  src: string;
  youTubeId?: string;
  label: string;
}

export const beltVideos: Record<string, BeltVideo> = {
  // ── Free tier (rendered on /learn) ──
  white:  { src: "/videos/white.mp4",  label: "White Belt — What Trading Actually Is" },
  yellow: { src: "/videos/yellow.mp4", label: "Yellow Belt — The Non-Negotiable Rules" },
  orange: { src: "/videos/orange.mp4", label: "Orange Belt — Reading the Chart" },
  // ── Paid tier (rendered on /paid) ──
  green:  { src: "/videos/green.mp4",  label: "Green Belt — Daily Bias & Alignment" },
  blue:   { src: "/videos/blue.mp4",   label: "Blue Belt — The 9/20 EMA Setup" },
  purple: { src: "/videos/purple.mp4", label: "Purple Belt — Flags & Momentum" },
  brown:  { src: "/videos/brown.mp4",  label: "Brown Belt — Trade Management" },
  brown2: { src: "/videos/brown2.mp4", label: "Brown Belt II — Funded Account Gameplan" },
  brown3: { src: "/videos/brown3.mp4", label: "Brown Belt III — Discipline Reinforcement" },
};

export function embedUrl(youTubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youTubeId}?rel=0&modestbranding=1`;
}
