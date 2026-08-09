/**
 * AIViewer.ai — Shared Site Configuration
 * Single source of truth for all site-wide settings.
 * All agents should import from here instead of hardcoding values.
 */

export const siteConfig = {
  // ── Identity ──
  name: 'AIViewer.ai',
  tagline: 'Understand AI. Use it well.',
  description: 'Selected AI videos, primary sources, and practical lessons explained in clear English by the AIViewer editorial system from UrduAI.',
  url: 'https://aiviewer.ai',
  locale: 'en-US',

  // ── Parent brand ──
  network: {
    name: 'UrduAI',
    url: 'https://www.urduai.org',
  },

  // ── Author ──
  author: {
    name: 'Qaisar Roonjha',
    title: 'AI Education Specialist',
    twitter: 'https://x.com/QRoonjha',
    linkedin: 'https://www.linkedin.com/in/roonjha/',
    facebook: 'https://facebook.com/qroonjha',
  },

  // ── SEO defaults ──
  seo: {
    titleTemplate: '%s — AIViewer.ai',
    ogImage: '/og-default.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image' as const,
    robotsPolicy: 'index, follow',
  },

  // ── Model Tracker API ──
  api: {
    workerBase: 'https://aiviewer-benchmark-api.qaisar-roonjha.workers.dev',
  },

  // ── Analytics (SETUP REQUIRED) ──
  // 1. Cloudflare: dash.cloudflare.com → Web Analytics → Add site → copy token
  // 2. Google: search.google.com/search-console → Settings → Verify → HTML tag → copy content value
  analytics: {
    cloudflareToken: '',
    googleSiteVerification: '',
  },

  // ── Monetization ──
  monetization: {
    adsenseClient: 'ca-pub-8532451951782012',
    adsTxtPublisherId: 'pub-8532451951782012',
    contactEmail: 'hi@aiviewer.ai',
  },

  // ── Image conventions ──
  images: {
    // Cover images for content cards
    cover: { width: 1200, height: 630, format: 'jpg' },
    // Author photos
    author: { width: 400, height: 400, format: 'jpg' },
    // OG/social share
    og: { width: 1200, height: 630, format: 'png' },
    // Directory structure under public/images/
    paths: {
      playbooks: '/images/playbooks/',
      tools: '/images/tools/',
      guides: '/images/guides/',
      reports: '/images/reports/',
      author: '/images/author/',
      og: '/images/og/',
    },
    // Fallback gradient for missing cover images
    fallbackGradient: 'from-indigo-50 to-zinc-50',
  },

  // ── Navigation ──
  nav: {
    main: [
      { label: 'Learn AI', href: '/learn/' },
      { label: 'Video Lessons', href: '/video-lessons/' },
      { label: 'AI Signals', href: '/signals/' },
      { label: 'Practical Guides', href: '/practical-guides/' },
      { label: 'About', href: '/about/' },
    ],
    cta: { label: 'Start learning', href: '/learn/' },
    footer: {
      content: [
        { label: 'Learn AI', href: '/learn/' },
        { label: 'Video Lessons', href: '/video-lessons/' },
        { label: 'AI Signals', href: '/signals/' },
      ],
      resources: [
        { label: 'All guides', href: '/guides/' },
        { label: 'AI tools', href: '/tools/' },
        { label: 'AI glossary', href: '/glossary/' },
        { label: 'Newsletter', href: '/newsletter/' },
        { label: 'Practical Guides', href: '/practical-guides/' },
        { label: 'About', href: '/about/' },
      ],
      trust: [
        { label: 'Editorial standards', href: '/editorial-standards/' },
        { label: 'Review methodology', href: '/review-methodology/' },
        { label: 'AI use', href: '/ai-use/' },
        { label: 'Corrections', href: '/corrections/' },
        { label: 'Disclosure', href: '/disclosure/' },
        { label: 'Ownership & funding', href: '/ownership-and-funding/' },
        { label: 'Privacy', href: '/privacy/' },
        { label: 'Terms', href: '/terms/' },
        { label: 'Contact', href: '/contact/' },
      ],
      social: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/roonjha/' },
        { label: 'X / Twitter', href: 'https://x.com/QRoonjha' },
        { label: 'Facebook', href: 'https://facebook.com/qroonjha' },
      ],
    },
  },
} as const;

