# ResumeCraft Improvement Roadmap

## Current assessment

ResumeCraft already has a substantial product foundation: React/Vite routing, a public SEO content layer, resume and cover-letter editors, guest drafts, autosave, multiple template variants, PDF/DOCX export paths, authentication, application tracking, interview preparation, and server-side AI routes. The repository is not a blank starter project; the next gains should come from reliability, clarity, conversion, and content quality rather than adding many disconnected features.

## Changes completed in this pass

The prerender pipeline now detects a locally installed Chromium executable or a `PUPPETEER_EXECUTABLE_PATH` override. This keeps the existing Vercel/Sparticuz Chromium path intact while allowing the local production build and SEO prerender process to complete in environments where Puppeteer has not downloaded its bundled browser.

The global stylesheet now adds visible keyboard focus rings, touch-friendly active feedback, reduced-motion handling, high-contrast form borders, and a reusable visually-hidden-but-focusable utility. These changes improve accessibility and interaction quality without changing the established orange/slate design system.

The HTML shell now contains a useful default description, crawl directive, and brand theme color before React hydration. Shared page metadata now includes an author value and descriptive Open Graph/Twitter image alt text, improving link previews and baseline crawlability.

## Priority 0: production reliability

Before adding more features, keep the production build green. Run `npm run build` from `client/` and verify that prerendered HTML, `sitemap.xml`, and the complete public route set are generated. Run `npm run lint` separately and remove the existing unused imports and React effect warnings; the current lint command reports pre-existing issues in several pages and components even though the production build succeeds.

Add a CI workflow that runs client build, lint, server syntax checks, and a small API smoke test on every pull request. Keep `.env` files, API keys, MongoDB credentials, and generated `dist/` output out of commits.

## Priority 1: resume editor experience

Make the editor feel like a guided workflow rather than a long form. Keep the existing autosave, history, responsive tabs, and preview, but expose them clearly with a compact progress indicator, a persistent save status, section completion states, and an explicit “Review before download” step.

Improve factual safety in AI suggestions by showing a notice such as “Review every suggestion; AI must not invent experience.” Keep role, skills, and job-description context in the request, and preserve user control over applying suggestions. Add a one-click “Apply only missing skills” action to avoid duplicate skills.

Add validation for email, phone, URLs, date ordering, and empty experience entries. Make currently-working roles use a checkbox or switch instead of requiring an end-date placeholder. Preserve intentionally cleared fields during updates.

## Priority 2: templates and export quality

Create a template gallery with actual resume previews, clear role/industry labels, and a “Use this template” action. Each template should have a short explanation of readability, density, and best-fit use cases. Keep decorative elements optional so ATS readability remains the default.

Test PDF and DOCX export with long names, long URLs, multi-page experience, missing sections, non-Latin characters, and profile photos. Add a regression fixture for each template and verify that the export never clips the right edge or creates an unwanted blank page.

## Priority 3: content and conversion

Replace broad claims with specific product proof. The homepage should answer five questions quickly: who the product is for, what can be created, how AI helps, whether a guest can start, and what happens to personal data. Use a single primary CTA, one secondary template CTA, and contextual internal links to examples, formats, and the blog.

Keep FAQ answers visible on the page and synchronized with FAQ structured data. Avoid unsupported claims such as guaranteed ATS scores, recruiter approval, hiring outcomes, or named-company acceptance unless verifiable evidence is available.

## Priority 4: organic growth

Build topic clusters rather than isolated blog posts. Use pillar pages for “resume builder,” “ATS-friendly resume,” “resume format for freshers,” “resume examples,” and “cover letter examples.” Link every supporting article to a relevant tool, template, example, and next article.

Prioritize search intent in India and early-career segments with genuinely useful pages: fresher resume format, BCA resume, MBA resume, engineering student resume, internship resume, Hindi-English resume guidance, and role-specific examples. Each page should have unique title, description, introduction, examples, FAQs, and a clear CTA instead of a thin keyword variation.

Measure organic growth with Search Console and Analytics events for template selection, editor start, AI generation, export, and application tracker use. Review impressions, clicks, CTR, indexed pages, and queries monthly; do not use traffic alone as the success metric.

## Recommended next implementation order

| Order | Workstream | Outcome |
|---|---|---|
| 1 | Fix lint errors and add CI | Safer releases and faster debugging |
| 2 | Improve editor progress, validation, and AI review UX | Higher completion and download rates |
| 3 | Add export regression fixtures | More reliable PDFs and DOCX files |
| 4 | Refine homepage copy and internal links | Better conversion and topical relevance |
| 5 | Expand topic-cluster content with unique examples | Sustainable organic traffic |
| 6 | Add Search Console-based measurement | Evidence-based SEO iteration |

## Important note

The current repository already contains several features described as future gaps in older audit notes, including autosave, history, DOCX export, interview preparation, application tracking, expanded landing pages, and SEO prerendering. Any future plan should treat those as existing foundations and focus on quality, discoverability, and reliability improvements rather than rebuilding them from scratch.
