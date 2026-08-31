# ResumeCraft V2 Architecture Audit

## Existing stack

ResumeCraft is a Vite 7 + React 19 single-page client under `client/` and an Express 5 + Mongoose API under `server/`, with a Vercel serverless entrypoint at `api/index.js`. Authentication is JWT-based with local-storage token restoration, email OTP flows, and Google OAuth. The production domain is configured as `https://resumecraft.co.in/` in the SEO layer.

## Existing resume contract

The current editor and API persist `title`, `personalInfo`, `summary`, `experience`, `education`, `skills`, `projects`, `templateId`, and `isPublic`. The editor already supports guest drafts, drag-and-drop ordering for experience and education, seven render-only template variants, responsive mobile tabs, and client-side A4 PDF export through `html2canvas` and `jsPDF`. Existing routes such as `/editor/:id?`, `/dashboard`, `/templates`, `/resume-template/:slug`, `/p/:id`, and cover-letter routes must remain intact.

## Existing AI contract

The API currently exposes `POST /api/ai/suggest` for role-based summary, skills, and bullets, and `POST /api/ai/generate-cover-letter`. Provider calls are server-side with Gemini, DeepSeek, and Groq fallback logic. New AI features should reuse this provider layer, must return reviewable suggestions, and must not invent facts.

## Important gaps found

The current homepage routes the existing AI CTA directly into the editor's AI accordion instead of a guided onboarding flow. The editor has no section-navigation sidebar, autosave status, undo/redo history, import review flow, functional ATS analysis, job-description matcher, or DOCX export. The Mongoose schema does not persist certifications even though the editor renders them, and update logic uses truthiness checks that can prevent intentionally clearing fields. `api/index.js` also needs to mirror the local server's Express import and route behavior before serverless deployment can be trusted.

## Implementation priority

1. Add a single onboarding modal launched by the existing homepage AI CTA, with Build with AI, Start from Scratch, and Upload Existing Resume options.
2. Add template selection, role/experience/optional-information steps, safe guest draft seeding, and upload review without overwriting silently.
3. Upgrade the existing editor in place with section navigation, autosave, undo/redo, customizable typography/accent settings, copilot actions, ATS analysis, and job matching.
4. Extend the backend schema and AI routes only where necessary, add server-side import parsing and DOCX generation, and preserve the current PDF flow.
5. Add functional career-tool routes and SEO/internal-link improvements incrementally, then build and smoke-test the application.

## Validation baseline

The existing client production build succeeds after installing the client dependencies with `npm install --legacy-peer-deps`. The root `install-all` script currently fails because it changes into `server/` and then attempts to change into `client/` relative to `server/`; this script should be corrected as part of the compatibility cleanup.

## Completed extensions

The implementation now includes public India/fresher/student guidance pages, a complete twelve-role resume-example catalog, resume-template category pages, a cover-letter examples route and `/cover-letter-builder` alias, an interview-prep workflow backed by server-side AI endpoints, and a guest-friendly local application tracker. The existing public-profile route remains in place rather than being duplicated.

Trust-sensitive homepage and shared-footer language was revised to remove named-company hiring implications, unsupported approval counts, ATS guarantees, speed promises, and round-the-clock support claims. SEO private-route detection now covers the authenticated cover-letter builder and application tracker.

## Validation notes

The client production build and prerender pipeline completed successfully for the expanded public route set. Targeted ESLint and Node syntax checks passed for all V2-modified client files and server files. Backend smoke tests covered deterministic ATS analysis, job-description matching, DOCX export archive validity, DOCX import round-tripping, and graceful AI-provider-unavailable responses for interview preparation. Browser smoke tests covered the production homepage, local onboarding modal, a prerendered resume-example page, interview preparation, and adding an application-tracker entry.
