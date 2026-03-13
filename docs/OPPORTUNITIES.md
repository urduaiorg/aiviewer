# AI Opportunities — Developer Guide

Everything a developer needs to know about the Opportunities section on AIViewer.ai.

---

## Overview

The Opportunities board is a curated directory of free AI courses, grants, fellowships, scholarships, certifications, and competitions. Every entry is manually verified — we click the link, confirm it works, and write an honest description.

**Live at:** `/opportunities/` (listing) and `/opportunities/[slug]/` (detail pages)

---

## Content Collection

**Schema location:** `src/content.config.ts`
**Content directory:** `src/content/opportunities/`

### Frontmatter Schema

```yaml
---
title: "Provider — Short Descriptive Title"        # Required
description: "Max 160 characters. What it is."      # Required, max 160 chars
category: "course"                                   # Required, see options below
provider: "Google"                                   # Required
url: "https://direct-link-to-opportunity.com"        # Required, must be valid URL
cost: "free"                                         # Required: free | partially-free | paid
deadline: 2026-04-03                                 # Optional, omit if ongoing
verified: true                                       # Required, always true
verifiedDate: 2026-03-12                             # Required, date you verified the link
publishedDate: 2026-03-12                            # Required
updatedDate: 2026-03-15                              # Optional
tags: ["tag1", "tag2"]                               # Required, array of strings
featured: false                                      # Optional, only 1 should be true at a time
draft: false                                         # Set true to hide from listing
---
```

### Category Options

| Value           | Label         | Schema.org Type      |
|-----------------|---------------|----------------------|
| `course`        | Course        | `Course`             |
| `certification` | Certification | `Course`             |
| `grant`         | Grant         | `MonetaryGrant`      |
| `scholarship`   | Scholarship   | `MonetaryGrant`      |
| `fellowship`    | Fellowship    | `MonetaryGrant`      |
| `competition`   | Competition   | `Event`              |
| `toolkit`       | Toolkit       | `SoftwareApplication`|

### Cost Options

| Value            | Label          | Color                          |
|------------------|----------------|--------------------------------|
| `free`           | Free           | Green (emerald-50/emerald-600) |
| `partially-free` | Partially Free | Amber (amber-50/amber-600)     |
| `paid`           | Paid           | Zinc (zinc-100/zinc-600)       |

Labels and colors are defined in `src/data/site.config.ts` under `costConfig` and `opportunityCategoryLabels`.

---

## How to Add a New Opportunity

### 1. Create the file

Create a new `.md` file in `src/content/opportunities/` using kebab-case:

```
src/content/opportunities/nvidia-graduate-fellowship.md
```

### 2. Write the frontmatter

Follow the schema above. Key rules:
- **description** must be 160 characters or fewer (Astro will throw `InvalidContentEntryDataError` if exceeded)
- **url** must be a real, working link you've verified
- **verifiedDate** should be the date you actually clicked the link and confirmed it works
- **tags** should include the provider name, category, and relevant keywords

### 3. Write the body

Use this standard structure:

```markdown
## What You'll Learn / What It Covers / What It Funds

Brief overview of what the opportunity offers. Use bullet lists for clarity.

## Who It's For / Who Can Apply

Target audience, eligibility requirements, prerequisites.

## Details

- **Cost:** Free / $X
- **Duration:** X hours / X months
- **Certificate:** Yes/No
- **Deadline:** Ongoing / Date
- **Prerequisites:** None / List them
```

### 4. Verify

Run the dev server (`npm run dev` on port 4321) and check:
- `/opportunities/` — your entry appears in the grid
- `/opportunities/your-slug/` — detail page renders correctly
- No console errors

---

## Page Architecture

### Listing Page — `src/pages/opportunities/index.astro`

- Hero section with keyword-rich H1 and stats box
- Featured opportunity card (pulls first entry with `featured: true`)
- Category filter buttons (client-side JS, `data-filter` attributes)
- Card grid with EditorialCover illustrations
- SEO content section: "How to learn AI for free" intro + FAQ
- Newsletter signup

### Detail Page — `src/pages/opportunities/[...slug].astro`

