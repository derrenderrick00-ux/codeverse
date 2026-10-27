# CODEVERSE v0.6.1-alpha.1 — Learning flow correction

Changes:
- Workshop Student Profile success now navigates back to the next unlocked learning checkpoint, without bypassing outstanding work.
- Completed lessons are unrestricted for revision, but mastered scores and evidence remain read-only in storage.
- Three-stage hint scaffolding replaces direct answer disclosure on incorrect challenge feedback.
- Domain and Python challenge screens present guided hints.
- Vitest quiz/definition assertion corrected; three additional kernel tests and new browser scenarios added.
- Playwright browser override validates the path rather than producing an opaque launch error.

This is a patch for `feature/codeverse-v06` (`4667da2`). Alpha status remains until complete Ubuntu Playwright and unit/build checks pass.
