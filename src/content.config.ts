import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  AI_USE_TASKS,
  DEFAULT_AI_DISCLOSURE,
  DEFAULT_AI_GENERATED_DISCLOSURE,
  GUIDE_FORMATS,
  PUBLICATION_STATUSES,
  inferLegacyGuideFormat,
  normalizeGuidePublication,
} from './components/editorial/model';

const playbooks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/playbooks' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    role: z.enum([
      'teachers', 'students', 'small-business',
      'ngos', 'researchers', 'content-creators',
      'farmers', 'job-seekers', 'freelancers', 'entrepreneurs',
      'developers', 'lawyers', 'designers', 'marketers',
    ]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    timeToComplete: z.string(),
    toolsUsed: z.array(z.string()),
    workflows: z.number(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    toolName: z.string(),
    category: z.enum([
      'writing', 'design', 'research', 'coding',
      'video', 'audio', 'productivity', 'education',
      'data', 'translation', 'presentation',
    ]),
    pricing: z.enum(['free', 'freemium', 'paid', 'enterprise']),
    pricingDetails: z.string(),
    website: z.string().url(),
    rating: z.number().min(1).max(5),
    bestFor: z.array(z.string()),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    affiliateUrl: z.string().url().optional(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const guidePublicationSchema = z.object({
  status: z.enum(PUBLICATION_STATUSES).default('published'),
  index: z.boolean().default(true),
  monetize: z.boolean().default(true),
});

const guideEvidenceSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1).optional(),
  kind: z.enum(['primary', 'secondary', 'dataset', 'first-hand']).default('primary'),
  publishedAt: z.coerce.date().optional(),
  checkedAt: z.coerce.date().optional(),
  note: z.string().max(240).optional(),
});

const guideEvidenceSchema = z.object({
  mode: z.enum([
    'primary-sources',
    'mixed-sources',
    'documented-test',
    'creator-source-plus-verification',
    'none',
  ]),
  sources: z.array(guideEvidenceSourceSchema).default([]),
  limitations: z.array(z.string().min(1)).default([]),
});

const guideAiUseSchema = z.object({
  mode: z.enum(['ai-assisted', 'ai-generated']).default('ai-assisted'),
  tasks: z.array(z.enum(AI_USE_TASKS)).default(['research', 'drafting', 'editing']),
  disclosure: z.string().min(20).optional(),
}).transform((data) => ({
  ...data,
  disclosure:
    data.disclosure ??
    (data.mode === 'ai-generated' ? DEFAULT_AI_GENERATED_DISCLOSURE : DEFAULT_AI_DISCLOSURE),
}));

const guideVideoSchema = z.object({
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'Expected an 11-character YouTube video ID'),
  title: z.string().min(1),
  description: z.string().max(240).optional(),
  creatorName: z.string().min(1),
  creatorType: z.enum(['Person', 'Organization']).default('Organization'),
  creatorUrl: z.string().url().optional(),
  publishedAt: z.coerce.date().optional(),
  durationSeconds: z.number().int().positive().optional(),
});

const guideSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  category: z.enum([
    'education', 'business', 'agriculture',
    'healthcare', 'government', 'language',
    'research', 'general', 'design', 'technology',
  ]),
  publishedDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  coverImage: z.string(),
  tags: z.array(z.string()),
  relatedPlaybook: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  format: z.enum(GUIDE_FORMATS).optional(),
  publication: guidePublicationSchema.optional(),
  factCheckedAt: z.coerce.date().optional(),
  reviewDueAt: z.coerce.date().optional(),
  evidence: guideEvidenceSchema.optional(),
  aiUse: guideAiUseSchema.optional(),
  video: guideVideoSchema.optional(),
  lensSummary: z.string().max(320).optional(),
  learningOutcome: z.string().max(240).optional(),
  nextAction: z.string().max(240).optional(),
})
  .superRefine((data, context) => {
    if (data.format === 'video-lesson' && !data.video) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video'],
        message: 'Video lessons require creator-attributed YouTube metadata.',
      });
    }

    if (data.format !== 'video-lesson' && data.video) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['video'],
        message: 'Video metadata is only valid when format is video-lesson.',
      });
    }

    if (data.evidence && data.evidence.mode !== 'none' && data.evidence.sources.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['evidence', 'sources'],
        message: 'This evidence mode requires at least one source.',
      });
    }

    if (
      data.factCheckedAt &&
      data.reviewDueAt &&
      data.reviewDueAt.getTime() < data.factCheckedAt.getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reviewDueAt'],
        message: 'reviewDueAt cannot be earlier than factCheckedAt.',
      });
    }
  })
  .transform((data) => ({
    ...data,
    format: inferLegacyGuideFormat(data),
    publication: normalizeGuidePublication(data),
    aiUse: data.aiUse ?? {
      mode: 'ai-assisted' as const,
      tasks: ['research', 'drafting', 'editing'] as (typeof AI_USE_TASKS)[number][],
      disclosure: DEFAULT_AI_DISCLOSURE,
    },
  }));

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: guideSchema,
});

const reports = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    source: z.string(),
    sourceUrl: z.string().url(),
    reportYear: z.number(),
    keyInsights: z.array(z.string()),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/prompts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    role: z.enum([
      'teachers', 'students', 'small-business',
      'ngos', 'researchers', 'content-creators', 'general',
      'developers',
    ]),
    toolFor: z.string(),
    task: z.string(),
    publishedDate: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const opportunities = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/opportunities' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    category: z.enum([
      'course', 'grant', 'fellowship', 'competition',
      'toolkit', 'scholarship', 'certification',
    ]),
    provider: z.string(),
    url: z.string().url(),
    cost: z.enum(['free', 'partially-free', 'paid']),
    deadline: z.coerce.date().optional(),
    verified: z.boolean().default(true),
    verifiedDate: z.coerce.date(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { playbooks, tools, guides, reports, prompts, opportunities };
