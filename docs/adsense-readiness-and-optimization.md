# AIViewer AdSense Recovery and Profitability Plan

Last updated: July 11, 2026

## Decision

Do not request another AdSense review immediately after deployment. The rejection was for **low-value content**, and the site had a large mismatch between its indexable footprint and its genuinely editorial content:

- 7,849 programmatic comparison pages and about 200 model pages
- roughly 125 editorial content files
- 33 tool-review files with no original product screenshots and, in most cases, no documented hands-on test
- several thin or overlapping guides, repeated FAQ sections, weakly sourced reports, and template-heavy content hubs

The recovery strategy is to present Google with a small, credible publication first. Twenty comparison URLs with demonstrated demand remain available during the transition, but only the five strongest are indexable and all remain unmonetized. The other roughly 7,800 generated comparison routes are retired from the release artifact.

The current release contains 62 HTML pages: 29 indexable URLs in the sitemap, 33 noindexed utility or transition pages, and only eight editorial pages permitted to load AdSense. Before this work, the build produced 8,535 HTML pages.

## Search Baseline

The July 11 Search Console export shows:

- 101,583 impressions
- 377 clicks
- 0.37% click-through rate
- 951 of the first 1,000 exported queries produced no clicks
- 843 of the first 1,000 exported pages produced no clicks

Comparison pages generated 218 clicks, but 637 of the 764 comparison URLs in the export had zero clicks. The top 20 generated 98 clicks at a combined 2.5% CTR. Five are kept indexable as a traffic-preservation test, 15 are in noindex transition, and the long tail is excluded.

This is enough visibility to prove demand, but not enough engaged traffic to make display ads the main business model. Near-term revenue should come from owned products, disclosed affiliate links, newsletter leads, and sponsored tutorials. AdSense is a secondary layer after approval and traffic growth.

## Changes Completed

### Search and crawl quality

- Added a shared index policy for HTML robots tags and the sitemap.
- Retired all but 20 proven comparison routes from the build, kept only the strongest five indexable, and left every comparison unmonetized; also excluded repetitive audience pages plus `/models/`, `/opportunities/`, `/tags/`, `/prompts/`, `/playbooks/`, `/reports/`, `/changes/`, `/preview/`, and `/download/`.
- Refreshed the 24 model records used by the retained comparisons from AIViewer's live catalog on July 11, 2026.
- Removed weak tool-review routes from the release artifact and excluded tool category archives and weak guides until they are materially improved.
- Excluded all noindexed pages from Pagefind and from AdSense script loading.
- Removed weak/programmatic sections from primary navigation, the footer, and the homepage.
- Consolidated overlapping guides with permanent redirects and marked the duplicate sources as drafts.
- Published a source-led weekly briefing on GPT-5.6, ChatGPT Work and Voice, Grok 4.5, Meta Muse, and Claude Reflect, with explicit availability limits, provider-claim labeling, and a repeatable reader test protocol.
- Added automated content and release audits for thin pages, missing sources, duplicate headings, impossible dates, unsupported claims, sitemap leakage, ad leakage, schema ratings, and commercial-page exclusions.

### Trust and editorial integrity

- Added Editorial Standards, Review Methodology, Corrections, AI Use, and Ownership & Funding pages.
- Corrected claims that implied every tool was purchased and personally tested.
- Removed unsupported numerical ratings and review schema from research-led tool evaluations.
- Distinguished hands-on testing from documentation-based evaluation.
- Identified OurScreen as a related product and disabled ads on its page.
- Enlarged and moved affiliate/sponsorship disclosures ahead of commercial calls to action.

### Revenue infrastructure

- Centralized verified affiliate programs so unverified or broken tracking links cannot silently appear.
- Retained checked affiliate destinations for Anything, Cal.com, and Wispr Flow in a central registry, but do not surface them while those review pages are retired.
- Fixed the Beehiiv newsletter form's Content Security Policy and removed the false timer-based success state.
- Added durable conversion-event forwarding for downloads, newsletter submissions, affiliate clicks, and advertising inquiries.
- Reworked the advertising page to sell clearly labeled sponsored tutorials without promising a positive review or misrepresenting AIViewer's audience.

## Reapplication Gate

Wait at least 14 days after the clean deployment, then request review only when all of the following are true:

- Search Console has processed the new sitemap and shows the excluded sections leaving the indexed set.
- Every indexable editorial URL is intentionally included, source-backed where freshness matters, and accessible through normal navigation.
- Every indexable tool evaluation clearly states whether it was hands-on or research-led and includes first-party evidence where hands-on testing is claimed.
- No indexable page is flagged by the content-audit script for thin content or missing sources.
- Homepage, Privacy, Terms, Contact, Disclosure, About, and all five editorial-transparency pages return HTTP 200.
- `https://aiviewer.ai/ads.txt` contains the authorized publisher line exactly.
- AdSense code appears only on eligible editorial pages and never on noindexed, owned-product, utility, or thin pages.
- A Google-certified consent platform is configured before personalized ads are served in the EEA, UK, or Switzerland.

Google does not publish a minimum word count or traffic threshold. The relevant standard is useful, original, people-first content with a good user experience—not simply a larger page count. See [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) and [Google Publisher Policies](https://support.google.com/publisherpolicies/answer/11112688).

## 90-Day Profit Plan

### Days 1–14: establish trust and measure demand

- Deploy this recovery release and submit the clean sitemap in Search Console.
- Track newsletter signups, affiliate clicks, owned-product visits, and advertising inquiries.
- Improve the 10 highest-impression, lowest-CTR editorial pages first: rewrite titles/descriptions to match the query and add a decisive answer near the top.
- Do not add new programmatic pages.

### Days 15–45: build pages that can earn

- Publish two evidence-rich commercial guides per week around high-intent searches: pricing, alternatives, best tool for a specific role, and workflow comparisons.
- Each commercial article should include original screenshots, a dated test log, pricing verification, limitations, a clear audience fit, and cited primary sources.
- Create one genuinely useful free asset or calculator tied to each priority audience and route it into the newsletter.
- Verify additional affiliate programs directly before adding them to the central registry.
- Pitch a small number of clearly labeled sponsored tutorials using current, supplied-on-request traffic figures.

### Days 46–90: scale only proven formats

- Reapply for AdSense once the gate above is satisfied.
- Add restrained ads only to long-form editorial pages after approval.
- Expand beyond the current five-page comparison index allowlist in batches of no more than five, only when each page has unique analysis, current prices, cited evidence, and meaningful search demand.
- Review every batch in Search Console for indexation, clicks, engagement, and cannibalization before releasing the next batch.

## Revenue Priority

1. Related/owned products and services
2. Verified affiliate offers matched to reader intent
3. Newsletter audience and future lead magnets
4. Clearly disclosed sponsored tutorials
5. AdSense as supplemental revenue

At the current click volume, optimizing solely for AdSense would produce little revenue and could damage the user experience. The first meaningful target is higher-intent traffic and measurable conversions, not more ad slots.

## Operating Cadence

- Weekly: Search Console query/page review, broken-link check, affiliate conversion review, and content-audit run.
- Monthly: refresh pricing and claims, add original evidence to the strongest existing pages, and prune pages that do not earn impressions or help users.
- Quarterly: reassess the index allowlist, sponsorship pricing, and revenue mix.
