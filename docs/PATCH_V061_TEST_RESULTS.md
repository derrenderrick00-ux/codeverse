# Verification report — v0.6.1-alpha.1 patch

This report concerns tests executed in the patch-authoring environment; it does not claim acceptance on the user's Ubuntu machine.

| Check | Observed result |
|---|---|
| Core TypeScript kernel typecheck (`tsc -p tsconfig.kernel.json`) | PASS |
| Kernel smoke tests (`node scripts/kernel-smoke.cjs`) | **32/32 PASS** |
| Python integration tests (`python3 -m unittest discover -s tests_python -v`) | **8/8 PASS** in patch environment |
| Python lesson reference snippets (`python3 scripts/verify_lessons.py`) | **20/20 PASS**, shell setup intentionally excluded |
| TS/TSX parse/transpile syntax (`node scripts/syntax-check.cjs`) | **24 files PASS** |
| React TypeScript semantic analysis (`npm run lint`) | **Not run** — npm dependency installation unavailable in patch environment |
| Vitest (`npm test`) | **Not run** — npm dependencies unavailable here; the single reported invalid assertion is corrected and test coverage added |
| Vite production build (`npm run build`) | **Not run** — npm dependencies unavailable here |
| Playwright/browser (`npm run test:e2e`) | **Not run** — Playwright browser/dependencies unavailable here |

The user previously reported that the v0.6 baseline built successfully, the kernel passed 29/29, and Vitest failed one assertion. The upgrade fixes that specific assertion and improves browser setup but **must still be verified locally**.

New tests check immutable demonstrated progress, return-to-study checkpoint selection, and hints that omit quiz/repair answer text. New Playwright scenarios cover automatic workshop return, saved-progress immutability on revisit, and progressive hint display.
