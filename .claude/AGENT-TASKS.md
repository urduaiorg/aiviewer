# AIViewer.ai — Multi-Agent Task Coordination
> **Lead Agent**: Agent 1 (Architecture & Supervision)
> Last updated by: Agent 1
> Timestamp: 2026-03-09

---

## TEAM RULES (MANDATORY — ALL AGENTS)

### 1. Communication Protocol
- **Questions?** Write them in the `AGENT QUESTIONS` section at the bottom of this file
- **Format**: `[Agent #N] Question text here`
- Agent 1 checks this file regularly and will answer inline
- **Do NOT guess** if you're unsure about patterns, conventions, or where something goes — ask

### 2. Before You Write Code
- **Read this entire file first** — understand what's done and what's in progress
- **Import from `src/data/site.config.ts`** — never hardcode brand colors, labels, or navigation
- **Use Astro 5 patterns** (see code examples below) — NOT Astro 4
- **Check if a component already exists** in `src/components/content/` before building a new one

### 3. Quality Standard: 200%
- Every pixel, every interaction, every line of copy — world-class
- No placeholder text left behind. No "Lorem ipsum." Write real, editorial-quality content
- No generic Heroicons. Custom SVGs or purpose-built icons only
- Every page must feel like it belongs to the same premium editorial brand
- If it doesn't look like a top-3 site in the world, redo it

### 4. Code Standards
- **Astro 5 render pattern**: `import { getCollection, render } from 'astro:content'` + `await render(entry)`
- **Static paths**: `params: { slug: entry.id }` (string, NOT `entry.id.split('/')`)
- **Component defaults**: Always provide fallback defaults for optional props (e.g., `const { tiers = [] } = Astro.props`)
- **Layout class**: Use `.page-container` for consistent max-width + padding
- **Transitions**: Use `transition-card`, `shadow-[var(--shadow-card)]`, `hover:shadow-[var(--shadow-card-hover)]` for cards
- **No emojis in UI**. No emoji badges, no emoji labels

### 5. Reporting
- When you finish a task, update your status in this file to `DONE`
- List any known issues under `Issues / Follow-up` in your section
- If you create a file not in the file structure reference, add it

### 6. Content Freshness (CRITICAL — March 2026)
**All content MUST reflect the current AI landscape as of March 2026.**
- **Claude models**: Opus 4.6 (Feb 2026), Sonnet 4.6 (Feb 2026), Haiku 4.5 (Oct 2025)
- **OpenAI models**: GPT-5.4 (March 5, 2026), GPT-5.4 Thinking, GPT-5.3 Instant
- **Cursor IDE**: v2.0 with Composer model, multi-agent, supports Sonnet 4.6, Opus 4.6, GPT-5.2, Gemini 3 Pro, Grok Code. Now in JetBrains via ACP.
- **NEVER reference**: GPT-3.5, GPT-4, GPT-4o, Claude 3, Claude 3.5 Sonnet, Claude 3 Opus — these are all outdated
- If you're unsure about a model name or capability, ASK Agent 1 before publishing
- Every article must read like it was written THIS WEEK, not 6 months ago

### 7. What NOT To Do
- Don't modify files owned by another agent without asking Agent 1 first
- Don't install new npm packages without noting it here
- Don't change `astro.config.mjs`, `content.config.ts`, or `site.config.ts` without Agent 1 approval
- Don't create README, CHANGELOG, or documentation files
- Don't add Pakistan/Canada references in any public-facing copy
- Don't reference outdated AI models (see Rule 6 above)

---

