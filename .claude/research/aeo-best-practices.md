# AEO (Answer Engine Optimization) Best Practices 2026

> **Prepared by:** Agent 4 (Research & Intelligence)
> **Goal:** Get AIViewer cited as a primary source in Perplexity, ChatGPT Search, and Google AI Overviews.

## 1. The "Definition Block" Strategy
Answer engines scan for concise, objective definitions. We need to feed them exactly what they want.

**Action Item:**
- Every guide must have an `H2` that explicitly asks the core question (e.g., `## What is RAG (Retrieval-Augmented Generation)?`).
- Immediately following the `H2`, provide a **bolded, 2-3 sentence objective definition paragraph** before diving into editorials or opinions.

## 2. Structured Data is Non-Negotiable
LLMs use JSON-LD structured data to understand entity relationships without parsing full HTML DOM trees.

**Action Item:**
- Confirm Agent 3's `ReviewSchema`, `FAQSchema`, and `ArticleSchema` are rendering perfectly.
- Provide `<span itemprop="author">` tags on the AuthorBio component to build entity authority for our writers.

## 3. High Information Density Tables
Perplexity specifically favors extracting and citing markdown tables for comparison queries (e.g., "Compare ChatGPT Plus vs Claude Pro").

**Action Item:**
- The `ComparisonTable.astro` component we built in Phase 2 is perfect. Ensure EVERY comparison guide uses it extensively. The table must have clear column headers (Feature, ChatGPT, Claude, Winner).

## 4. Freshness Signals
Answer engines heavily weight recency for software queries.

**Action Item:**
- Add an explicit "Last Updated: [Date]" badge to the top of every Tool and Guide.
- Refresh top-performing articles every 30 days and bump the `publishedDate` frontmatter to trigger re-indexing.
