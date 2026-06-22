# AIViewer.ai AdSense Readiness and Optimization

Last updated: June 22, 2026

## Current Setup

AIViewer.ai is now prepared for AdSense review at the code level:

- AdSense publisher script is included site-wide with `ca-pub-8532451951782012`.
- `public/ads.txt` authorizes Google with `google.com, pub-8532451951782012, DIRECT, f08c47fec0942fa0`.
- Privacy, Terms, Contact, and Disclosure pages exist and are linked from the footer.
- The privacy policy includes Google advertising-cookie disclosures and personalized advertising opt-out links.
- The Content Security Policy allows Google ad scripts, frames, images, and network calls.

## Approval Priorities

Before requesting review, deploy these changes and confirm:

- `https://aiviewer.ai/privacy/` returns 200.
- `https://aiviewer.ai/terms/` returns 200.
- `https://aiviewer.ai/contact/` returns 200.
- `https://aiviewer.ai/disclosure/` returns 200.
- `https://aiviewer.ai/ads.txt` contains the Google publisher line exactly.
- The AdSense script appears in the HTML source of the homepage and article pages.
- Search Console verification is configured if available.

## Policy and Design Audit

| Area | Status | Notes |
| --- | --- | --- |
| Original content depth | Strong, monitor | The site has guides, tool reviews, playbooks, prompts, reports, and model pages. Keep generated comparison/model pages enriched with unique summaries so they do not read as thin templates. |
| Navigation | Ready | Primary navigation and footer navigation expose the major content sections plus About, Contact, Privacy, Terms, and Disclosure. |
| Required privacy disclosure | Ready | Privacy page includes Google advertising-cookie disclosures and opt-out links. |
| Contact/about trust | Ready | About and Contact pages are available and linked. |
| Ads.txt | Ready after deploy | `public/ads.txt` contains the Google-authorized seller line. Verify the live root URL after deployment. |
| Ad code | Ready after deploy | The AdSense script is included in the shared base layout, so it appears on all rendered pages. |
| Ad placement UX | Ready for initial approval | Use Auto ads or restrained manual placements first. Avoid ads beside navigation, download buttons, quiz controls, or affiliate CTAs. |
| Content Security Policy | Ready for initial approval | CSP now allows Google ad scripts, frames, image loads, and network calls while keeping the rest of the security posture intact. |
| Consent requirements | Needs account setup | Use Google Privacy & messaging or another Google-certified CMP before serving personalized ads to users in the EEA, UK, or Switzerland. |

## Best Ways to Maximize AdSense Without Hurting Approval

1. Start with Auto ads during the first month after approval. Let AdSense learn page layouts and user behavior before hardcoding many manual units.
2. Keep ads away from navigation, download-style buttons, quiz controls, and affiliate CTAs. AdSense policy risk is higher when ads can be mistaken for site actions.
3. Prioritize high-intent pages: tool reviews, comparison pages, pricing guides, and best-tool roundups. These usually monetize better than broad news pages.
4. Use fewer, cleaner placements: one in-content unit after the opening section, one mid-article unit, and one near the end is safer than dense ad stacking.
5. Protect Core Web Vitals. Lazy-load manual ad units, reserve height for ad containers, and avoid layout shift around article content.
6. Strengthen E-E-A-T signals on review pages: author bio, update date, testing method, external sources, pros/cons, clear verdict, and affiliate disclosure.
7. Reduce thin generated pages. If model or comparison pages are mostly templated, add unique summaries, use-case guidance, and related editorial links before relying on them for ad traffic.
8. Add consent handling before targeting EEA, UK, or Switzerland users. Google requires a certified CMP for personalized ads in those regions.
9. Review the AdSense Policy Center after launch. Fix crawler, policy, or ads.txt warnings before scaling ad density.

## Suggested Placement Strategy

- Homepage: Auto ads only at first, then consider one responsive unit between major content sections.
- Guides and playbooks: responsive in-article unit after the intro and another after the midpoint.
- Tool reviews: one unit after the quick verdict, but not adjacent to affiliate CTAs.
- Comparison pages: one responsive unit below the comparison summary and one near related comparisons.
- Mobile: avoid sticky bottom ads until the site is approved and mobile UX is reviewed.

## Remaining Non-Code Work

- Deploy the changes.
- In AdSense, request an `ads.txt` recheck after deployment.
- Add `https://aiviewer.ai/privacy/` in AdSense Privacy & messaging if you configure consent messages.
- Configure a Google-certified CMP if serving personalized ads in the EEA, UK, or Switzerland.