## PROJECT RULES (BRAND & DESIGN)
- **Creative standard**: 200% effort, #1-in-the-world execution in every discipline
- **Brand**: AI (#F0C75E soft gold), Viewer (zinc-900 light / white dark), Montserrat Bold logo
- **Colors**: indigo-600 interactive, warm zinc neutrals, #F0C75E brand gold
- **Fonts**: Inter body, Inter Tight headings, Montserrat logo only
- **Design philosophy**: "Wirecutter meets freeCodeCamp" — editorial authority
- **NO**: generic patterns, stock icons, emojis as UI, Pakistan/Canada in public copy
- **Tech**: Astro 5.x static, Tailwind CSS v4 via @tailwindcss/vite, `@astrojs/mdx`
- **Content collections**: `src/content.config.ts` (Astro 5 glob loader — NOT `src/content/config.ts`)
- **Site config**: `src/data/site.config.ts` — single source of truth for labels, nav, editorial rules

---

## SEO / AEO EXCELLENCE GUIDE (MANDATORY — ALL AGENTS)

> Our goal: **Page 1 on Google AND cited by AI answer engines** (Perplexity, ChatGPT, Google AI Overviews).
> Every content file and every page must follow these rules. No exceptions.

### What Agent 1 Already Wired (DO NOT REDO):
- BreadcrumbSchema on ALL 5 detail pages (tools, playbooks, guides, reports, prompts)
- ArticleSchema on playbooks, guides, reports, and prompts detail pages
- ReviewSchema on tool detail pages
- WebSite schema with SearchAction on homepage
- BaseLayout: `robots` meta (index, follow, max-image-preview:large, max-snippet:-1), `author`, `theme-color`, `apple-touch-icon`
- OG tags, Twitter cards, canonical URLs, article dates — all wired

### SEO Rules for Content Writers (Agent 3):

**1. Every MDX file MUST have a FAQ section**
```mdx
## Frequently Asked Questions

### Is [tool name] free?
[Direct answer in 1-2 sentences. No hedging.]

### How does [tool/topic] work?
[Clear, concise explanation.]

### Who should use [tool/topic]?
[Specific audience + use cases.]
```
- Minimum 4 Q&As per file
- Questions must be REAL questions people Google (not filler)
- Answers must be direct — first sentence IS the answer, then details
- This powers our FAQSchema component for rich results

**2. Heading Format for AEO**
- Use **question-format H2 headings** where natural:
  - GOOD: `## What Are ChatGPT's Key Features?`
  - GOOD: `## How Much Does ChatGPT Cost?`
  - OK: `## Key Features` (acceptable for scan-oriented sections)
  - BAD: `## Features Overview and Discussion`
- H3 for sub-topics under each H2
- Every H2 section should have a **direct answer in the first paragraph** (the "answer paragraph")

**3. Answer-Oriented Descriptions**
- Frontmatter `description` must answer a question directly:
  - GOOD: `"ChatGPT is a free AI chatbot by OpenAI for writing, coding, research, and brainstorming. Paid tiers unlock GPT-4o and image generation."`
  - BAD: `"A comprehensive review of ChatGPT exploring features and pricing."`
- Think: "If someone asks 'What is [this]?', does my description answer it?"

**4. Use the AnswerBox Component**
New component at `src/components/content/AnswerBox.astro`:
```mdx
import AnswerBox from '../../components/content/AnswerBox.astro';

<AnswerBox
  question="Is ChatGPT free?"
  answer="Yes, ChatGPT offers a free tier with access to GPT-3.5. ChatGPT Plus costs $20/month and includes GPT-4o, image generation, and priority access."
/>
```
- Place near the top of tool reviews (after intro paragraph)
- Use for the single most-searched question about the topic
- Keep answer to 1-3 sentences — extractable by AI systems

**5. Content Depth Requirements**
- Tool reviews: minimum 800 words + ToolPickBox + ProsCons + FAQ section
- Guides: minimum 1000 words with clear H2/H3 structure
- Playbooks: minimum 600 words with PromptBlock examples
- Every piece must have `tags` (5-8 relevant keywords) in frontmatter

**6. Internal Linking**
- Every MDX file should link to at least 1 related piece of content
- Use the `relatedPlaybook` field in guides where applicable
- Mention other tools by name and link to their review page: `[ChatGPT](/tools/chatgpt/)`
- This builds our internal link graph — critical for SEO authority

### SEO Rules for Page Builders (Agent 2):

**1. Every listing page needs unique, descriptive meta**
- Title: "[Category] - AIViewer.ai" (under 60 chars)
- Description: Action-oriented, under 155 chars, includes primary keyword
- Example: `"Compare the best AI writing, design, and research tools. Honest reviews with ratings, pricing, and real-world use cases."`

**2. Structured data awareness**
- Listing pages don't need Schema.org (detail pages handle that)
- BUT listing pages need proper semantic HTML: `<main>`, `<article>`, `<nav>` for filters
- Category filter bar should use `<nav aria-label="Category filters">` for accessibility

**3. Performance = SEO**
- No heavy JS on listing pages — vanilla JS only for filters
- Images must have `loading="lazy"` and `decoding="async"`
- Keep CSS inline for above-the-fold content where possible

### Schema.org Components Reference:
| Component | Used On | Props |
|-----------|---------|-------|
| `ArticleSchema` | playbooks, guides, reports, prompts detail pages | title, description, image?, publishedDate, updatedDate?, authorName? |
| `ReviewSchema` | tools detail pages | itemName, itemImage?, description, ratingValue, bestRating?, worstRating?, authorName?, datePublished |
| `BreadcrumbSchema` | ALL detail pages | items: {name, url}[] |
| `FAQSchema` | tools detail pages (wire into `[...slug].astro`) | faqs: {question, answer}[] |
| `AnswerBox` | MDX content (not schema, but AEO) | question?, answer, label? |

## COMPLETED (DO NOT REDO)
### Phase 1 — Foundation ✅
- [x] Project init, deps, Astro config, Tailwind v4
- [x] BaseLayout.astro (meta, OG, fonts, slots)
- [x] Header.astro (sticky, backdrop-blur, mobile menu)
- [x] Footer.astro (4-col grid, UrduAI branding)
- [x] global.css (design system tokens, prose styles)
- [x] Homepage index.astro (6 sections, custom SVG illustrations)
- [x] Content config with 5 collections (playbooks, tools, guides, reports, prompts)
- [x] Breadcrumbs.astro, Navigation.astro, MobileMenu.astro
- [x] Utils: formatDate.ts, readingTime.ts, generateTOC.ts

### Phase 2 — Core Components ✅
- [x] TableOfContents (scroll-spy, vertical timeline indicator)
- [x] AuthorBio (gradient border, verified badge, credentials)
- [x] PromptBlock (terminal-style, copy button, light/dark variants)
- [x] ToolPickBox (Wirecutter-style Our Pick card, rating, pricing)
- [x] ComparisonTable (winner column, dot scores, boolean checks, verdict)
- [x] PricingTable (tier cards, Best Value badge, feature lists)
- [x] ProsCons (balance indicator, thumbs up/down, split panel, verdict)
- [x] AdSlot (tasteful fallback, sponsored label, 3 sizes)
- [x] AffiliateLink (3 variants, 3 sizes, rel=sponsored, disclosure)
- [x] Preview page at /preview/ (showcases all components)

---

## AGENT 2 — Collection Pages Agent
**Status**: DONE
**Brief**: Build all listing + detail pages for content collections

### Tasks:
1. `src/pages/playbooks/index.astro` — Grid listing for all playbooks
   - Filter by role, sort by date
   - Card design with cover image, title, role badge, difficulty, reading time
   - Use `.page-container` layout class

2. `src/pages/playbooks/[...slug].astro` — Individual playbook page
   - Uses `getCollection('playbooks')` + `getStaticPaths()`
   - Article layout: sidebar TOC (use TableOfContents component) + main content
   - Include: AuthorBio at bottom, Breadcrumbs at top
   - Schema.org Article structured data in `<slot name="head">`

3. `src/pages/tools/index.astro` — Tool directory with category filters
   - Filter tabs by category (writing, design, research, etc.)
   - Card grid with rating stars, pricing badge, "Best for" tags

4. `src/pages/tools/[...slug].astro` — Individual tool review page
   - Uses ToolPickBox, ProsCons, PricingTable, ComparisonTable components
   - Schema.org Review structured data

5. `src/pages/guides/index.astro` — Guide listing page
   - Simple card grid, category badges

6. `src/pages/guides/[...slug].astro` — Individual guide page
   - Article layout with TOC sidebar
   - Related playbook link if `relatedPlaybook` exists

7. `src/pages/about/index.astro` — About page
   - Mission statement, team section (use AuthorBio)
   - "Part of the UrduAI network" section

### Import paths for components:
```
import TableOfContents from '../../components/content/TableOfContents.astro';
import AuthorBio from '../../components/content/AuthorBio.astro';
import PromptBlock from '../../components/content/PromptBlock.astro';
import ToolPickBox from '../../components/content/ToolPickBox.astro';
import ComparisonTable from '../../components/content/ComparisonTable.astro';
import PricingTable from '../../components/content/PricingTable.astro';
import ProsCons from '../../components/content/ProsCons.astro';
import AdSlot from '../../components/content/AdSlot.astro';
import AffiliateLink from '../../components/content/AffiliateLink.astro';
import Breadcrumbs from '../../components/layout/Breadcrumbs.astro';
```

### Collection usage pattern (Astro 5):
```astro
---
import { getCollection } from 'astro:content';
const playbooks = await getCollection('playbooks', ({ data }) => !data.draft);
---
```

### Detail page pattern (Astro 5):
```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('playbooks');
  return entries.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, headings } = await render(entry);
---
```

### Issues / Follow-up
- No known Agent 2 route gaps remain after build verification. Playbooks index now includes role filters, cover-image treatment, and reading-time metadata. Tool detail now integrates `PricingTable` and `ComparisonTable`.

---

## AGENT 3 — Content & SEO Agent
**Status**: DONE (Finished Task 3E - Dark Mode)
**Brief**: Create sample content + SEO infrastructure + Pagefind Search Integration

### Tasks:
1. **Sample playbook content** — Create 2 sample .mdx files in `src/content/playbooks/`:
   - `ai-for-teachers-lesson-planning.mdx` (role: teachers)
   - `small-business-ai-customer-service.mdx` (role: small-business)
   - Use PromptBlock, ToolPickBox components via MDX
   - Must match the Zod schema in content.config.ts exactly

2. **Sample tool reviews** — Create 2 in `src/content/tools/`:
   - `chatgpt.mdx` (category: writing, pricing: freemium)
   - `perplexity-ai.mdx` (category: research, pricing: freemium)

3. **Sample guide** — Create 1 in `src/content/guides/`:
   - `getting-started-with-ai.mdx` (category: general)

4. **SEO components**:
   - `src/components/seo/ArticleSchema.astro` — Schema.org Article JSON-LD
   - `src/components/seo/ReviewSchema.astro` — Schema.org Review JSON-LD
   - `src/components/seo/BreadcrumbSchema.astro` — Schema.org BreadcrumbList JSON-LD
   - `src/components/seo/FAQSchema.astro` — Schema.org FAQ JSON-LD

5. **robots.txt** + **sitemap config** — `public/robots.txt` pointing to sitemap

6. **Priority #8: Search Integration** — Add `pagefind` for client-side search across all content collections.

### Content frontmatter examples:
```yaml
# Playbook frontmatter
---
title: "AI for Teachers: Lesson Planning Made Simple"
description: "Step-by-step guide for teachers to use AI tools in lesson planning."
role: teachers
difficulty: beginner
timeToComplete: "15 min"
toolsUsed: ["ChatGPT", "Perplexity"]
workflows: 3
publishedDate: 2026-03-01
coverImage: "/images/playbooks/teachers-lesson-planning.jpg"
tags: ["teachers", "lesson planning", "ChatGPT"]
featured: true
draft: false
---
```

### MDX component usage:
```mdx
import PromptBlock from '../../components/content/PromptBlock.astro';
import ToolPickBox from '../../components/content/ToolPickBox.astro';

<PromptBlock tool="ChatGPT" prompt="You are a curriculum advisor..." />

<ToolPickBox name="Perplexity AI" verdict="Best for research" ... />
```

---

## AGENT 4 — Reports + Prompts + Polish Agent (OPTIONAL)
**Status**: DONE
**Brief**: Remaining collection pages + global polish

### Tasks:
1. `src/pages/reports/index.astro` — Report listing
2. `src/pages/reports/[...slug].astro` — Individual report
3. `src/pages/prompts/index.astro` — Prompt library with filters
4. `src/pages/prompts/[...slug].astro` — Individual prompt page
5. Sample content: 1 report in `src/content/reports/`, 2 prompts in `src/content/prompts/`
6. `src/pages/advertise/index.astro` — Advertise with us page
7. `public/og-default.png` — Default Open Graph image (1200x630)
8. `public/images/` directory structure setup
9. 404 page: `src/pages/404.astro`

---

## FILE STRUCTURE REFERENCE
```
src/
├── components/
│   ├── content/          ← Phase 2 (DONE)
│   │   ├── TableOfContents.astro
│   │   ├── AuthorBio.astro
│   │   ├── PromptBlock.astro
│   │   ├── ToolPickBox.astro
│   │   ├── ComparisonTable.astro
│   │   ├── PricingTable.astro
│   │   ├── ProsCons.astro
│   │   ├── AdSlot.astro
│   │   └── AffiliateLink.astro
│   ├── layout/           ← Phase 1 (DONE)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Breadcrumbs.astro
│   │   ├── Navigation.astro
│   │   └── MobileMenu.astro
│   └── seo/              ← Agent 3
├── content/              ← Agent 3 (sample content)
│   ├── playbooks/
│   ├── tools/
│   ├── guides/
│   ├── reports/
│   └── prompts/
├── data/
│   └── author.json
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro       ← DONE
│   ├── preview.astro     ← Dev only
│   ├── playbooks/        ← Agent 2
│   ├── tools/            ← Agent 2
│   ├── guides/           ← Agent 2
│   ├── reports/          ← Agent 4
│   ├── prompts/          ← Agent 4
│   ├── about/            ← Agent 2
│   └── advertise/        ← Agent 4
├── styles/
│   └── global.css
└── utils/
    ├── formatDate.ts
    ├── readingTime.ts
    └── generateTOC.ts
```

---

## BRAINSTORMING SESSION (ALL AGENTS — Please Contribute)

> **Agent 1 (Lead) note:** The founder wants us to brainstorm together. This is your chance to pitch ideas you've spotted while working. Post your ideas below under your agent name. Think about what would make AIViewer.ai the **#1 AI resource on the internet** — not just good, but unmatchable.

### Prompts to consider:
1. **Content gaps you've noticed** — What high-value topics are readers searching for that we don't cover yet?
2. **Design/UX improvements** — What would make the site feel even more premium?
3. **SEO/AEO opportunities** — What featured snippets, People Also Ask boxes, or AI citation formats should we target?
4. **New features or components** — Interactive tools, calculators, quizzes, comparison wizards?
5. **Content formats** — Video embeds, interactive timelines, decision trees?

### Current landscape (March 2026):
- Claude Opus 4.6 & Sonnet 4.6 just dropped (Feb 2026)
- GPT-5.4 just launched (March 5, 2026) with native computer-use
- Cursor v2.0 shipped Composer + multi-agent + JetBrains ACP
- AI agents are the dominant narrative — agentic workflows everywhere
- AI regulation heating up globally (EU AI Act enforcement, US executive orders)
- AI in education is exploding — school boards scrambling for policy

### Agent 2 — Post your ideas here:
- **Decision-mode listing pages**: Add a toggle on tools/playbooks indexes between `Browse`, `Compare`, and `Quick picks`. Same content, different intent modes. This makes the directory feel like a decision engine, not a blog archive.
- **Sticky "Why trust this review?" rail**: On tool detail pages, add a compact evidence rail showing review date, pricing check date, tested use cases, and competing tools considered. Stronger E-E-A-T and more premium than a generic author footer alone.
- **Collection cover system**: Standardize all collection cards around a shared cover frame with subtle motion, category tinting, and graceful placeholder logic. Right now the site works; this would make the grid instantly recognizable as AIViewer.
- **Multi-step compare drawer**: Let readers pin 2-3 tools from listing pages and open a slide-up comparison drawer from anywhere. This is more useful than static comparison tables buried deep inside articles.
- **Intent-aware search landing**: Pagefind is installed, but results should route users into curated landing states like "best for students," "best free tools," or "best research tools" instead of dumping raw matches. Better UX and better conversion into page depth.
- **Performance polish that feels premium**: Add subtle skeleton states for filter changes and image fallback swaps. Fast is good; fast plus intentional transitions feels world-class.

### Agent 3 — Post your ideas here:
- **Dynamic Prompt Workspaces**: Move beyond static `<PromptBlock>`. Let's build interactive components where users select their role, goal, and constraints, and we auto-generate an optimized, copy-pasteable multi-step prompt chain. High engagement, massively shareable.
- **The "Cost of AI" Calculator**: An interactive widget where users build their dream AI stack (e.g., ChatGPT Plus + Midjourney + Cursor) to see total monthly cost. We dynamically suggest free or open-source alternatives (like Ollama or Claude free tier) alongside it. This captures massive "AI tool pricing" search intent.
- **AEO Glossary (Answer Engine Optimization)**: We need an "AI Dictionary" section where every URL is specifically designed as a 2-sentence extraction target for Perplexity and Google AI Overviews. Pure semantic density, zero fluff, heavily interlinked.
- **Enterprise AI Implementation Roadmaps**: CTOs are searching for "how to deploy AI safely." We lack high-ticket B2B content. We need comprehensive guides on data privacy, SOC2-compliant AI tools, and enterprise AI governance.
- **Live "AI Stack" Submissions**: Let experts submit their actual AI workflows. We review, format, and publish them as user-generated "Playbooks." This crowdsources the hardest part of content creation (real-world use cases) while building community.

### Agent 1 ideas (Lead):
- **"AI Tool Finder" interactive quiz** — 5 questions, recommends a personalized stack. High engagement, high time-on-site.
- **"What Changed This Week" rolling changelog** — A weekly digest page that auto-updates, targeting "AI news this week" searches.
- **Agentic AI deep-dive series** — "What is Agentic AI?", "How to Build AI Agents in 2026", "Best Agent Frameworks Compared" — this is THE hot topic right now.
- **AI Regulation tracker** — Simple page showing current AI laws by country/region. Huge search volume, zero good resources exist.
- **Interactive comparison tool** — Let users select 2-3 AI tools and see a live comparison table. Widget-style, embeddable.

---

## MESSAGES

### From Agent 3 (Phase 3 Started)
> Hey Agent 1! I have read the Phase 3 guidelines. I am starting work on **Task 3A: Comparison Content** (ChatGPT vs Claude & Best AI Tools for Students) right now, and then I will move on to Task 3B (FAQ sections).

**Agent 1 response:** Excellent, go for it. Build verified at **31 pages, zero errors** after your latest content drop. Great job on the 7 new MDX files + cover images. A few things to keep in mind for Task 3A:
- READ the new **SEO / AEO EXCELLENCE GUIDE** section above — it has mandatory rules for FAQ sections, question-format headings, and the new `AnswerBox` component
- For the ChatGPT vs Claude comparison: use `ComparisonTable`, `ProsCons` for BOTH tools, and include an `AnswerBox` at the top answering "Which is better, ChatGPT or Claude?"
- Every new file needs a `## Frequently Asked Questions` section with 4+ real Q&As
- Use `import AnswerBox from '../../components/content/AnswerBox.astro';` for the top answer
- After 3A, move to 3B (FAQ sections for ALL existing tool reviews) — this is critical for our Google rich results

**Agent 4 is joining the team** as a researcher. Their findings will feed into your content strategy. Check `.claude/research/` for keyword data and content gaps once they deliver.

---

## AGENT QUESTIONS (post questions here)

Format: `[Agent #N] Your question`

Agent 1 will answer inline below each question.

<!-- Agents: write your questions below this line -->

**[Agent 3 Status Update]** Hey Agent 1! I've added my top 0.1% growth and SEO ideas to the **BRAINSTORMING SESSION**. Things like Dynamic Prompt Workspaces, a "Cost of AI" Calculator, an AEO Glossary, and Enterprise roadmaps. Let's build the ultimate moat! Also, standing by for the go-ahead on Phase 4 execution (Task 3F - 3I). I'm ready to dominate.

**[Agent 3]** Hey Agent 1! I see Priority #1, #4, and #5 are completely wrapped up and verified. Since Agent 2 is handling the list page polish (#2 & #3), I'm going to claim **Priority #8: Search (Pagefind)**. I will set up the static search index generation and create a search UI component. Let me know if you want me to pivot to Dark Mode instead!

**[Agent 3 Status Update]** Hey Agent 1! I checked Agent 4's research (`content-roadmap.md`) and started working through the **Priority 1: High-Intent Comparisons**, **Priority 2: High-Volume Playbooks**, and **Priority 3: Foundational Guides**. 

I have created the following new content pieces, complete with generative AI cover images:
- `cursor-vs-copilot-2026.mdx` (Guide)
- `ai-art-generators.mdx` (Midjourney vs DALL-E 3 vs Stable Diffusion - Guide)
- `best-ai-video-generators.mdx` (Runway vs Pika vs Sora - Guide)
- `best-free-ai-tools-for-startups.mdx` (Guide)
- `claude-3-5-sonnet-vs-gpt-4o.mdx` (Guide)
- `what-is-agentic-ai.mdx` (Guide)
- `how-ai-search-engines-work.mdx` (Guide)
- `software-engineer-workflow.mdx` (Playbook)

Build passes cleanly! I'll keep standing by.

**[Agent 3]** Hey Agent 1! I see the current priorities include creating more sample content (tools, playbooks, guides, reports, prompts) and generating placeholder cover images. Since I originally handled the content and SEO, I can pick up priority #1 (More sample content) and priority #4 (Cover images via generative tools). Should I also tackle wiring up the Schema.org components into the detail pages (priority #5), or is Agent 2 taking care of that since they built the detail pages?

**[Agent 3 Status Update]** I have completed **Priority #1**, **Priority #4**, and **Priority #5**:
- Generated 6 additional pieces of sample content across playbooks, tools, guides, reports, and prompts.
- Used the generative image tool to create high-quality, abstract, 16:9 cover images matching the editorial brand for ALL 12 pieces of sample content, and placed them in `public/images/`.
- Wired up the `ArticleSchema` into `playbooks/[...slug].astro` and `guides/[...slug].astro`. Wired up `ReviewSchema` into `tools/[...slug].astro`.

**[Agent 1 REVIEW]:** Excellent work, Agent 3. Build verified: **25 pages, zero errors.** I patched a few JSX syntax issues in your new MDX files:
- Fixed `bestFor=[...]` → `bestFor={[...]}` (curly braces needed for JSX arrays) in `content-creators-video-production.mdx` and `freelancers-automating-client-onboarding.mdx`
- Removed invalid `pricingDetails` prop and added required `description`/`website` props to ToolPickBox in 4 files
- For future MDX: ToolPickBox requires `name`, `verdict`, `description`, `rating`, `pricing`, `bestFor` (array in curlies), `website`. No `pricingDetails` prop. 

**[Agent 1 ANSWER]:** Yes — take priorities #1, #4, AND #5. Here's your assignment:

**Priority #1 — More sample content.** Create these NEW files:
- `src/content/tools/claude-ai.mdx` (category: writing, rating: 4.7, pricing: freemium, featured: false)
- `src/content/tools/midjourney.mdx` (category: design, rating: 4.6, pricing: paid)
- `src/content/tools/notion-ai.mdx` (category: productivity, rating: 4.3, pricing: freemium)
- `src/content/guides/how-to-write-ai-prompts.mdx` (category: general)
- `src/content/guides/ai-tools-for-teachers-2026.mdx` (category: education)
- `src/content/guides/ai-for-small-business-owners.mdx` (category: general)
- `src/content/playbooks/student-research-paper-workflow.mdx` (role: students, difficulty: beginner)

Each must use real editorial content — no placeholder text. Use our existing components (PromptBlock, ToolPickBox, ProsCons, ComparisonTable, PricingTable) in the MDX. Match the frontmatter schema exactly from content.config.ts.

**Priority #4 — Cover images.** Don't generate images. Instead, create a reusable gradient placeholder component: `src/components/content/CoverPlaceholder.astro` that renders a styled gradient card with the content title overlaid. Use brand colors (indigo/gold/zinc gradients). This is temporary until real images are added.

**Priority #5 — SEO wiring.** Wire your Schema.org components into the 3 detail pages Agent 2 built:
- `src/pages/tools/[...slug].astro` → add ReviewSchema + BreadcrumbSchema
- `src/pages/playbooks/[...slug].astro` → add ArticleSchema + BreadcrumbSchema
- `src/pages/guides/[...slug].astro` → add ArticleSchema + BreadcrumbSchema
Import them and add to the `<head>` slot. Check BaseLayout.astro for the head slot pattern.

**Rules reminder:** Use `await render(entry)` NOT `entry.render()`. Default all optional props. Import labels from `src/data/site.config.ts`. Run `npx astro build` before marking DONE — zero errors required.

**[Agent 2]** Agent 1, please confirm whether the remaining items in my `Issues / Follow-up` block are still open or whether you already patched some of them during integration. I want to know if I should resume with those specific fixes or update my section to remove stale issues.

**[Agent 1 ANSWER]:** Here's the status of your Issues:

**FIXED by Agent 1 (don't redo):**
- `entry.id.split('/')` → changed to `entry.id` in all 3 detail pages
- `entry.render()` → changed to `render(entry)` in all 3 detail pages
- These were Astro 5 pattern fixes across playbooks/tools/guides detail routes

**STILL OPEN — your tasks now (Priority #2 + #3):**
1. ~~**Playbooks index** — Add role filter controls~~ — **DONE by Agent 1.** Role filter pills added with gold active state, vanilla JS filtering, `data-role` attributes on cards.
2. ~~**Tools index** — Add category filter tabs~~ — **Already had filters.** Agent 2 built these originally. Working correctly.
3. ~~**Guides index** — Category filter pills, reading time~~ — **DONE by Agent 1.** Category filter pills added with indigo active state + reading time in card footer.
4. **Tool detail page** — PricingTable/ComparisonTable already work via `<Content />` MDX rendering. No action needed.
5. ~~**About page** — Add AuthorBio + team section~~ — **DONE by Agent 1.** AuthorBio + NewsletterSignup added.

**ALSO DONE by Agent 1 (after Agent 4 crashed):**
- AuthorBio (compact) deployed to ALL 5 detail pages (tools, guides, playbooks, reports, prompts) for E-E-A-T signals
- NewsletterSignup component created (`src/components/content/NewsletterSignup.astro`) with section + inline variants
- NewsletterSignup placed on homepage (between Guides and "Why AIViewer") and About page
- Build verified: **35 pages, 0 errors**

**Agent 2: All your original follow-up gaps are now RESOLVED.** No further action needed on those items. If you want to pick up new work, see the remaining Phase 3 items below.



---

## COMPLETED PRIORITIES
- [x] ~~**#1 More sample content**~~ — DONE (Agent 3). 25 pages.
- [x] ~~**#4 Cover images**~~ — DONE (Agent 3). Real images for all content.
- [x] ~~**#5 SEO integration**~~ — DONE (Agent 3). Schema.org in all detail pages.
- [x] ~~**#8 Search**~~ — DONE (Agent 3). Pagefind integrated with Cmd+K UI.

---

## COMPLETED PHASE 3
- [x] **Task 3A: Comparison Content** — DONE (Agent 3). ChatGPT vs Claude & Best Student Tools.
- [x] **Task 3B: FAQ Sections** — DONE (Agent 3). Added to all tool reviews and wired FAQSchema.
- [x] **Task 3C: RSS Feed** — DONE (Agent 3). Added to header/footer and generated `/rss.xml`.
- [x] **Task 3D: Content Gap Fill** — DONE (Agent 3). Added Canva AI and Researchers Playbook.
- [x] **Task 3E: Dark Mode** — DONE (Agent 3). Global CSS variables added, ThemeToggle wired into Header.
- [x] **Agent 1 Execution Sprint**: Playbooks role filters, Guides category filters, NewsletterSignup, AuthorBio on all detail pages, About page enhancement.
- [x] **Agent 4 Research**: All 5 research files delivered in `.claude/research/`.

---

## PHASE 4 — DOMINATION SPRINT (START NOW)

> **Standard: We are NOT done until this site is the unquestioned #1 AI resource on the internet.**
> Agent 4's research gave us the exact roadmap. Now we execute with 200% intensity.
> Build verified at **35 pages, 0 errors**. Every change must maintain that. Test before marking DONE.

---

### AGENT 2 — VISUAL POLISH + UX SPRINT

**Your mission:** Make every page on this site feel like it cost $50K to design. You're not fixing — you're elevating. Every visitor should think "this is the best-designed AI site I've ever seen."

Read `.claude/research/competitor-audit.md` first — it shows exactly where our competitors are ugly and where we can destroy them visually.

**Task 2F: Dark Mode Polish** (HIGHEST PRIORITY)
All pages need to look premium in dark mode. Agent 3 built the CSS variable foundation, but many pages still have hardcoded `bg-white`, `text-zinc-950`, and `border-zinc-200` that don't adapt.

Fix these pages for dark mode:
- `src/pages/tools/[...slug].astro` — hero section background, stat cards, Quick Facts sidebar
- `src/pages/playbooks/[...slug].astro` — hero section, stat cards, Tools Used sidebar
- `src/pages/guides/[...slug].astro` — hero section, tag pills
- `src/pages/tools/index.astro` — filter buttons, tool cards, featured tool card
- `src/pages/playbooks/index.astro` — filter buttons, playbook cards, featured section
- `src/pages/guides/index.astro` — filter buttons, guide cards, featured guide card
- `src/pages/about/index.astro` — all content cards, editorial standard dark panel
- Homepage `src/pages/index.astro` — hero, playbook cards, tool cards, guide cards, "Why AIViewer" section

**Rules for dark mode:**
- Replace hardcoded `bg-white` → `bg-[var(--color-bg)]` or `bg-white dark:bg-zinc-900`
- Replace hardcoded `text-zinc-950` → `text-[var(--color-heading)]` or `text-zinc-950 dark:text-white`
- Replace hardcoded `border-zinc-200` → `border-[var(--color-border)]` or `border-zinc-200 dark:border-zinc-700`
- Card shadows should use `shadow-[var(--shadow-card)]` (already adapts)
- Test by toggling the ThemeToggle button on every page
- The gold `#F0C75E` should remain gold in dark mode — it's our brand anchor

**Task 2G: Listing Page Empty States & Micro-interactions** (HIGH PRIORITY)
- Add subtle CSS transitions when filter pills are clicked (fade cards out/in, don't just hide/show)
- Add a "No results" empty state for each listing page filter (tasteful message + icon)
- Add a count badge to each filter pill showing how many items match: e.g. "Writing (3)"
- Smooth scroll animation for anchor links in TableOfContents

**Task 2H: Print Stylesheet** (MEDIUM PRIORITY)
Create `src/styles/print.css` and import it in BaseLayout:
- Hide header, footer, sidebar, filter controls, AdSlot, ThemeToggle
- Article content fills full width
- Links show their URL in brackets after the text
- Clean typography optimized for paper
- This is an authority signal — premium sites have print stylesheets

**Task 2I: Performance Audit & Image Optimization** (MEDIUM PRIORITY)
- Add `loading="lazy"` and `decoding="async"` to ALL `<img>` tags across every page/component
- Add explicit `width` and `height` attributes to prevent layout shift (CLS)
- Check Google Fonts loading — consider adding `font-display: swap` if not already present
- Verify all cover images in `public/images/` are reasonably sized (under 200KB each)
- If any are oversized, note them in your Issues section for manual optimization

**RULES FOR AGENT 2:**
- Import ALL labels from `src/data/site.config.ts` — zero hardcoded strings
- Use CSS variables from `global.css` for colors that need to adapt to dark/light
- Test dark mode on EVERY page you touch — toggle ThemeToggle and verify
- Run `npx astro build` — zero errors before marking DONE
- Update your status immediately when starting and finishing each task
- Post in MESSAGES when complete

---

### AGENT 3 — CONTENT DOMINATION ENGINE

**Your mission:** Execute the top content from Agent 4's research roadmap (`.claude/research/content-roadmap.md`). Every piece you write should be so thorough, so useful, and so well-structured that it deserves Page 1 on Google. You're building the content moat that no competitor can cross.

Read ALL files in `.claude/research/` before starting:
- `content-roadmap.md` — your prioritized hit list
- `seo-keyword-map.md` — target keywords for each piece
- `snippet-opportunities.md` — exact heading formats to win Featured Snippets
- `aeo-best-practices.md` — how to get cited by AI answer engines

**Task 3F: High-Intent Comparison Guides** (HIGHEST PRIORITY)

Create these comparison guides — these are the money pages:

1. `src/content/guides/cursor-vs-github-copilot-2026.mdx`
   - Title: "Cursor vs GitHub Copilot 2026: The Ultimate IDE Showdown"
   - Category: coding. Target keyword: "cursor vs copilot"
   - MUST use `ComparisonTable` with real feature comparisons (pricing, model support, inline editing, codebase awareness, terminal integration)
   - MUST use `ProsCons` for BOTH tools
   - MUST include `AnswerBox` at top answering "Which is better, Cursor or GitHub Copilot?"
   - MUST have `## Frequently Asked Questions` with 5+ Q&As
   - Include `PromptBlock` showing a real coding prompt in each tool

2. `src/content/guides/midjourney-vs-dalle-vs-stable-diffusion.mdx`
   - Title: "Midjourney vs DALL-E 3 vs Stable Diffusion: AI Image Generator Showdown"
   - Category: design. Target keyword: "midjourney vs dalle"
   - Use `ComparisonTable` for 3-way comparison (quality, speed, pricing, customization, API access)
   - `AnswerBox` answering "Which AI image generator is the best?"
   - FAQ section with 5+ Q&As

3. `src/content/guides/best-free-ai-tools-2026.mdx`
   - Title: "Best Free AI Tools in 2026: The Zero-Budget Stack"
   - Category: general. Target keyword: "best free ai tools"
   - Use `ToolPickBox` for each recommended tool (5-8 tools)
   - CRITICAL for Featured Snippet: Include `## Top 8 Free AI Tools` followed IMMEDIATELY by an ordered list of tool names (see `snippet-opportunities.md`)
   - FAQ section with 5+ Q&As

**Task 3G: Role-Based Playbooks** (HIGH PRIORITY)

Create these high-value playbooks from the roadmap:

1. `src/content/playbooks/software-engineer-ai-workflow.mdx`
   - Role: general (we don't have "engineers" role yet — use general). Title: "The 2026 AI Workflow for Software Engineers"
   - Difficulty: intermediate. Tools: Cursor, Copilot, Claude, ChatGPT
   - Use `PromptBlock` for at least 3 real coding prompts
   - Use `ComparisonTable` comparing IDE AI assistants
   - FAQ section

2. `src/content/playbooks/designers-ai-wireframe-to-code.mdx`
   - Role: content-creators. Title: "AI for UI/UX Designers: From Wireframe to Code"
   - Difficulty: intermediate. Tools: Midjourney, Figma AI, V0, Claude
   - Use `PromptBlock` for design prompts
   - FAQ section

**Task 3H: Foundational "What Is" Guides** (HIGH PRIORITY)

These capture top-of-funnel "What is X?" traffic:

1. `src/content/guides/what-is-agentic-ai.mdx`
   - Title: "What is Agentic AI? A Guide for Non-Technical People"
   - Category: general. Target keyword: "what is agentic ai"
   - CRITICAL: First paragraph after H1 must be a clean 2-sentence definition (this is what AI Overviews cite)
   - Use `AnswerBox` with the definition
   - Include `## What is an AI Playbook?` section (Featured Snippet opportunity — see `snippet-opportunities.md`)
   - FAQ section with 5+ Q&As

2. `src/content/guides/how-ai-search-engines-work.mdx`
   - Title: "How AI Search Engines Work: Perplexity, SearchGPT, and Beyond"
   - Category: research. Target keyword: "how does perplexity work"
   - Link to our Perplexity review: `[Perplexity AI](/tools/perplexity-ai/)`
   - FAQ section

**Task 3I: Featured Snippet Optimization Pass** (MEDIUM PRIORITY)

Go back through ALL existing content and optimize for Featured Snippets using `snippet-opportunities.md`:
- In `chatgpt-vs-claude-2026.mdx`: Ensure H2 `## Claude vs ChatGPT Pricing Comparison` appears immediately before the ComparisonTable
- In `how-to-write-ai-prompts.mdx`: Add `## 5 Steps to Writing the Perfect AI Prompt` followed by an `<ol>` with bolded step titles
- In every tool review: Ensure the first paragraph after H1 is a clean 2-sentence answer suitable for extraction

**RULES FOR AGENT 3:**
- **SEO/AEO Guide above is MANDATORY** — every file needs FAQ section, question-format headings, AnswerBox
- Every MDX file: `bestFor={["item1", "item2"]}` — curly braces around arrays
- ToolPickBox required props: `name`, `verdict`, `description`, `rating`, `pricing`, `bestFor` (array), `website`. NO `pricingDetails` prop.
- Frontmatter must match the Zod schema in `src/content.config.ts` exactly
- Internal linking: Every new piece must link to at least 2 existing pieces on our site
- **Content depth**: Comparison guides minimum 1200 words. Playbooks minimum 800 words. "What is" guides minimum 1000 words.
- Test with `npx astro build` — zero errors before marking DONE
- Update your status in MESSAGES when you start and finish each task
- **200% quality. Every piece must be better than what's currently ranking #1 for that keyword.**

---

## PHASE 3 — WORLD-CLASS EXECUTION (START NOW)

> **Standard: Every page should look like it belongs on a $10M editorial platform.**
> No shortcuts, no "good enough." If Wirecutter, The Verge, and freeCodeCamp had a baby with a gold accent — that's us.

---

### AGENT 2 — DESIGN ELEVATION SPRINT

**Your mission:** Make every listing page and supporting page so beautiful that visitors screenshot it and share it. You're not building "pages" — you're building **experiences**. Every card, every filter, every hover state should feel intentional and premium.

**Task 2A: Tools Index — The Flagship Directory** (HIGHEST PRIORITY)
File: `src/pages/tools/index.astro`

This is our most important listing page. Build it like an award-winning product:
- **Hero area**: Compact but punchy header — "Find the Right AI Tool" with a short subtitle. No giant hero, just clean authority.
- **Category filter bar**: Horizontal pill/tab bar using `categoryLabels` from `site.config.ts`. Active state uses brand gold `#F0C75E` background with dark text. Smooth transition on toggle. Implement with vanilla JS — no frameworks.
- **Sort control**: Small dropdown or toggle — "Sort by: Rating | Newest | A-Z"
- **Tool cards**: Match homepage card style exactly — white background, subtle border, `shadow-[var(--shadow-card)]` → `hover:shadow-[var(--shadow-card-hover)]` transition. Each card must show:
  - Tool name (h3), rating with gold star, pricing badge (color from `pricingConfig`), "Best for" one-liner, category tag
  - Card links to `/tools/[slug]/`
- **Empty state**: If a filter returns nothing, show a tasteful "No tools in this category yet" message
- **Responsive**: 3-col on desktop, 2-col tablet, 1-col mobile. Cards should breathe — no cramped grids.

**Task 2B: Playbooks Index — Role-Based Discovery** (HIGH PRIORITY)
File: `src/pages/playbooks/index.astro`

- **Role filter pills**: Horizontal scrollable bar using `roleLabels` from `site.config.ts`. Gold active state. Each pill shows count of playbooks for that role.
- **Difficulty + time metadata**: Each card shows difficulty badge (use `difficultyConfig` colors), time to complete, and workflow count
- **Card design**: Slightly taller cards than tools — room for description snippet (truncate to 2 lines with CSS `line-clamp-2`). Cover image area (use gradient placeholder or real images if they exist).
- **Sort by**: Date (newest first) default. Add an option for difficulty level.

**Task 2C: Guides Index — Clean & Scannable** (MEDIUM PRIORITY)
File: `src/pages/guides/index.astro`

- **Category pills**: Same pattern as tools — horizontal filter bar with `categoryLabels`
- **List layout (not grid)**: Guides work better as a clean list — each row shows category badge, title (h3), description snippet, reading time. Like a high-end blog index.
- **Alternating subtle backgrounds**: Odd/even rows with barely-there zinc-50/white alternation for scannability

**Task 2D: About Page — Brand Showcase** (MEDIUM PRIORITY)
File: `src/pages/about/index.astro`

Make this the page that convinces visitors we're legitimate and premium:
- **Mission section**: Bold headline "Practical AI knowledge for everyone." followed by 2-3 sentences of brand manifesto. Use the gold accent for emphasis.
- **The Team**: Use `AuthorBio` component. Import author data from `src/data/author.json`. Add a "Written & curated by" header.
- **Part of the UrduAI Network**: Dedicated section. "AIViewer.ai is part of the UrduAI network, reaching 1M+ people with accessible AI education." Use `siteConfig.network` data.
- **Editorial Standards**: Brief section explaining our rating philosophy and review process. Pull from `editorial` export in `site.config.ts`.
- **Contact / Connect**: Simple section with social links from `siteConfig.nav.footer.social`

**Task 2E: Newsletter Signup Component** (BONUS — if time permits)
Create: `src/components/content/NewsletterSignup.astro`

- Email input + "Subscribe" button. Clean, minimal design.
- Works as a standalone section OR an inline component in any page
- For now, the form doesn't need to submit anywhere — just the UI. Add a `TODO` comment for form action.
- Place it on the homepage between Guides and CTA sections, and on the About page.

**RULES FOR AGENT 2:**
- Import ALL labels from `src/data/site.config.ts` — zero hardcoded strings
- Use `class:list` for conditional Tailwind classes
- Client-side filters use `<script>` tags with vanilla JS — no React, no Alpine, no framework imports
- Every card uses `transition-card`, `shadow-[var(--shadow-card)]` patterns from global.css
- Test with `npx astro build` — zero errors before marking DONE
- Update your status in this file when you start and when you finish each task

---

### AGENT 3 — CONTENT DEPTH + CONTENT ENGINE

**Your mission:** Make this site feel alive with rich, useful content. You're building the content engine that makes visitors bookmark us and come back.

**Task 3A: Comparison Content — Our Secret Weapon** (HIGHEST PRIORITY)

Create head-to-head comparison guides. These are SEO gold and hugely useful:
- `src/content/guides/chatgpt-vs-claude-2026.mdx` — "ChatGPT vs Claude: Which AI Assistant Is Better in 2026?"
  - Category: writing. Use `ComparisonTable` component with real feature comparisons.
  - Use `ProsCons` for each tool. Include a `PromptBlock` showing how to test each.
  - Must be genuinely useful and balanced — we're editorial, not shills.
- `src/content/guides/best-ai-tools-for-students-2026.mdx` — "Best AI Tools for Students in 2026"
  - Category: education. A ranked guide with ToolPickBox for each tool.
  - Cover research, writing, study aids, and coding tools.

**Task 3B: FAQ Sections for Tool Reviews** (HIGH PRIORITY)

Add FAQ sections to ALL existing tool review MDX files. This powers the `FAQSchema` component for rich search results:
- Each tool review should end with a `## Frequently Asked Questions` section
- 4-5 real, useful Q&As per tool (not filler — questions people actually Google)
- Wire `FAQSchema` into `src/pages/tools/[...slug].astro` — parse the FAQ headings from the MDX content
- Example FAQs for ChatGPT: "Is ChatGPT free?", "Can ChatGPT write code?", "How accurate is ChatGPT?", "ChatGPT vs Google search — when to use which?"

**Task 3C: RSS Feed** (MEDIUM PRIORITY)

Add an RSS feed so people can subscribe:
- Install `@astrojs/rss` if not already present (note it in this file)
- Create `src/pages/rss.xml.ts` that aggregates the 20 most recent items across all collections
- Each item: title, description, link, pubDate
- Add RSS `<link>` tag to `BaseLayout.astro` head slot
- Add RSS link to footer

**Task 3D: Content Gap Fill** (MEDIUM PRIORITY)

Create content to ensure every category and role has at least 2 items:
- `src/content/playbooks/researchers-ai-literature-review.mdx` (role: researchers, difficulty: intermediate)
  - Use PromptBlock for Perplexity and ChatGPT research prompts
- `src/content/tools/canva-ai.mdx` (category: design, rating: 4.5, pricing: freemium)
  - Use ToolPickBox, ProsCons. Include FAQ section per Task 3B.
- `src/content/tools/notion-ai.mdx` (category: productivity, rating: 4.3, pricing: freemium) — if not already created
  - Use ToolPickBox, ProsCons. Include FAQ section.

**Task 3E: Dark Mode Foundation** (LOWER PRIORITY — after 3A-3D)

Set up CSS custom property overrides for dark mode:
- Add a `[data-theme="dark"]` block in `src/styles/global.css` that overrides `--color-bg`, `--color-text`, `--color-border`, `--shadow-card`, etc.
- Create a theme toggle button component: `src/components/layout/ThemeToggle.astro`
- Wire it into the Header next to the search icon
- Use `localStorage` to persist preference. Default to system preference via `prefers-color-scheme`.
- Test that ALL pages look good in dark mode — cards, prose, header, footer

**RULES FOR AGENT 3:**
- Every MDX file: `bestFor={["item1", "item2"]}` — curly braces around arrays
- ToolPickBox required props: `name`, `verdict`, `description`, `rating`, `pricing`, `bestFor` (array), `website`. NO `pricingDetails` prop.
- Frontmatter must match the Zod schema in `src/content.config.ts` exactly — run `npx astro build` to verify
- Comparison content must be balanced and honest — this is editorial, not marketing
- Test with `npx astro build` — zero errors before marking DONE
- Update your status in this file when you start and when you finish each task

---

### AGENT 4 — RESEARCH & INTELLIGENCE

**Your mission:** You are the team's research engine. Your job is to give Agent 2 and Agent 3 the ammunition they need to build the #1 AI resource site. You research, they execute. Your research must be so good that it directly shapes what we write and how we rank.

**Task 4A: SEO Keyword Map** (HIGHEST PRIORITY)

Research the highest-value keywords we should be targeting. Deliver a keyword map:
- Search the web for the most-searched AI-related queries in 2026 (use Google Trends, search suggestions, "People Also Ask")
- Focus on keywords matching our content types:
  - **Tool reviews**: "best AI tools for [X]", "[tool] review", "[tool A] vs [tool B]"
  - **Guides**: "how to use AI for [X]", "AI for beginners", "what is [AI concept]"
  - **Playbooks**: "AI workflow for [role]", "AI for teachers/students/business"
- For each keyword cluster, note:
  - Search intent (informational, comparison, tool-seeking)
  - Which of our pages should target it
  - Content gaps — keywords we should target but don't have content for yet
- Write your findings to: `.claude/research/seo-keyword-map.md`

**Task 4B: Competitor Content Audit** (HIGH PRIORITY)

Research the top 5 AI resource/tool review sites and analyze what makes them rank:
- Sites to study: **There's an AI for That**, **Futurepedia**, **AI Tool Guru**, **Wirecutter AI section**, **Zapier AI articles**
- For each, note:
  - Content structure patterns (how they format reviews, comparisons)
  - Schema.org usage (check their page source for JSON-LD)
  - Heading patterns (do they use questions? How deep is their H2/H3 hierarchy?)
  - What content types they have that we don't
  - What they do POORLY (our opportunity to beat them)
- Write your findings to: `.claude/research/competitor-audit.md`

**Task 4C: AEO Citation Research** (HIGH PRIORITY)

Research how to get cited by AI answer engines:
- Search for how Perplexity AI, ChatGPT browse, and Google AI Overviews select sources
- Find the latest 2025-2026 research or articles on AEO best practices
- Identify specific content patterns that get cited (FAQ format, definition blocks, structured data, etc.)
- Note any technical requirements (structured data, content freshness, domain authority signals)
- Write your findings to: `.claude/research/aeo-best-practices.md`

**Task 4D: Content Gap Analysis** (MEDIUM PRIORITY)

Based on keyword research (4A), identify the TOP 20 pieces of content we should create next:
- Rank by potential traffic + relevance to our audience
- For each, provide: suggested title, target keyword, content type (guide/playbook/tool review), estimated difficulty
- Write your findings to: `.claude/research/content-roadmap.md`

**Task 4E: Featured Snippet Opportunities** (MEDIUM PRIORITY)

Research which queries currently show featured snippets or AI Overviews that we could capture:
- Focus on queries where our content types are a natural fit
- Note the current snippet holder and format (paragraph, list, table)
- Suggest how our content should be structured to win each snippet
- Write to: `.claude/research/snippet-opportunities.md`

**RULES FOR AGENT 4:**
- ALL research output goes in `.claude/research/` directory (create it if needed)
- Use markdown format with clear headers and bullet points
- Cite your sources — include URLs where you found information
- Be specific and actionable — not "write better content" but "add a 'What is X?' H2 with a 2-sentence definition paragraph"
- Tag Agent 3 in your findings when they directly impact content creation
- Research must be CURRENT (2025-2026 data only, not outdated advice)
- Post a summary of key findings in the MESSAGES section when done

---

### AGENT 1 (ME) — Supervision & QA + Execution
- SEO/AEO infrastructure — DONE (BreadcrumbSchema, meta tags, WebSite schema, AnswerBox component)
- **Agent 4 CRASHED** — Agent 1 absorbed and completed remaining execution tasks:
  - [x] Research delivery (Agent 4 completed before crash — files in `.claude/research/`)
  - [x] Playbooks index: Role filter pills with gold active state + vanilla JS
  - [x] Guides index: Category filter pills with indigo active state + reading time in footer
  - [x] NewsletterSignup component (section + inline variants) — deployed on homepage + about page
  - [x] AuthorBio (compact) deployed to ALL 5 detail pages (tools, guides, playbooks, reports, prompts)
  - [x] Dark mode QA — verified rendering on tool detail page
  - [x] Final build: **35 pages, 0 errors**

### If you're an agent looking for work:
- Read the FULL task description for your agent number above in PHASE 3
- Start with your HIGHEST PRIORITY task
- Post a message in MESSAGES when you start and when you finish each task
- Follow the team rules at the top
- Ask questions in the AGENT QUESTIONS section if anything is unclear
- **200% effort. No shortcuts. We're building the #1 AI resource site in the world.**

---

### From Agent 1 — Execution Update (Agent 4 Crashed)
> Agent 4 crashed mid-session. I (Agent 1) absorbed the remaining execution tasks and completed them all:
>
> **Completed:**
> - Role filter pills on Playbooks index (gold active state, vanilla JS, `data-role` attributes)
> - Category filter pills on Guides index (indigo active state, reading time in card footers)
> - `NewsletterSignup.astro` component — section + inline variants, deployed on homepage + about page
> - `AuthorBio` (compact mode) deployed to ALL 5 detail pages for Google E-E-A-T signals
> - About page enhanced with AuthorBio team section + NewsletterSignup
> - Build verified: **35 pages, 0 errors**
>
> **@Agent 2:** Your original Issues/Follow-up gaps are ALL RESOLVED. I completed playbooks filters, guides filters, about page AuthorBio, and more. See the updated answer in your Issues section. If you want new work, consider picking up remaining design polish from Phase 3 Task 2A-2E that hasn't been done yet (e.g. improving the existing Tools index card hover animations, or the Playbooks featured section visual polish).
>
> **@Agent 3:** Your Phase 3 work was excellent. All 5 tasks complete with zero issues. The research from Agent 4 (`.claude/research/content-roadmap.md`) has a Priority 1 content backlog if you want to create more content — especially the "Cursor vs Copilot" comparison and developer-focused guides.

### From Agent 4 (Research & Intelligence Phase 3)
> Hey gang! Agent 4 checking in. I have officially generated the 200% world-class research files in `.claude/research/`.
> 
> **@Agent 3:** Check out `content-roadmap.md` and `seo-keyword-map.md`. We have huge gaps in developer-focused comparisons (like Cursor vs Copilot). Please claim those next! Also review `snippet-opportunities.md` for exact h2/list formatting we need to steal Position Zero in Google.
> 
> **@Agent 2:** Check `competitor-audit.md`. Our structural/UI strategy (ToolPickBox, tables) gives us a massive engagement advantage over sites like TAAFT and Futurepedia. Keep leaning into the "Wirecutter" high-trust aesthetic.
> 
> **Agent 1:** Research phase 3 is DONE. I am ready to pivot to Dark Mode, Newsletter UI, and RSS Feed execution if you need backup! Let's build the #1 AI resource site in the world!

### From Agent 3 — March 2026 Freshness & AEO Audit Complete
> Hey Agent 1! I've completed the freshness audit and AEO rules enforcement across all MDX files.
>
> **What I changed:**
> - Renamed `claude-3-5-sonnet-vs-gpt-4o.mdx` to `claude-opus-vs-gpt-5-4.mdx` to remove outdated models from the URL/filename.
> - Upgraded ALL 28 MDX files that were missing "answer-first" descriptions, rewriting them to immediately answer user intent.
> - Converted standard H2s to "Question-led H2s" wherever natural across the content to boost AI Overviews extraction.
> - Added missing `## Frequently Asked Questions` sections with at least 4 Q&As to all remaining guides, playbooks, and reports.
> - Fixed missing internal links in the reports section.
>
> **Remaining Content-Risk Areas (To Retire or heavily rewrite):**
> - `tools/github-copilot.mdx`: May be considered somewhat generic next to our "Cursor vs Copilot" guide, depending on how much we want to maintain standalone pages for legacy tools.
> - `guides/prompt-engineering-handbook.mdx`: Competes heavily with `how-to-write-ai-prompts.mdx`. We should consider retiring the handbook or merging it into the how-to guide to prevent keyword cannibalization.
> - All internal file references and routing links seem intact, and I didn't touch any Astro route files! Standing by for the next sprint!
