# AIViewer article-cover editorial policy

Adopted: 2026-09-25. Applies to new and materially refreshed article covers, thumbnails and social previews. This is the project policy for cover production; it supplements the existing editorial policy. Existing covers are not automatically replaced.

## Editorial standard

Every cover must communicate the article's specific subject or reader task through one clear visual idea. It must remain recognizable at thumbnail size and belong unmistakably to AIViewer's visual family. Beautiful but interchangeable artwork does not pass. A cover illustrates the article; it must not promise a result the article cannot support.

Read the complete article before writing a prompt. Record its reader, task, central claim, useful outcome and limitations. Write a one-sentence visual thesis explaining why the proposed scene belongs to this article. If the image could accompany five unrelated articles unchanged, revise the concept.

## Original branding is binding

Use the existing AIViewer identity, not the invented marks in the September homepage concepts. Inspect the current site's Header, original logo assets and design tokens before production. Never ask a generator to redraw the logo. Use an existing logo asset exactly when branding is needed; do not distort, recolor or reconstruct it. Keep the artwork logo-free when the exact asset is unavailable.

The original visible header in `app/_stage_app/aiviewer/src/components/layout/Header.astro` takes precedence over generic global tokens: its Montserrat wordmark uses amber #D88A00 for “AI” and near-black #11110F for “Viewer”. Preserve the original HTML/CSS wordmark or an authentic exported asset. The favicon uses gold #F0C75E with white on charcoal. Use warm white/ivory surfaces, amber/gold accents and dark readable type. Global Inter and Inter Tight fonts remain available for body and editorial headings; the wordmark stays Montserrat. Indigo #4F46E5 exists in global styles but is an optional supporting color, not a replacement brand identity. A later explicitly approved brand source takes precedence.

Use predominantly neutral surfaces and purposeful amber accents. Natural colors are encouraged in relevant photographic subjects. Exact logo and color fidelity must come from real assets and final production checks, not an image generator's approximate rendering.

## Authentic company logos

For an article about a named company or product, use its authentic current logo when it helps readers recognize the subject. Obtain the asset from the company's official brand/media resources or a verified user-supplied original. Browse the official source when obtaining or verifying a current mark; record the source URL, retrieval date, product/company identity and any relevant usage terms. A search-engine thumbnail or unofficial icon collection is not sufficient provenance.

Generate the underlying scene without logos and reserve a clean placement area. Place the authentic SVG or transparent PNG as an unchanged production layer using a layout/compositing tool; the user's request explicitly authorizes this exact-asset compositing workflow. Do not ask imagegen to invent or redraw corporate marks. Preserve proportions, colors, clear space and the correct approved light/dark variant. Avoid stretching, recoloring, decorative distortion, or integrating a distorted approximation onto a generated object. Inspect the final mark against its source at full size and thumbnail size.

In comparisons, give company marks equivalent visual prominence unless the article has an evidence-based reason otherwise. A logo identifies the subject, not sponsorship, partnership, certification or endorsement. Keep AIViewer's publisher identity distinct. If an authentic asset cannot be obtained, use the company name as normal typeset text and record the missing asset; never substitute an invented mark.

## Realistic people and characters

Use believable people when a human scene explains the reader's task better than abstract objects. Prefer a learner studying, a teacher preparing a lesson, a researcher checking sources or a creator working through a concrete example. Choose age, clothing and setting for the article context without stereotyping. A person is not required on every cover.

For generated fictional people, prompt for natural skin texture, plausible anatomy and hands, coherent eye direction, understated expressions, ordinary clothing, believable posture and a specific task. Use consistent window or practical lighting, realistic depth of field and lived-in but uncluttered environments. Avoid plastic skin, exaggerated reactions, glamour retouching, posed stock-photo smiles and gratuitous beauty standards. Inspect hands, eyes, teeth, object contact, screen reflections, shadows and background faces before acceptance.

Fictional characters must not be presented as real customers, reviewers, researchers, company employees or actual event participants. Record “fictional generated person” in provenance and disclose the image as an AI-generated editorial illustration. Do not invent quotations, testimonials, affiliations or outcomes for them.

