# CODEVERSE — Visual Programming & Machine Learning Learning Lab

**Current branch:** `feature/codeverse-v06` · **Candidate:** v0.6.1 corrective alpha  
**Architecture:** React 19 + TypeScript + Vite + Zustand + CodeMirror + optional React Three Fiber 3D atlas.  
**Status:** 110 sequential lessons across Python (21), SQL (24), Pandas (25), NumPy (24), and ML (16). This is a bounded educational alpha, **not** an unrestricted language interpreter or production ML application.

**Documentation:** [User Manual](docs/USER_MANUAL.md) · [Developer Manual](docs/DEVELOPER_MANUAL.md) · [Release Acceptance](docs/RELEASE_ACCEPTANCE.md) · [Master Plan](CODEVERSE_MASTER_PLAN.md) · [Architecture](docs/ARCHITECTURE.md).

## Install from Git

After the feature branch is verified and merged to `main`:

```bash
cd ~/Documents
git clone https://github.com/derrenderrick00-ux/codeverse.git
cd codeverse
npm ci
npm run dev
```

Before merge, clone the feature branch instead:

```bash
cd ~/Documents
git clone -b feature/codeverse-v06 https://github.com/derrenderrick00-ux/codeverse.git codeverse
cd codeverse
npm ci
npm run dev
```

Then open **http://127.0.0.1:5173/** (or the URL printed by Vite). If `~/Documents/codeverse` already exists, **do not reclone into it**; check `git status`, fetch, and update the correct branch as described in the manuals.

## Run quality checks

```bash
npm run lint
npm test
npm run build
npm run test:kernel
npm run test:python
npx playwright install chromium
env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e
npm audit
```

The scientific Python examples use a separate optional environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-data.txt
python examples/sql_stage.py
python examples/pandas_stage.py
python examples/numpy_stage.py
python examples/ml_stage.py
```

## Learning journey

Each lesson follows **Objectives → Definitions → Explanation → Illustrations → Code & Simulation → Applications → Exercises → Mini-project → Study Intelligence**. Mandatory checkpoints unlock sequentially. The Student Profile mini-project returns to the learning path on success. Mastered lessons remain available in non-persisting **Review Mode**. Local progress is stored in IndexedDB; export/import backups at **Progress & Mastery**.

## Execution honesty and privacy

- The restricted Python tracer visualizes assignments, simple expressions, lists, indexing, `len`, list mutation, and `print`; it rejects unsupported syntax. Guided traces are **not executed Python**.
- SQL/Pandas/NumPy/ML browser laboratories run explicitly bounded JavaScript computations, not arbitrary code from the respective languages.
- Standalone reference scripts in `examples/` execute real Python/SQLite/Pandas/NumPy/scikit-learn in an optional virtual environment.
- Progress lives in the **current browser origin's IndexedDB**. No accounts, cloud sync, or production sandbox are provided. Avoid committing personal backups or secrets.

**Release note:** The previous v0.6.1 patch at Git commit `f4c4eb1` still had failing TypeScript, Vitest and Playwright tests as reported by the developer. See [Release Acceptance](docs/RELEASE_ACCEPTANCE.md) for the corrective source and the remaining Ubuntu checks. Do not mark the candidate as a verified final release until those tests pass.
