export const GUIDE_FORMATS = [
  'video-lesson',
  'ai-signal',
  'evergreen-foundation',
  'practical-workflow',
] as const;

export type GuideFormat = (typeof GUIDE_FORMATS)[number];

export const GUIDE_FORMAT_INFO: Record<
  GuideFormat,
  {
    label: string;
    pluralLabel: string;
    collectionLabel: string;
    href: string;
    description: string;
  }
> = {
  'video-lesson': {
    label: 'Video lesson',
    pluralLabel: 'Video lessons',
    collectionLabel: 'video lessons',
    href: '/video-lessons/',
    description: 'Creator-attributed videos paired with an original, source-aware AIViewer lesson.',
  },
  'ai-signal': {
    label: 'AI signal',
    pluralLabel: 'AI signals',
    collectionLabel: 'AI signals',
    href: '/signals/',
    description: 'Time-sensitive AI developments separated into confirmed facts, open questions, and practical impact.',
  },
  'evergreen-foundation': {
    label: 'Foundation',
    pluralLabel: 'Learn',
    collectionLabel: 'foundation guides',
    href: '/learn/',
    description: 'Durable explanations of the concepts and choices behind useful AI.',
  },
  'practical-workflow': {
    label: 'Practical guide',
    pluralLabel: 'Practical guides',
    collectionLabel: 'practical guides',
    href: '/practical-guides/',
    description: 'Outcome-led workflows with a concrete action readers can try.',
  },
};

export const PUBLICATION_STATUSES = ['draft', 'published', 'archived'] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const AI_USE_TASKS = [
  'research',
  'source-review',
  'drafting',
  'editing',
  'translation',
  'image-generation',
] as const;

export const DEFAULT_AI_DISCLOSURE =
  'AIViewer’s autonomous editorial system used AI for research, drafting, and editing. No human review is claimed; check important decisions against the linked sources and stated limitations.';

export const DEFAULT_AI_GENERATED_DISCLOSURE =
  'AIViewer’s autonomous editorial system generated and edited this article with AI. No human review is claimed; verify important claims against the linked sources and stated limitations.';

interface LegacyGuideData {
  title?: string;
  tags?: readonly string[];
  format?: GuideFormat;
}

/**
 * Keeps the existing MDX library valid without silently treating timely
 * briefings or practical walkthroughs as evergreen reference material.
 * New content should always set `format` explicitly.
 */
export function inferLegacyGuideFormat(data: LegacyGuideData): GuideFormat {
  if (data.format) return data.format;

  const title = data.title?.toLowerCase() ?? '';
  const tags = new Set((data.tags ?? []).map((tag) => tag.toLowerCase()));
  const signalTags = [
    'ai news',
    'ai update',
    'ai updates',
    'daily brief',
    'weekly update',
    'announcements',
  ];

  if (
    signalTags.some((tag) => tags.has(tag)) ||
    /\b(news|weekly update|ai update|announcements?|rolls out|launched|launches)\b/.test(title)
  ) {
    return 'ai-signal';
  }

  if (
    tags.has('how-to') ||
    tags.has('workflow') ||
    tags.has('workflows') ||
    /^(how to|a practical guide)\b/.test(title) ||
    /\b(workflow|zero-budget stack|tool stacks?)\b/.test(title)
  ) {
    return 'practical-workflow';
  }

  return 'evergreen-foundation';
}

interface PublicationGuideData {
  draft?: boolean;
  publication?: {
    status?: PublicationStatus;
    index?: boolean;
    monetize?: boolean;
  };
}

export function normalizeGuidePublication(data: PublicationGuideData) {
  const isLegacyDraft = data.draft === true;

  return {
    status: data.publication?.status ?? (isLegacyDraft ? 'draft' : 'published'),
    index: data.publication?.index ?? !isLegacyDraft,
    monetize: data.publication?.monetize ?? !isLegacyDraft,
  };
}

export function isPublishedGuide(data: PublicationGuideData): boolean {
  const publication = normalizeGuidePublication(data);
  return !data.draft && publication.status === 'published';
}
