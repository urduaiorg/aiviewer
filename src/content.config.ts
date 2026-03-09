import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const playbooks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/playbooks' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    role: z.enum([
      'teachers', 'students', 'small-business',
      'ngos', 'researchers', 'content-creators',
      'farmers', 'job-seekers', 'freelancers', 'entrepreneurs',
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

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
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
  }),
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
    ]),
    toolFor: z.string(),
    task: z.string(),
    publishedDate: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { playbooks, tools, guides, reports, prompts };
