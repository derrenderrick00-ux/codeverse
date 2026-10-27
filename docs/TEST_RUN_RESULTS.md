# CODEVERSE v0.6.0-alpha.1 — Recorded test results

Environment: ChatGPT packaging sandbox, Node 22.16.0, Python 3, globally installed TypeScript. Test results below were produced against the source bundle in this archive. These tests are **not** the user's Ubuntu Vite/browser acceptance.

| Command | Result |
|---|---|
| `tsc -p tsconfig.kernel.json` | PASS — zero static errors for core kernel and storage |
| `node scripts/syntax-check.cjs` | PASS — 23 TypeScript/TSX files syntactically parsed |
| `node scripts/kernel-smoke.cjs` | PASS — 29/29 deterministic core checks |
| `bash scripts/smoke-engine.sh` | PASS — 19/19 legacy/revised kernel checks |
| `python3 scripts/verify_lessons.py` | PASS — 20/20 executable Python examples; virtual environments are shell syntax |
| `python3 -m unittest discover -s tests_python -v` | PASS — 8/8 tests including optional pandas/NumPy/scikit-learn checks (available here) |

### Not executed in this sandbox

- `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`. The source environment cannot resolve the public npm registry, and the included v0.5.0 source bundle did not contain installed `node_modules`. These must be run on the user's Ubuntu system after `npm install`.
- Manual GPU/WebGL acceptance. Browser hardware differs from the packaging sandbox.

### Important caveats

Passing the kernel and example checks does not prove every lesson's 9-step learning sequence has been manually browser-tested. The `npm` and Playwright checks are **release gates**, not optional certification details. If they fail, do not merge or tag the feature branch until corrected.