/**
 * Editorial System — Legacy Rating Metadata & Content Standards
 *
 * Ratings remain in legacy frontmatter for compatibility. They must not be
 * rendered, used for rankings, or emitted as schema until an auditable test
 * record supports the score under /review-methodology/.
 *
 * INTERNAL SCALE (1-5):
 *   5.0       — Exceptional. Best-in-class, no meaningful drawbacks for target audience
 *   4.5-4.9   — Excellent. Strong recommendation with minor caveats
 *   4.0-4.4   — Very Good. Solid choice, some notable limitations
 *   3.5-3.9   — Good. Works well for specific use cases, not universal
 *   3.0-3.4   — Decent. Usable but significant trade-offs
 *   Below 3.0 — Weak fit; do not publish a public score without evidence.
 *
 * FEATURED CRITERIA:
 *   Content is marked `featured: true` when it meets ALL of these:
 *   1. High relevance — serves the widest audience segment
 *   2. High quality — thoroughly researched, well-written
 *   3. Timely — recently published or updated
 *   4. Strategic — represents a key content pillar
 *   Max 2 featured items per collection at any time.
 *
 * EDITORIAL TONE:
 *   - Direct and clear. No hedging, no filler.
 *   - Authoritative but approachable. Expert friend, not professor.
 *   - Honest verdicts. We say what we think. No wishy-washy "it depends."
 *   - Action-oriented. Every piece ends with what to DO.
 *   - Zero jargon without explanation. If we use a term, we define it inline.
 *
 * REVIEW STRUCTURE:
 *   Tool reviews follow: Overview → Key Features → Pros/Cons → Pricing → Verdict
 *   Playbooks follow: Context → Step-by-step → Prompts → Next steps
 *   Guides follow: Why this matters → How it works → What to do
 */
export const editorial = {
  ratingScale: {
    exceptional: { min: 5.0, label: 'Exceptional' },
    excellent: { min: 4.5, label: 'Excellent' },
    veryGood: { min: 4.0, label: 'Very Good' },
    good: { min: 3.5, label: 'Good' },
    decent: { min: 3.0, label: 'Decent' },
  },
  maxFeaturedPerCollection: 2,
  tone: 'authoritative-approachable',
  reviewStructure: ['overview', 'features', 'pros-cons', 'pricing', 'verdict'],
  playbookStructure: ['context', 'steps', 'prompts', 'next-steps'],
  guideStructure: ['why', 'how', 'what-to-do'],
} as const;

/** Role display labels */
export const roleLabels: Record<string, string> = {
  teachers: 'Teachers',
  students: 'Students',
  'small-business': 'Small Business',
  ngos: 'NGOs & Nonprofits',
  researchers: 'Researchers',
  'content-creators': 'Content Creators',
  farmers: 'Farmers',
  'job-seekers': 'Job Seekers',
  freelancers: 'Freelancers',
  entrepreneurs: 'Entrepreneurs',
  developers: 'Developers',
  lawyers: 'Lawyers',
  designers: 'Designers',
  marketers: 'Marketers',
  general: 'Everyone',
};

/** Category display labels (shared across tools & guides) */
export const categoryLabels: Record<string, string> = {
  writing: 'Writing',
  design: 'Design',
  research: 'Research',
  coding: 'Coding',
  video: 'Video',
  audio: 'Audio',
  productivity: 'Productivity',
  education: 'Education',
  data: 'Data',
  translation: 'Translation',
  presentation: 'Presentation',
  business: 'Business',
  agriculture: 'Agriculture',
  healthcare: 'Healthcare',
  government: 'Government',
  language: 'Language',
  general: 'General',
  technology: 'Technology',
};

/** Opportunity category display labels */
export const opportunityCategoryLabels: Record<string, string> = {
  course: 'Course',
  grant: 'Grant',
  fellowship: 'Fellowship',
  competition: 'Competition',
  toolkit: 'Toolkit',
  scholarship: 'Scholarship',
  certification: 'Certification',
};

/** Cost display config */
export const costConfig: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  'partially-free': { label: 'Partially Free', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  paid: { label: 'Paid', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
};

/** Difficulty display config */
export const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  intermediate: { label: 'Intermediate', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  advanced: { label: 'Advanced', color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' },
};

/** Pricing display config */
export const pricingConfig: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  freemium: { label: 'Freemium', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  paid: { label: 'Paid', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  enterprise: { label: 'Enterprise', color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
};