- Hero with breadcrumbs, category/cost badges, provider, deadline status
- "Visit this opportunity" CTA button (disabled if expired)
- Full markdown body with prose styling
- Post-content "Ready to get started?" CTA (hidden if expired)
- Team byline (`AuthorBio variant="team"`)
- Related opportunities (same category, max 3)
- Newsletter signup

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `EditorialCover` | `src/components/content/EditorialCover.astro` | SVG card illustrations, `variant="opportunity"` |
| `AuthorBio` | `src/components/content/AuthorBio.astro` | `variant="team"` for opportunities, `variant="author"` for editorial |
| `OpportunityListSchema` | `src/components/seo/OpportunityListSchema.astro` | Listing page structured data (ItemList + FAQPage + CollectionPage) |
| `OpportunitySchema` | `src/components/seo/OpportunitySchema.astro` | Detail page structured data (category-specific) |

---

## SEO / Structured Data

### Listing Page (`/opportunities/`)

Three Schema.org JSON-LD blocks:

1. **ItemList** — Rich carousel/list of all opportunities
2. **FAQPage** — 5 "People Also Ask" questions targeting high-value queries
3. **CollectionPage** — Enhanced with keyword metadata and `about` topics

### Detail Pages (`/opportunities/[slug]/`)

Category-specific schemas:

- **Course/Certification** → `Course` with `Offer` (price: 0 for free)
- **Grant/Scholarship/Fellowship** → `MonetaryGrant` with `applicationDeadline`
- **Competition** → `Event` with `OnlineEventAttendanceMode`
- **Toolkit** → `SoftwareApplication`

Plus `WebPage` and `BreadcrumbList` on every detail page.

### Target Keywords

Primary: `free AI courses`, `AI grants`, `AI fellowships`, `AI scholarships`, `free AI certification`, `learn AI for free`

Long-tail: `free AI courses with certificates`, `AI grants for nonprofits`, `AI funding opportunities`, `AI courses with certificates 2026`

---

## Automation: AI Opportunity Scout

A scheduled task runs **every Monday at 9 AM** to find new opportunities.

**Task ID:** `ai-opportunity-scout`
**Location:** `~/.claude/scheduled-tasks/ai-opportunity-scout/SKILL.md`

### What it does

1. Reads existing entries to avoid duplicates
2. Searches the web for new free AI courses, grants, certifications, fellowships
3. Verifies each link actually loads
4. Creates draft entries (`draft: true`) in `src/content/opportunities/`
5. Outputs a summary of what was found

### Publishing drafts

Draft entries won't appear on the site. To publish:
1. Review the generated `.md` file
2. Confirm the link works and content is accurate
3. Change `draft: true` to `draft: false`
4. Rebuild/deploy

### Managing the schedule

The task can be managed from Claude Code's "Scheduled" sidebar section or via CLI.

---

## Editorial Rules

1. **Never fabricate URLs** — every link must be verified by clicking it
2. **Never fabricate companies or statistics** — only use real, verifiable data
3. **Description max 160 chars** — enforced by Astro schema validation
4. **Honest descriptions** — describe what the user actually gets, no hype
5. **Update verifiedDate** — whenever you re-check a link, update this field
6. **One featured at a time** — only set `featured: true` on the most relevant/time-sensitive entry

See `docs/EDITORIAL-POLICY.md` for the full editorial integrity policy.

---

## Current Entries (as of March 2026)

| Entry | Category | Provider | Cost | Deadline |
|-------|----------|----------|------|----------|
| Google AI Essentials | Course | Google | Free | Ongoing |
| Microsoft AI Skills Initiative | Course | Microsoft | Free | Ongoing |
| Anthropic Academy | Course | Anthropic | Free | Ongoing |
| Oxford & UNESCO — AI in Government | Course | Oxford / UNESCO | Free | Ongoing |
| Google Gemini Certified Educator & Student | Certification | Google for Education | Free | Ongoing |
| Internet Society Community Grants | Grant | ISOC | Free | Ongoing |
| Google.org AI for Government Innovation | Grant | Google.org | Free | Apr 3, 2026 |

---

## Navigation

- **Header nav:** "Opportunities" between "Prompts" and "Compare" (configured in `src/data/site.config.ts`)
- **Footer:** "AI Opportunities" under "Resources" column
- **Category filters:** Auto-generated from entries, client-side JS filtering
