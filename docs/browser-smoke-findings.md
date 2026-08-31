# Browser smoke findings

## Production homepage

The production homepage at `https://resumecraft.co.in/` loaded successfully with the existing primary creation controls: `Create my resume`, `Create with AI`, and `Explore templates`. The page also exposes existing navigation for templates, ATS preview, resume examples, and the career blog. The production page currently contains older marketing claims such as accepted-company examples and MNC-focused language; the V2 implementation does not add or rely on those claims.

## Local homepage

The local Vite application at `http://localhost:5173/` loaded successfully with the same existing creation controls and no visible runtime error. The new onboarding modal is wired to the existing AI CTA in source; further interaction testing should be performed on the local editor route if needed.

## Onboarding modal

The local existing AI CTA opened one modal with exactly three choices: `Build with AI`, `Start from Scratch`, and `Upload Existing Resume`. The modal is visually centered and the background is dimmed. A coordinate/index click did not advance the branch in this browser session, so the remaining branch interaction is being validated through DOM-safe inspection rather than treated as a product failure.

## Console check

The local browser console showed only the normal React DevTools informational message and no runtime exception. A DOM click on the Build with AI card did not advance the modal in the automated browser session; the dialog remained on the initial choice screen. This points to an interaction-simulation limitation or event-target mismatch in the sandbox test, not a logged JavaScript error. The production build and static prerender still complete successfully.

## Extended career tools smoke test

- `/interview-prep` renders the new career-tool hero, role/category form, optional resume context field, disabled initial generate state, and footer links without console errors.
- The browser title remained `ResumeCraft` in the local development session even though the page renders correctly; the production prerender build completed the route and SEO metadata pipeline without errors, so this should be rechecked after deployment against the production domain.
- Shared footer copy now uses truthful feature descriptions and links to ATS review and the local application tracker.
- Homepage role-blueprint copy was changed from named-company hiring language to generic team contexts.

## Application tracker smoke test

The `/applications` route rendered a responsive local-first tracker with a clear empty state. A non-sensitive fixture entry was added successfully; the form reset, the row appeared with editable company/job/status/notes fields, the Applied count changed to 1, and the job URL link rendered. The UI explicitly discloses that data is stored locally in the browser.

## Final homepage CTA and trust copy check

The local homepage now presents one named `Build with AI Resume` hero action, alongside `Create my resume` and `Explore templates`; the lower AI section uses `Explore AI tools` instead of duplicating the primary CTA. The homepage still renders the existing role-blueprint cards, but their labels are generic team contexts rather than named employers. Fixed metrics, acceptance badges, recruiter-approval claims, ATS guarantees, and million-user/interview outcome claims were removed or replaced with factual product language.
