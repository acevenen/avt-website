// Central map of belt → unlisted YouTube video ID.
// Paste the 11-char ID from the share URL (youtu.be/<ID> or watch?v=<ID>).
// Leave "" to keep the placeholder. This is the ONLY place to edit when
// videos are uploaded — /learn and /paid both read from here.
export interface BeltVideo {
  youTubeId: string;
  label: string;
}

export const beltVideos: Record<string, BeltVideo> = {
  // ── Free tier (rendered on /learn) ──
  white: { youTubeId: "", label: "White Belt — What Trading Actually Is" },
  yellow: { youTubeId: "", label: "Yellow Belt — The Non-Negotiable Rules" },
  orange: { youTubeId: "", label: "Orange Belt — Reading the Chart" },
  // ── Paid tier (rendered on /paid) ──
  green: { youTubeId: "", label: "Green Belt — Daily Bias & Alignment" },
  blue: { youTubeId: "", label: "Blue Belt — The 9/20 EMA Setup" },
  purple: { youTubeId: "", label: "Purple Belt — Flags & Momentum" },
  brown: { youTubeId: "", label: "Brown Belt — Trade Management" },
  brown2: { youTubeId: "", label: "Brown Belt II — Funded Account Gameplan" },
  brown3: { youTubeId: "", label: "Brown Belt III — Discipline Reinforcement" },
};

export function embedUrl(youTubeId: string): string {
  // youtube-nocookie for privacy; modestbranding + rel=0 to keep it clean.
  return `https://www.youtube-nocookie.com/embed/${youTubeId}?rel=0&modestbranding=1`;
}
