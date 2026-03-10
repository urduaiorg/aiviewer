# AIViewer Masterplan

Date: March 9, 2026

## Core Thesis

AIViewer should become the decision layer for AI.

That means the site should help a visitor answer three questions fast:

1. What changed?
2. What should I use?
3. What should I do next?

This is a stronger position than being:

- a generic AI blog
- a raw benchmark dashboard
- a prompt dump
- a tool directory with affiliate links

The winning product is a hybrid:

- live model and tool data
- editorial judgment
- role-based recommendations

If built correctly, AIViewer becomes a utility platform with editorial depth, not just a publication.

## Current State

The current site is already a strong editorial foundation:

- 337 built pages
- 22 guides
- 17 playbooks
- 11 tool reviews
- 13 reports
- 10 prompts

Technology shape:

- Astro static site
- Tailwind 4
- MDX content collections
- a React quiz island
- Pagefind search
- an in-progress Cloudflare Worker + D1 setup for `/models/`

What is already good:

- the brand voice is clear and practical
- content types are well structured
- the site already organizes around real user intent: tools, guides, playbooks
- the Worker/D1 direction is strategically correct

What is missing:

- a real return-visit product
- a unified decision system
- trustworthy live data surfaces
- stronger conversion infrastructure
- a sharper standalone AIViewer identity

## Strategic Positioning

The best positioning for AIViewer is:

**"The clearest place to choose the right AI tools, models, and workflows for real work."**

This should be the product standard behind every page and feature.

The site should optimize for:

- clarity over novelty
- decisions over passive reading
- recurring usefulness over one-time traffic
- trust over hype

## Who The Site Is For

Primary audience:

- teachers
- students
- freelancers
- small business operators
- marketers
- developers
- researchers

Secondary audience:

- teams evaluating AI adoption
- buyers comparing AI tools and models
- readers tracking major model releases and pricing changes

These people are not looking for abstract AI commentary. They want operational clarity.

## The Product We Should Actually Build

The flagship product should be a combination of four systems that reinforce each other.

### 1. AI Stack Finder

This is the most important product opportunity.

The current quiz is only a prototype. It should evolve into a real recommendation engine that uses:

- role
- goal
- budget
- privacy sensitivity
- technical comfort
- team size
- preferred output type

The output should include:

- recommended tool stack
- recommended model
- recommended workflow or playbook
- recommended prompt starter
- pricing expectation
- caveats and tradeoffs

This becomes the site's strongest conversion and repeat-use feature.

### 2. Model Tracker

The `/models/` section should not be only a benchmark leaderboard.

It should become a live model tracker that covers:

- releases
- pricing changes
- context window changes
- status changes
- benchmark snapshots
- provider metadata

The page should answer:

- what launched recently
- what changed materially
- which models are best for specific use cases

### 3. Dynamic Comparison Engine

Comparison pages should be generated from structured data, not manually written one by one.

Examples:

- ChatGPT vs Claude for marketers
- best AI models for coding
- cheapest long-context models
- best AI tools for teachers

This is where SEO, user intent, and editorial leverage converge.

### 4. Editorial Action Layer

Live data alone is not enough.

AIViewer should add judgment:

- who this is best for
- where it breaks
- whether it is still recommended
- what changed since the last recommendation

This is the layer competitors usually fail to do well.

## What AIViewer Should Not Become

To build something exceptional, scope must stay sharp.

Avoid these traps:

- do not become a generic AI news site
- do not become a pure benchmark hobbyist site
- do not build a giant prompt library as the core identity
- do not chase every provider and every model equally on day one
- do not present mixed benchmark sources as a single universal score
- do not ship fake "live" experiences with stale or weak sourcing

The site should be biased toward quality and trust, not coverage volume.

## The Best Use Of Cloudflare Worker + D1

Cloudflare Worker + D1 is a strong fit, but only if the data model is clean.

### Data Principles

- API-first whenever possible
- source attribution for every important field
- timestamp every snapshot
- keep benchmark sources separate
- never flatten incompatible facts into one score

### Recommended Tables

#### `providers`

- `id`
- `name`
- `slug`
- `website_url`
- `is_active`
- `last_seen_at`

#### `models`

- `id`
- `provider_id`
- `slug`
- `display_name`
- `model_family`
- `release_type`
- `visibility`
- `description`
- `status`
- `announced_at`
- `created_at`
- `updated_at`

#### `model_releases`

- `id`
- `model_id`
- `version_label`
- `release_date`
- `release_kind`
- `summary`
- `source_url`
- `source_type`
- `created_at`

#### `pricing_snapshots`

- `id`
- `model_id`
- `input_price_per_million`
- `output_price_per_million`
- `cached_input_price_per_million`
- `currency`
- `source_url`
- `recorded_at`

#### `capability_snapshots`

- `id`
- `model_id`
- `context_window`
- `max_output_tokens`
- `supports_vision`
- `supports_audio`
- `supports_tool_use`
- `supports_reasoning`
- `source_url`
- `recorded_at`

#### `benchmark_sources`

- `id`
- `name`
- `slug`
- `methodology_url`
- `is_active`

#### `benchmark_snapshots`

- `id`
- `model_id`
- `benchmark_source_id`
- `benchmark_name`
- `score`
- `unit`
- `rank`
- `source_url`
- `recorded_at`

