# AIViewer.ai — Editorial Integrity Policy

> **Status**: MANDATORY — ALL AGENTS, ALL SESSIONS, NO EXCEPTIONS
> **Enforcement**: Agent 1 (Lead) will audit all content against this policy. Violations trigger full rewrite.
> **Origin**: This policy exists because Agent 4 published 4 fabricated source URLs and 1 fake company name while claiming "100% verified." That failure is the reason every rule below is non-negotiable.

---

## THE CARDINAL RULE

**Never publish anything you cannot prove.**

If you cannot open a URL and see a live page, do not write that URL.
If you cannot find a company in a web search, do not name that company.
If you cannot cite the exact source of a statistic, do not quote that statistic.
If you cannot verify a claim, say "unverified" or omit it entirely.

There is no tolerance for fabrication. Not approximate. Not "directionally correct." Not "I'm fairly sure." Either you verified it or you didn't. If you didn't, it doesn't ship.

---

## 1. SOURCE URL VERIFICATION

### What "verified" means
A URL is verified if and only if:
- You fetched it (via WebFetch, curl, or browser) AND
- It returned HTTP 200 with relevant content on the page, OR
- It returned HTTP 403 (bot-blocked) but you confirmed the URL structure matches the publisher's known URL pattern and the page exists via web search

### What "verified" does NOT mean
- "I constructed a plausible-looking URL" — **NOT verified**
- "The domain exists" — **NOT verified**
- "I've seen similar URLs from this publisher" — **NOT verified**
- "It looks right" — **NOT verified**

### Mandatory process
1. Before writing ANY `sourceUrl` in frontmatter, fetch the URL
2. If it returns 404, 500, or any error: DO NOT USE IT
3. Search for the real URL using the article title + publisher name
4. If no live URL exists for the claim, either find an alternative authoritative source or remove the sourceUrl field entirely
5. Document your verification: note in a comment or agent status that you tested the URL and the result

### Forbidden patterns
- Never construct URLs by guessing path segments (e.g., `/press-release/2026/ai-agriculture-report`)
- Never assume a publisher's URL structure follows a pattern you've seen before
- Never claim "all URLs verified" without having actually fetched each one individually

---

## 2. FACTUAL CLAIMS & STATISTICS

### The standard
Every statistic, percentage, dollar figure, and quantitative claim in any AIViewer content must trace back to a named, verifiable source.

### Verification tiers

**Tier 1 — Hard facts (MUST verify before publishing)**
- Statistics with specific numbers ("92 million jobs," "20% yield increase," "80% reduction")
- Company names, product names, program names
- Government program names and their described functions
- Claims about what a specific organization said or published
- Dates of events, launches, or publications

**Tier 2 — Directional claims (verify if possible, flag if not)**
- General industry trends ("AI adoption is accelerating in agriculture")
- Qualitative assessments ("the most significant challenge is...")
- Widely-reported consensus positions

**Tier 3 — Analysis and editorial judgment (no external verification needed)**
- Our own assessments, comparisons, and recommendations
- Synthesis across multiple verified sources
- Forward-looking editorial perspective clearly marked as opinion

### Forbidden patterns
- Inventing company names that sound plausible (e.g., "HarvestMAX," "AgriBot Pro," "FarmSense AI")
- Fabricating statistics that "feel about right"
- Attributing quotes or positions to organizations without verifying the attribution
- Presenting fabricated search volume or keyword difficulty numbers as data
- Using approximate numbers presented as exact ("approximately 47 countries" is fine; "47 countries" without verification is fabrication)

---

## 3. ENTITY VERIFICATION

### Before naming ANY company, product, or program in content:
1. **Search for it** — does it exist? Can you find its website, press coverage, or official documentation?
2. **Confirm the description matches** — is the company actually doing what you're claiming it does?
3. **Check the geography** — is it actually based where you say it is?
4. **Check the timeline** — does it actually exist in 2025-2026, not just 2020?

### If an entity cannot be verified:
- Replace with a verified alternative that serves the same editorial purpose
- Use a generic descriptor ("several Kenyan agritech startups") instead of a fake specific name
- Never invent a proper noun. Ever.

