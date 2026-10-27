# CODEVERSE v0.6.0-alpha.1 — Lockstep learning and five-world laboratories

Baseline: v0.5.0-alpha.1, user's first pushed commit `7b180e5`.

- **Fixed:** inline `# TODO` comments after arithmetic assignments in Python tracer no longer become part of the expression.
- **Added:** nine-step sequential gates and cross-lesson prerequisites; route guarding; progress resume and explicit checkpoint completion.
- **Added:** IndexedDB schema v2, v1 migration, safe exports/imports, persisted journals.
- **Added:** SQL (24), Pandas (25), NumPy (24), ML (16) lesson libraries, each using the nine-part teaching method, plus the Python world (21), totaling **110 missions**.
- **Added:** reproducible, bounded data transformation experiments, real JavaScript gradient descent and a training loss plot.
- **Added:** real Python command-line reference programs for SQLite, Pandas, NumPy and scikit-learn, plus Python standard-library and optional scientific tests.
- **Added:** core regression smoke suite, Vitest cases, browser acceptance tests, upgrade/rollback guide and test matrix.

**Limitations:** Actual unrestricted code execution for complete Python/SQL/Pandas/NumPy and authoritative automated grading for advanced exercises remain out of scope. Structured journals and learner-confirmed terminal evidence are not code-verification mechanisms. Full browser and Vite build acceptance still requires the Ubuntu test run.