#### `editorial_verdicts`

- `id`
- `model_id`
- `verdict_label`
- `best_for`
- `avoid_if`
- `reasoning`
- `editorial_confidence`
- `written_at`

This structure lets AIViewer show live facts without losing editorial control.

### Worker Responsibilities

The Worker should do four jobs:

1. Ingest provider and model metadata from approved upstream sources.
2. Store time-based snapshots for pricing, capability, and benchmark changes.
3. Expose clean read APIs to Astro pages and client-side widgets.
4. Support derived views like "latest releases" and "biggest price changes."

### Suggested Endpoints

- `GET /api/models`
- `GET /api/models/:slug`
- `GET /api/releases`
- `GET /api/providers`
- `GET /api/benchmarks?source=lmsys`
- `GET /api/compare?models=a,b,c`
- `GET /api/changes?window=30d`

## Source Strategy

Do not rely on HTML scraping as the primary system.

Preferred order:

1. Official provider APIs and structured documentation
2. Reliable aggregator APIs
3. Stable structured feeds
4. Manual editorial entry for high-value gaps
5. HTML scraping only as a last resort

Important note:

- OpenRouter is useful as an aggregator, not a canonical truth source for every field.
- Benchmark providers should stay clearly labeled.
- Release dates should prefer first-party announcements whenever available.

## Recommended Information Architecture

### Homepage

The homepage should evolve from a magazine front page into a clearer decision hub.

Recommended blocks:

- hero with one primary promise: choose the right AI stack
- launch panel: what changed this week
- stack finder CTA
- featured comparisons
- featured playbooks by role
- featured tool reviews
- trusted methodology section

### `/models/`

Turn it into a release tracker and decision surface:

- latest launches
- benchmark tabs by source
- filters by provider, use case, price, context window
- editorial highlights

### `/models/[slug]/`

Each model page should include:

- quick verdict
- best use cases
- pricing
- context window
- recent changes
- benchmark history
- source links
- related comparisons and guides

### `/compare/`

This should become a generated or query-driven comparison system for:

- model vs model
- tool vs tool
- model + tool stack combinations

### `/finder/`

This should become the flagship recommender.

It should produce:

- "best stack for you"
- "cheaper alternative"
- "privacy-safe alternative"
- links to relevant reviews, playbooks, and model pages

## Editorial + Data Flywheel

The most powerful part of AIViewer is not content alone and not data alone.

It is the flywheel between them:

1. Live data reveals what changed.
2. Editorial pages explain why it matters.
3. Finder and comparison pages turn that into a decision.
4. Users return because the platform stays current.

This creates stronger retention than a static content site.

## Monetization And Trust

The site should monetize, but trust has to stay ahead of monetization.

### Good Monetization Fits

- affiliate revenue from reviewed tools
- sponsorship on clearly labeled pages
- premium buyer guides later
- lead generation for newsletters or downloadable assets
- consulting or training offers from authority built on the site

### Trust Requirements

- no fake form handling
- no inflated social proof
- no unlabeled affiliate bias
- no stale "latest" claims
- every live data page needs visible freshness and sourcing

This is critical because AIViewer is competing in a low-trust category.

## Biggest Current Gaps To Fix

### 1. The model tracker is still only a scaffold

The current `/models/` implementation is directionally right but not yet differentiated.

### 2. The quiz is too shallow

The current finder is hardcoded and should become a serious recommendation engine.

### 3. Conversion surfaces need more truthfulness

The download page should not simulate backend capture forever. It should either integrate properly or be simplified.

### 4. Brand identity should be more self-contained

AIViewer should feel like its own authoritative product, not a sidecar.

## 90-Day Roadmap

### Phase 1: Foundation

- finalize D1 schema
- rewrite Worker ingestion around structured snapshots
- add clean API endpoints
- normalize provider and model metadata
- establish source attribution rules

### Phase 2: First Live Product

- rebuild `/models/` into a release and benchmark experience
- add latest releases feed
- add filters for provider, price tier, context window, use case
- create first model detail pages

### Phase 3: Flagship Recommender

- replace the current hardcoded quiz logic
- create a structured recommendation matrix
- connect recommendations to tools, models, and playbooks
- output stack recommendations with rationale and alternatives

### Phase 4: SEO + Decision Pages

- generate high-intent comparison pages from structured data
- add freshness signals to major editorial pages
- add "still recommended" and "what changed" components

### Phase 5: Conversion Upgrade

- fix lead magnet backend and attribution
- refine newsletter integration under AIViewer branding
- add better internal linking between guides, tools, models, and finder results

## Definition Of A Masterpiece For This Site

This project becomes exceptional if it meets all of these:

- visitors can make a better AI decision in under five minutes
- the site has a credible reason to be revisited every week
- every important recommendation is explainable
- live data is fresh, sourced, and clearly separated from opinion
- editorial pages and live pages strengthen each other
- the product feels disciplined rather than crowded

If AIViewer gets these right, it will not feel like another AI content site. It will feel like infrastructure.

## Final Recommendation

The highest-value direction is:

**Build AIViewer as an AI decision platform powered by live model data, structured recommendations, and strong editorial judgment.**

The first flagship should be:

- a real AI Stack Finder
- a release-aware Model Tracker
- a comparison system built from structured data

That is the narrow, defensible path to a product that people trust, return to, and cite.
