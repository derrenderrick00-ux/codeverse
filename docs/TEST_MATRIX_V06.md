# Verification matrix — CODEVERSE v0.6.0-alpha.1

## Automated checks in this package

| Test command | Coverage | Pass condition |
|---|---|---|
| `tsc -p tsconfig.kernel.json` | Core engine and storage static types | Zero compiler errors |
| `node scripts/kernel-smoke.cjs` | 29 core tracer, migration, progression, SQL/Pandas/NumPy/ML checks | Every `PASS`, final 29/29 |
| `python3 -m unittest discover -s tests_python -v` | SQLite constraints, rollback, report, numpy/pandas/sklearn | 8/8; no unexpected skips |
| `npm run lint` | Full React TypeScript project | Exit 0 |
| `npm test` | Vitest lessons, interpreter, progress, domain tests | All pass |
| `npm run build` | Vite production and all app TS types | Exit 0; chunk warning allowed |
| `npm run test:e2e` | Firefox/Chromium? Configured Chromium: locks, save/reload, inline-comment grade, 5-world display | 3 browser specs pass |

The compiler, standalone smoke and Python test commands ran in the packaging environment. Full frontend npm/Playwright execution requires installation of npm dependencies in Ubuntu; those tests were written but not independently run here.

## Acceptance invariants

- Disabling a tab is not sufficient security: direct lesson routes are protected by `canOpenLesson`, and directly navigating to advanced challenges is also gated.
- `completedSteps[N]` cannot be added through normal UI until prerequisite N−1 is complete and steps 7–9 pass their checks.
- A prior lesson must have the required flags plus all nine checkpoints before the next lesson unlocks.
- User code is never evaluated with JavaScript `eval` or `Function` in the app. Python subset and domain simulations are strictly bounded; complete Python examples are run in separate, user-controlled local programs.
- An imported malformed backup must not clear the existing snapshot.
- Journals and code persist on each edit and backups include project evidence.
- Animation output must be labeled as computed, guided or externally tested.
- ML's training examples and held-out test examples remain separate during fitting.

## Known non-gates

- Browser settings may block IndexedDB, WebGL or site storage. The app reports storage errors instead of claiming edits were persisted.
- Manually editing IndexedDB or a JSON backup can fabricate local learning progress. This is not intended as a secure certification system.
- The ML demonstration uses six synthetic observations and is not suitable for making educational decisions.