When a real named person is editorially relevant, prefer an authentic appropriately sourced photograph. If a generated likeness is requested, use suitable reference material, preserve identity, clearly label the result as synthetic and avoid implying an unverified event or endorsement. Do not substitute a fictional lookalike for a real person's photograph. Record reference provenance and any applicable permission; never claim permission or identity verification that was not established.

## Art direction

Prefer thoughtful editorial still life, restrained conceptual illustration, or accurate teaching visuals. Choose the medium for the story. Use one dominant subject, coherent lighting, intentional negative space, convincing materials and a small number of meaningful supporting objects. Keep the composition readable without the headline.

| Article type | Strong visual approach | Reject |
| --- | --- | --- |
| AI fundamentals | A precise visual analogy for the distinction being taught | An attractive abstraction that misrepresents how the system works |
| Document workflows | A concrete transformation from input to useful output | Random floating documents or impossible output claims |
| Verification | Inspecting evidence, tracing an assertion to its source | Checkmarks that imply an unsupported endorsement |
| Tool evaluation | Neutral task-related objects or authentic captured product material | Generated interfaces, fabricated benchmarks, winner badges |
| Video lessons | An original illustration of the lesson's core idea | Invented creator portraits, copied thumbnails, implied endorsement |
| News or research | Clearly illustrative art connected to the verified subject | Synthetic photographs presented as evidence of an event |

Avoid generic robots, glowing brains, neon circuitry, random glass orbs, decorative dashboards, excessive gradients, stock handshake imagery and repeated magnifying glasses unless the article specifically justifies them. Do not mechanically reuse the homepage's glass sculpture for every topic. Review the previous six covers together: vary composition and metaphor while retaining palette, finish and editorial tone.

## Imagegen production workflow

1. Read the installed imagegen skill at `/Users/qroonjha/.codex/skills/.system/imagegen/SKILL.md` when applying it for the first time in the session. Use its built-in image-generation tool by default. Do not silently switch to an API, CLI or different provider.
2. Prepare a brief containing article path/revision, title, audience, visual thesis, factual boundaries, medium, palette, intended crops and prohibited elements. Develop three concise concept descriptions, choose the strongest and record the reason. Generating all three is optional.
3. Generate original cover artwork without a baked-in article headline, logo, watermark, provider badge or unnecessary text. Put titles in accessible page HTML. For a branded social export, typeset the title and place the original logo deterministically in the site's fonts; do not rely on generated typography. Necessary teaching labels must be individually checked for accuracy and legibility.
4. When editing an existing raster image, inspect it first, specify what must remain unchanged, and use imagegen for the edit unless the user explicitly requests another method. Label reference-image roles clearly and use only authorized source material. Routine resizing, compression and exact typesetting are production operations, not substitutes for generating requested artwork.
5. Inspect the result at full resolution and at actual thumbnail sizes. Revise the identified defect with a focused prompt. Do not accept an image simply because generation succeeded. If the concept fails after two focused revisions, change the concept instead of repeating cosmetic adjustments.
6. Save the selected master, exact prompt, review notes and metadata in the project's editorial working folder. Keep draft assets outside the application's `public/` directory. Copy approved production exports into the current app's editorial asset directory only as part of the publishing workflow.

### Reusable prompt

```text
Use case: [illustration-story / stylized-concept / photorealistic-natural / scientific-educational]
Asset type: AIViewer article cover, landscape, with thumbnail and social crops
Article: [exact title and concise factual summary]
Reader task: [what the reader will learn or accomplish]
Visual thesis: [one specific idea expressed by the image]
Subject and action: [concrete scene; meaningful relationships between objects]
Style: refined original editorial [chosen medium]; confident, clear, practical
Brand palette: original AIViewer amber #D88A00, gold #F0C75E, warm white/ivory and ink #11110F; natural scene colors permitted
Composition: one dominant subject, clean silhouette, meaningful negative space; essential content crop-safe
Lighting and materials: [consistent, intentional direction]
Text: none [or exact indispensable teaching labels]
Factual constraints: [what must be true; what the illustration must not imply]
Avoid: invented logos, generated interfaces, fake evidence, unsupported rankings, generic AI clichés, clutter, watermarks
References: [asset roles and invariants, only if supplied]
People, if relevant: [fictional person or named subject; task, natural expression, setting, anatomy and lighting requirements]
Company logos, if relevant: generate no marks; reserve [placement] for authentic [company/product] asset added unchanged after generation
```