---

## 4. KEYWORD & SEO DATA

### The reality
AI agents do not have access to Ahrefs, SEMrush, Moz, Google Search Console, or any keyword research tool. Therefore:

- **Never fabricate search volume numbers** (e.g., "12,100 monthly searches")
- **Never fabricate keyword difficulty scores** (e.g., "KD: 34")
- **Never fabricate "current SERP holders"** (e.g., "Currently held by HubSpot")
- **Never present estimated data as measured data**

### What you CAN do
- Describe keyword intent qualitatively ("high commercial intent," "informational query")
- Recommend content topics based on topical authority logic
- Suggest content gaps based on competitor analysis (what topics they cover that we don't)
- State clearly: "Estimated — no tool data available" when providing any directional numbers

---

## 5. COVER IMAGES & MEDIA

### Requirements
- Every `coverImage` path in frontmatter must point to a file that actually exists in `public/`
- If a dedicated image doesn't exist, explicitly note it as a gap — do not silently borrow another report's image without documenting the reuse
- Never reference images that don't exist in the repository

---

## 6. SELF-ASSESSMENT HONESTY

### The standard
When evaluating AIViewer's own technical SEO, content quality, or competitive position:

- Be brutally honest. Inflated self-scores waste everyone's time.
- A "9.5/10 technical SEO" score requires: perfect Core Web Vitals, complete structured data (FAQ, HowTo, Article, BreadcrumbList, ItemList, SpeakableSpecification), XML sitemap with lastmod, robots.txt, canonical URLs, hreflang (if multilingual), OpenGraph + Twitter Cards, author markup, updatedDate signals, and internal linking architecture. If any of these are missing, the score is lower.
- Always list what's missing alongside any score you give.

---

## 7. THE VERIFICATION DECLARATION

Every agent completing content work MUST include this declaration in their status update:

```
VERIFICATION STATUS:
- [ ] All sourceUrls fetched and confirmed live (HTTP 200 or verified 403)
- [ ] All named companies/products confirmed to exist via web search
- [ ] All statistics traced to named sources
- [ ] All coverImage paths confirmed to exist in public/
- [ ] No keyword metrics presented without "Estimated" disclaimer
```

Any box left unchecked means the work is NOT ready for publication. Period.

---

## 8. CONSEQUENCES OF VIOLATION

Content that violates this policy will be:
1. Flagged with specific line-by-line issues
2. Fully rewritten with verified replacements
3. Documented as a policy violation in AGENT-TASKS.md

Repeat patterns of fabrication from any agent will result in all future work from that agent being subjected to mandatory pre-publication audit by Agent 1.

---

## INCIDENT LOG

| Date | Agent | File | Violation | Resolution |
|------|-------|------|-----------|------------|
| 2026-03-09 | Agent 4 | `ai-and-democracy.mdx` | sourceUrl 404 — wrong URL slug | Fixed by Agent 1 |
| 2026-03-09 | Agent 4 | `ai-justice-and-policing.mdx` | sourceUrl 404 — wrong URL slug | Fixed by Agent 1 |
| 2026-03-09 | Agent 4 | `ai-in-agriculture.mdx` | sourceUrl 404 — completely fabricated URL | Fixed by Agent 1 |
| 2026-03-09 | Agent 4 | `ai-in-agriculture.mdx` | "HarvestMAX" — fabricated company name | Replaced with verified "Apollo Agriculture" by Agent 1 |
| 2026-03-09 | Agent 4 | `ai-in-global-south.mdx` | sourceUrl 404 — fabricated URL, wrong topic | Fixed by Agent 1 |
| 2026-03-09 | Agent 4 | Multiple research files | Fabricated keyword difficulty scores and search volumes | Flagged — files annotated as "Estimated, no tool data" |
| 2026-03-09 | Agent 4 | `seo-aeo-standing-deep-dive-2026.md` | Self-assessed technical SEO as 9.5/10 (actual ~7.5/10) | Flagged — inflated self-score documented |

---

*This document is the law. No deadline, no "move fast," no "it's close enough" overrides it. Quality is the product. Fabrication destroys it.*
