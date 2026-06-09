export type Thumb = {
  id: string;
  title: string;
  subtitle: string;
  palette: string[];
  score: number;
  style: string;
  imageUrl?: string;
  accent: string;
};

export const palettes = [
  ["#0b1020", "#ff3d7f", "#ffcf32", "#ffffff"],
  ["#111827", "#22c55e", "#38bdf8", "#f8fafc"],
  ["#1f1300", "#f97316", "#facc15", "#fff7ed"],
  ["#171717", "#ef4444", "#f5f5f5", "#a3e635"],
  ["#09111f", "#06b6d4", "#f43f5e", "#f8fafc"],
  ["#201033", "#fb7185", "#fde047", "#fdf4ff"],
];

export const sampleThumbs: Thumb[] = [
  {
    id: "sample-1",
    title: "I tested 47 AI agents",
    subtitle: "Only 3 survived",
    palette: palettes[0],
    score: 91,
    style: "High contrast creator shock",
    accent: "Diagonal alert banner",
  },
  {
    id: "sample-2",
    title: "Build a SaaS in one day",
    subtitle: "From prompt to checkout",
    palette: palettes[1],
    score: 87,
    style: "Clean tech tutorial",
    accent: "Glass panel breakdown",
  },
  {
    id: "sample-3",
    title: "This thumbnail doubled CTR",
    subtitle: "Trend teardown",
    palette: palettes[2],
    score: 94,
    style: "Warm viral case study",
    accent: "Oversized proof badge",
  },
];

export const trendSignals = [
  "Oversized face crop with one emotional focal point",
  "Yellow or lime proof badge in top-left safe zone",
  "Three-word headline, maximum two visual subjects",
  "High edge contrast around objects for mobile feeds",
  "One saturated accent on charcoal or warm shadow base",
];

export const workflowSteps = [
  {
    title: "Score the idea",
    text: "Check title length, curiosity hooks, niche specificity, and mobile-readable wording before spending credits.",
  },
  {
    title: "Generate angles",
    text: "Create six packaging directions with different proof devices, palettes, and composition logic.",
  },
  {
    title: "Edit for mobile",
    text: "Tune overlay text, compare scores, and export a 1280x720 PNG with the right plan watermark behavior.",
  },
];

export const competitorRows = [
  {
    name: "Pikzels",
    focus: "AI YouTube packaging suite",
    gap: "Powerful, but credit math and higher tiers can feel heavy for smaller creators.",
    thumbBoost: "Lower-cost preflight for creators who want faster title + thumbnail decisions.",
  },
  {
    name: "ThumbnailTest",
    focus: "A/B testing and winner reporting",
    gap: "Best after a video exists; less useful for shaping the first publish package.",
    thumbBoost: "Pre-publish scoring and variants before committing to a thumbnail direction.",
  },
  {
    name: "vidIQ",
    focus: "Broad channel optimization",
    gap: "Strong discovery suite, but thumbnail creation is part of a larger workflow.",
    thumbBoost: "Focused workspace for packaging, mobile readability, and creator review.",
  },
  {
    name: "Canva",
    focus: "Templates and manual design",
    gap: "Easy to design, but creators still have to judge the strategic angle manually.",
    thumbBoost: "Turns the strategy into scored thumbnail directions before final polishing.",
  },
];

export const caseStudies = [
  {
    title: "Challenge video",
    subtitle: "A 24-hour AI build needed one obvious emotional hook.",
    result: "Shifted from tool collage to one bold proof claim and a high-contrast progress marker.",
    overlay: "AI built my startup",
    thumb: sampleThumbs[0],
  },
  {
    title: "Tutorial launch",
    subtitle: "A technical SaaS walkthrough needed to feel simpler on mobile.",
    result: "Reduced the concept to a two-subject layout, one clean CTA phrase, and a blue/green contrast stack.",
    overlay: "ship faster",
    thumb: sampleThumbs[1],
  },
  {
    title: "CTR teardown",
    subtitle: "A creator wanted a proof-led angle without sounding like generic clickbait.",
    result: "Moved the number into the safe zone and used a warm palette to separate it from AI-tool sameness.",
    overlay: "CTR teardown",
    thumb: sampleThumbs[2],
  },
];

export const faqs = [
  {
    question: "Is ThumbBoost replacing a designer?",
    answer:
      "No. It is a fast packaging preflight for title, hook, layout, and mobile-readability decisions before you polish the final asset.",
  },
  {
    question: "Can I use it without signing in?",
    answer:
      "You can explore the workflow and generate previews. Signing in saves history and unlocks plan-specific export behavior.",
  },
  {
    question: "What makes this different from a generic image generator?",
    answer:
      "ThumbBoost is organized around YouTube packaging signals: title strength, hook clarity, safe-zone text, contrast, and repeatable angle testing.",
  },
  {
    question: "Why compare against testing tools?",
    answer:
      "A/B testing finds winners after publishing. ThumbBoost helps you shape stronger options before the video goes live.",
  },
];

export function makeThumbs(title: string, channel: string, keywords: string): Thumb[] {
  const seed = `${title} ${channel} ${keywords}`.trim() || "viral creator thumbnail";
  const words = seed.split(/\s+/).filter(Boolean);
  return palettes.map((palette, index) => ({
    id: `${Date.now()}-${index}`,
    title: title || ["I tried", words[0] || "the", "new trend"].join(" "),
    subtitle:
      index % 2 === 0
        ? `${channel || "Creator Lab"} verdict`
        : `${keywords || "CTR-ready style"}`,
    palette,
    score: Math.min(98, 72 + ((seed.length + index * 7) % 27)),
    style:
      [
        "MrBeast-inspired proof stack",
        "Creator tech breakdown",
        "Reaction face with evidence",
        "Minimal premium tutorial",
        "Dark lab experiment",
        "Warm viral comparison",
      ][index] || "Trend adaptive",
    accent:
      [
        "Arrow callout",
        "Split before-after",
        "Glow cutout",
        "Big numeric hook",
        "Face-safe text zone",
        "Mobile-first contrast",
      ][index] || "Safe-zone headline",
  }));
}

export function scorePrompt(title: string, description: string, keywords: string) {
  const text = `${title} ${description} ${keywords}`.toLowerCase();
  let score = 52;
  if (title.length > 15 && title.length < 70) score += 10;
  if (/tested|tried|secret|mistake|before|after|better|worst|best/.test(text)) score += 12;
  if (/\d/.test(text)) score += 8;
  if (keywords.split(",").filter((keyword) => keyword.trim()).length >= 2) score += 7;
  if (description.length > 80) score += 6;
  return Math.min(score, 96);
}