For a human-centered cover, use `photorealistic-natural`. Example scene brief: “A fictional adult learner checking a printed source beside a laptop at a modest sunlit desk; natural skin texture, relaxed concentration, anatomically plausible hands resting on paper, warm ivory and muted amber accents. Laptop display out of focus, no fabricated readable interface. Leave the upper-right background uncluttered for a separately placed authentic company logo. No implied testimonial or affiliation.” Adapt the task to the article rather than reusing this scene mechanically.

## Export and page integration

- Aim for a landscape master of at least 2400 pixels wide when available. Record actual dimensions; do not claim resolution the generator did not deliver or upscale merely to satisfy a number.
- Prepare a 1600×900 article export and a separately checked 1200×630 social export. Check the site's actual card crop as well: the existing cover component includes 16:10 and 2:1 containers. Recompose if cropping cuts off the subject or changes its meaning.
- Keep essential subjects and any required labels within the central 80% of the frame as a starting composition rule; inspect every real crop rather than assuming that margin guarantees success.
- Prefer WebP or AVIF for web delivery and retain the original master. Target no more than 200 KB for card exports and 350 KB for article exports when visual quality permits. These are project budgets, not claims about search rankings or guaranteed performance.
- Use descriptive filenames such as `<article-slug>-cover-v1.webp`; preserve previous versions. Record dimensions and focal point. Include explicit image dimensions in page markup; lazy-load below-the-fold images and prioritize only the actual lead image where appropriate.
- Alt text describes the relevant visible content briefly, without keyword stuffing or repeating the headline. Use empty alt text for purely decorative duplicates where appropriate. Put AI-generation disclosure in a visible credit/caption or accessible image-credit treatment; alt text alone is not the disclosure system.
- Confirm that the actual article, homepage/listing card and social metadata use the approved file. Check desktop and mobile rendering, crop, broken links and layout stability.

Implementation history, 2026-09-25: the older staging `EditorialCover.astro` discarded its `image` prop. The learner redesign in `app/_design/learner-home` now renders supplied existing images, uses recorded alt text and responsive exports, and retains procedural artwork only as an explicit missing-image fallback. Test both the production build and browser rendering: development-only filesystem paths can otherwise cause silent fallback. Do not report a cover as displayed based only on a saved file or frontmatter.

## Quality gate

Rate each criterion from 0 to 5, then multiply by its weight divided by 5. Record short evidence for each rating.

| Criterion | Weight |
| --- | ---: |
| Specific relationship to the article and reader task | 25 |
| Factual integrity and truthful visual implications | 20 |
| Fidelity to original AIViewer branding | 15 |
| Composition and thumbnail readability | 15 |
| Craft: lighting, materials, anatomy, edges and artifacts | 15 |
| Export, accessibility and crop quality | 10 |

Accept only at 90/100 or above, with no criterion below 4/5 and no hard failure. This is an internal editorial rubric, not an objective quality certificate or website performance score. Never award 100 by default. Missing required checks means pending, not passed.

Hard failures override the score: misleading evidence; unsupported product claims; invented or altered brand marks; unlicensed source material; misspelled essential labels; disturbing generation artifacts; unreadable required information; critical subject cropped out; duplicate generic art with no article-specific meaning; or the published page displaying the wrong asset.

## Provenance and review

Record article slug/revision, asset version, creation date, tool actually used, exact prompt, input/reference provenance, original and exported paths, actual sizes/dimensions, crop/focal point, alt text, disclosure, rubric scores, defects corrected and integration checks. Extend or accompany the existing `src/data/editorial-image-provenance.json` without discarding its records or assuming an undocumented schema change is safe.

Keep AI quality checks separate from human editorial review. Record a named reviewer and review date only when that person actually reviewed the relevant revision; otherwise leave them null. Follow the existing article publication and manual-review policy. Asset preparation does not itself authorize deployment or establish review completion.

Suggested disclosure: “AI-generated editorial illustration.” If relevant, add “Illustrative; not a product screenshot or photograph of an actual event.”

## Completion record

A cover is production-ready only when its article brief, approved artwork, prompt, provenance, exports, alt text/disclosure and quality checks are saved. Publication additionally requires observing the intended cover in its actual page contexts. Report prepared, integrated and published as separate states.
