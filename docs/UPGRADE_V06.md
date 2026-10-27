# CODEVERSE v0.6.0-alpha.1 — Upgrade from commit 7b180e5

This release **extends the user's existing Phase 0–8 baseline**. Do not delete `.git`, `node_modules`, or your browser storage. The source archive has no `.git` directory and must be extracted into the **current project root**.

## What changed

- Fixed Python subset parsing of inline comments (`total = completed + pending # TODO`), preserving literal `#` in quoted strings.
- Nine stages are sequential: explicitly complete checkpoint N before opening N+1; steps 7–9 require evidence.
- Every lesson unlocks only when its immediate predecessor has all nine checkpoints and prerequisite assessment/project evidence recorded. The five worlds form one ordered 110-lesson sequence.
- Local IndexedDB v2 storage migrates v1 records, preserves journal entries and code, resumes at the next unfinished checkpoint and validates v1/v2 backups.
- SQL: 24 reference topics; computed SELECT/WHERE dataset experiment; real SQLite command-line examples.
- Pandas: 25 reference topics; computed JavaScript DataFrame-like grouping/filtering/sorting/cleaning experiments; real Pandas examples.
- NumPy: 24 reference topics; computed matrix, broadcast, masking and reduction experiments; real NumPy examples.
- ML: 16 reference topics; actual JavaScript gradient descent with a train/test split and loss plot; real scikit-learn example.
- The student-profile workshop remains checked by deterministic Python subset calculations. Later complete-Python syntax and full domain snippets are *not* executed by the browser. Local evidence is self-reported, never represented as interpreter-verified.
- Recorded engineering journals require a topic and `input → output → validation` structure. They are **structured checks of evidence format**, not authentication of external code.

## Preserve the baseline and apply the source archive

Stop Vite with Ctrl+C. Then:

```bash
cd ~/Documents/codeverse
# Verify existing project and baseline first.
git status
git log -1 --oneline
# Only continue when the worktree is clean. Back up any uncommitted work first.
git branch backup/codeverse-before-v06
# Keep the upgrade off main until it passes tests.
git switch -c feature/codeverse-v06
# Download CODEVERSE_v0.6.0-alpha.1_PATCH.zip into Downloads.
unzip -o ~/Downloads/CODEVERSE_v0.6.0-alpha.1_PATCH.zip
npm install
bash scripts/verify-release.sh
```

If npm dependencies are already installed but `npm install` fails due to the registry, do not delete `node_modules`; resolve your connection and rerun.

## Run

```bash
npm run dev
```

Open `http://127.0.0.1:5173`. A normal profile loaded from v0.5 should retain saved code/journals and visited checkpoints. v1 visits to instructional steps 1–6 migrate as completed reading checkpoints; steps 7–9 require evaluation unless legacy mastery had already been demonstrated.

## Browser acceptance (run after main test suite)

```bash
npx playwright install chromium
npm run test:e2e
```

Or, if Chromium is already installed on Ubuntu:

```bash
CODEVERSE_CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
```

Check browser WebGL mode separately, because graphics-driver availability varies. Default 2D navigation does not depend on WebGL.

## Manual checks

1. Visit `/lesson/py-02` on a clean browser profile: **Mission locked**.
2. Visit `/lesson/py-01`: Steps 2–9 initially disabled. Complete Step 1. Step 2 becomes available, Step 3 remains disabled.
3. Refresh: Step 2 resumes, Step 1 stays complete.
4. Attempt Step 7 before finishing Step 6: locked. After Step 6, the actual quiz/practical assessment is mandatory.
5. Project Workshop: replace `total` and `percentage` with correct expressions *leaving the inline `# TODO` comments*. `Run project checks` must report successful grading.
6. Refresh Workshop: code persists.
7. Try malformed backup JSON in Progress: import should show an error without deleting existing records. Export and re-import a genuine v2 backup.
8. View each World Atlas entry (SQL/Pandas/NumPy/ML) and check topic count and locked status.
9. Enter unlocked domain lessons only after completing Python prerequisites (there is deliberately **no bypass** through direct URLs). For development-only checks, run unit tests rather than modifying browser progress artificially.
10. In an unlocked domain lab, run the experiment, change the threshold and confirm the computed result changes; submit concept, repair, prediction, journal and integration evidence before the next mission opens.
11. In Machine Learning, change the learning rate and epoch count; inspect the training-loss plot and held-out MAE. The six-point synthetic example is educational only.
12. Disable 3D or use a browser without WebGL: the World Atlas still has working 2D cards.

## Git commit after validation

```bash
cd ~/Documents/codeverse
git status
git add -A
git commit -m "feat: gate CODEVERSE progression and add SQL Pandas NumPy ML learning labs"
git push -u origin feature/codeverse-v06
# After completing and reviewing Ubuntu/browser acceptance:
git switch main
git merge --no-ff feature/codeverse-v06
git push origin main
# Tag only after confirmed acceptance.
git tag v0.6.0-alpha.1
git push origin v0.6.0-alpha.1
```

## Rollback

```bash
cd ~/Documents/codeverse
git switch main
# Before merging, main still points at the previous accepted baseline.
```

If already merged, restore on a new branch from `backup/codeverse-before-v06` rather than running a destructive `git reset --hard` against committed work. The old IndexedDB v1 data is preserved; v2 data is stored under a new key, so do not clear site storage.

## Known limitations / acceptance state

- Browser-based arbitrary Python/SQL/Pandas/NumPy execution is intentionally **not implemented**. Domain labs offer bounded computations, and complete syntax examples run via the optional Python reference programs.
- The advanced Python local proof and applied integration journals are **self-reported**, not independently code-tested. They should not be confused with automated project grading.
- Only the stage-specific example harnesses are computationally validated; not every syntax entry in the 110-topic catalog is directly interpretable in the browser.
- Small training set means loss and MAE values are demonstrations, not useful predictive performance.
- Browser Playwright tests and actual npm lint/Vite bundle builds must run on the user's Ubuntu computer; the packaging environment has no network access to install JavaScript dependencies.
