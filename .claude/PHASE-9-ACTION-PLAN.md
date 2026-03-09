## PHASE 9 — SEO 10/10 ACTION PLAN: DEEP DIVES & TRUST SIGNALS

> **Assigned to**: Agent 2 (Frontend) and Agent 3 (Content)
> **Priority**: CRITICAL — Final push before broad public launch
> **Updated by**: Agent 4 — 2026-03-09

### STRATEGIC CONTEXT
Our site architecture and "AI & Society" foundations are strong (scoring ~8.5/10), but we are missing the bottom-of-funnel conversion engines and explicit trust signals required to beat established giants like Wirecutter and Futurepedia. This phase closes those gaps.

---

### TASK 9A: Build the "How We Test" Trust Manifesto (Agent 3 & Agent 2)
**Status**: OPEN

Google's 2026 Quality Rater Guidelines heavily penalize affiliate sites that lack explicit testing transparency. We need a dedicated page and a reusable UI component.

1. **Agent 3 (Content):** Write `src/content/guides/how-we-test-ai.mdx`.
   - Detail a rigorous, 5-step methodology: (1) Account Creation (paid tiers), (2) Standardized Prompt Benchmarking, (3) Edge-case Stress Testing, (4) Data Privacy Audit, (5) Value-for-Money Analysis.
   - Emphasize that we pay for our own subscriptions and do not accept paid placements for higher rankings.
2. **Agent 2 (Frontend):** Create a `<TrustBadge />` Astro component.
   - It should be a visually distinct, compact box (perhaps with a shield icon) that links to the "How We Test" manifesto.
   - Inject this component at the top of *every* single file in `src/content/tools/` and *every* comparison guide.

### TASK 9B: The "Wirecutter" Deep-Dive Comparisons (Agent 3)
**Status**: OPEN

We have a massive gap in developer and high-intent queries. Agent 3 must create 3 authoritative, long-form comparison guides. These cannot be generic; they must declare clear winners.

1. **`src/content/guides/copilot-vs-cursor-coding-ai.mdx`**
   - Target: "github copilot vs cursor 2026"
   - Angle: Compare autocomplete latency, codebase indexing (RAG), and ease of refactoring. Explicitly state which is better for boilerplate vs. complex architectural changes.
2. **`src/content/guides/midjourney-vs-dalle3-vs-stable-diffusion.mdx`**
   - Target: "midjourney alternative free" / "best ai image generator"
   - Angle: Provide prompt execution examples for each. Rank by: Photorealism, Text Rendering, and API extensibility.
3. **`src/content/guides/claude-opus-vs-gpt5.mdx`**
   - Target: "claude opus 4.6 vs gpt 5.4"
   - Angle: Move beyond basic MMLU benchmarks. Test them on complex logic puzzles, 100k+ context window recall, and coding tasks.

*Requirement:* Use the `<ProsCons>` and `<PricingTable>` components extensively in these files.

### TASK 9C: Digital PR & Backlink Seeding (Agent 1)
**Status**: OPEN

The 11 reports in `src/content/reports/` (our "AI & Society" vertical) are useless if nobody sees them. Agent 1 needs to execute a distribution strategy.

1. **LinkedIn Outreach:** Extract the most compelling statistic from each report (e.g., the 165% data center energy surge, the 75% UK predictive policing stat). Draft 11 distinct LinkedIn posts, tagging the cited research organizations (WEF, Stanford HAI, Amnesty).
2. **Academic Seeding:** Identify 10 university tech-ethics departments and draft cold emails offering our "Global AI Regulation Tracker" and "AI in Justice" reports as open educational resources for their syllabi.

---

### VERIFICATION CHECKLIST (Phase 9)
- [ ] `how-we-test-ai.mdx` published and `<TrustBadge />` integrated on all tool pages.
- [ ] 3 massive comparison guides published (Cursor vs Copilot, Image Gen showdown, Claude vs GPT).
- [ ] 11 LinkedIn promotional posts drafted for the "AI & Society" reports.
