# TODO

A concise list of pending work, blockers, and next steps.

## Blockers / Known Issues
- Deployment pending: Turborepo + Next.js upstream bug. Waiting for upstream fix before production deploy. Facing build issues on default error pages.

## High Priority
- Tests (backend + frontend):
  - Write deterministic/property-based tests (no exact text assertions)
  - Minimum coverage: image upload, AI integration (mocked), role filtering, export JSON
- Threaded comments:
  - Nested replies for AI/Vision feedback items
  - Basic CRUD (create reply, edit/delete own, list threads)
  - Backend routes + schema updates, optimistic UI on FE

## Medium Priority
- Overlay improvements on uploads using coordinates:
  - Optional: re-introduce image-region highlights with better UX (hover to preview, click to pin)
  - Ensure highlights support both normalized (0–1) and pixel coordinates
  - Accessibility: keyboard focusable cards should preview regions

## Optional / Cost Considerations
- GCP storage for images (vs local disk):
  - Migrate to Cloud Storage bucket with signed URLs
  - Adds cost; keep local storage for dev and low-cost demos

## Housekeeping
- Add .env.example files for backend and frontend with variable descriptions
- Scripts: add `npm test` at root (once tests are added) and CI workflow
- Docs: update README with deployment steps after upstream bug is resolved
