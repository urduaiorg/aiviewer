# AIViewer editorial policy

Adopted September 9, 2026. Apply when researching, drafting, materially updating, curating or publishing AIViewer content. Follow the current user's scope and authorization.

## Editorial purpose

Help English-speaking adults complete everyday document and knowledge tasks with AI. Start with summaries, source verification, action lists, tables and output evaluation. The business experiment is weekly evergreen publishing and site-attributed AdSense earnings, even small amounts. Do not substitute daily news, price trackers, courses or sponsorship sales for that objective.

One publishing session per week is the capacity constraint. A useful default is three new lessons and one refresh/measurement session per four weeks. A lesson may take another session to finish. Do not publish filler to meet a quota or schedule recurring agent runs without a request.

## Decide whether a page deserves publication

Name the reader, task and intended result in one sentence. Check the inventory before creating a URL. Compare current competing answers and identify a specific contribution: an input and worked solution, a corrected claim ledger, a reproducible exercise, an original observation or analysis that changes the reader's decision.

A prompt list, generic checklist, provider summary or embedded video is not automatically sufficient. Prefer an existing URL when the reader task is unchanged. Merge overlapping answers into the relevant keeper, update internal links and use a permanent redirect. Without Search Console data, call this an editorial consolidation, not proven keyword cannibalization. Use a real 404 for retired material with no equivalent; do not send every old article to a generic hub.

Do not convert a price list or announcement into evergreen content just by changing its title or dates. Give historical material an explicit dated context, remove current promotion and ads, and preserve honest source-check dates. Keep material needing a substantive correction in the repair queue until the correction is done.

## What a practical lesson contains

Lead with the useful answer. Normally include:

- Inspectable input or source material with permission to use it.
- A worked output or proposed solution.
- Checks, failures or corrections that explain why the result is usable.
- A bounded reader exercise, preferably with an answer key or reusable asset.

Adapt this shape to the task. A conceptual lesson can use a worked analogy; a video lesson needs independent teaching value beyond a transcript summary. Length is determined by the task. The old 900-word rule was a local heuristic, not a Google requirement; neither word count nor an article quota establishes quality.

Use accurate, specific titles. Avoid “best,” “winner,” “tested,” numerical ratings, superlatives or claimed productivity gains unless the evidence supports that exact conclusion. Do not fill a comparison table with invented scores.

## Keep evidence categories separate

Official documentation establishes documented features and terms. It does not establish output quality, comparative superiority or AIViewer's personal experience. Attribute provider demonstrations and third-party tests to their producers. Open the actual supporting content; a plausible URL, HTTP success or search snippet alone is not verification of the claim.

An authored or synthetic teaching example must be labelled beside the example. Deliberately flawed text must be identified as such. Never present synthetic cases as client outcomes, real feedback or observed model failures.

A real tool test records the date, product/model or mode, account conditions, prompt, inputs, attempts, actual outputs and checks. Preserve unsuccessful attempts relevant to the conclusion. Compare equivalent tasks and explain material differences. A small trial supports a narrow observation, not a universal ranking.

Recalculate numbers and check their denominators. Preserve missing values and unresolved evidence. Use primary sources for consequential product claims; separate facts, interpretation, estimates and opinion. Respect permissions and attribution for videos, images, source excerpts and exercises.

## Dates, AI use and manual review

Keep original publication dates. Update the content-modification date for substantive changes. Change factCheckedAt and source checkedAt only for checks actually performed. If only an exercise was added, retain the previous source-check date and say what changed.

New and materially rewritten active guides include originalContribution, evidence, limitations, learningOutcome, nextAction, aiUse, publication state and review dates. The schema and content audit help catch omissions; they cannot judge originality or truth.

Disclose AI generation or assistance accurately. AI self-review, code tests and source checks are not manual editorial review. Credit a named person only for work that person actually performed. Permission to publish does not establish that the person reviewed the content.

For actual manual review or curation, record: page/asset, content revision or hash, reviewer, date, claims and examples inspected, corrections requested, and decision. Keep fields null until known. Review affected material again after a consequential change. Prepare the finished article and focused review points before asking for human review.

## Publication and AdSense gates

New lessons start as drafts with index and monetize false. Existing page corrections can proceed under the user's repair authorization. Follow the project's build and browser checks in project-publishing.md; preserve unrelated changes and verify the released result if deployment is authorized.

Downloads must work directly without forced signup. Never simulate a saved result or subscription success with a timer. Restore email signup only after the publication identity, actual destination and success/failure behavior have been verified.

The site uses an AdSense ownership meta tag and ads.txt independently of ad serving. adServingEnabled is held false during the September cleanup. Do not enable it merely because a build passes. Require current account approval, appropriate consent coverage and recorded manual review/curation of retained automated ad content. Per-page eligibility still excludes utility, noindex, historical and unreviewed material. Recheck current official Google guidance when assessing readiness or submitting.

Resolve low-value public content across the site; noindex alone is not a repair. Do not guarantee approval from a word count, page count, traffic threshold or arbitrary wait period. Reapply only with session authorization and completed readiness checks; record the actual response and avoid repeated submissions while a review is pending.

## Weekly learning loop

Use actual Search Console query/page performance, analytics pageviews and site-filtered AdSense revenue when available. Search clicks are not pageviews, and account/network revenue is not AIViewer revenue. Record unknowns as unknown. Revenue scenarios are assumptions until observed RPM and traffic exist.

Judge a lesson by whether it gains relevant impressions/clicks, supports an identifiable task and can be maintained within the weekly capacity. Review patterns over several weeks rather than rewriting after a few quiet days. Track costs and time alongside even small income. Update evergreen-state.json and the queue with what is drafted, reviewed, released, retired and still dependent on access or review.

## Repository implementation and authorized exceptions

Updated September 24, 2026. Use `historical: true` only for deliberately archived briefings. The `ai-signal` format alone does not mean historical: the user separately authorized September 21–25 news publications. Preserve that bounded exception; normal capacity remains weekly. Historical briefings are excluded from homepage promotion and RSS, display a dated banner and remain ad-free.

Keep `adServingEnabled: false` until account approval, applicable consent coverage and actual manual curation are established. Publication authorization is not human review. Run `npm run build`, `npm run audit:content` and `npm run validate:build`; check the actual desktop/mobile reading and download flows and verify the released deployment. Read the repository's current branch before publishing, preserve parallel changes and never force-push.

Use real Search Console data when accessible, with property, period and filters recorded. Unknown metrics remain unknown. No fixed word count, article count or self-assigned SEO score establishes readiness. The older policy and incident record are preserved in [editorial-integrity-history.md](editorial-integrity-history.md) as history; this policy governs current work.
