# CODEVERSE v0.6.1-alpha.1 — Corrective patch

## Scope

This patch applies over **CODEVERSE v0.6.0-alpha.1**, the branch `feature/codeverse-v06` at commit `4667da2`. It does **not** replace the five-world curriculum or rewrite the progress database. It changes UI behavior, testing, and completion policy.

### Behavioral changes

- **Milestone 01:** After the Student Profile checker passes, the workshop returns automatically to the next accessible checkpoint in Python Variables. If steps 1–7 were completed, step 8 is recorded as complete and step 9 opens. If earlier checkpoints remain incomplete, CODEVERSE returns to the earliest unfinished step instead of bypassing prerequisites. A milestone confirmation banner appears on the lesson page.
- **Repeat/review:** A `demonstrated` lesson may be reopened indefinitely. All nine steps, code experiments, and challenges are accessible. Persistent state, previous scores, attempts, and evidence are frozen. CODEVERSE explicitly labels these sessions **Review mode — not saved**. This prevents accidental downgrades or fabricated additional progress.
- **Hint ladder:** Concept, repair, and practical activities provide three levels of scaffolding, without revealing the multiple-choice solution. Incorrect challenge answers receive task-oriented feedback instead of instantly exposing the explanation. The starter mini-project hints no longer give the calculation formula.
- **Regression fix:** The multi-world Vitest test no longer assumes every Python quiz's correct option must equal its first glossary definition. Instead it validates the presence of a correct-option string.
- **Browser setup:** Playwright's `CODEVERSE_CHROMIUM_PATH` override now raises a clear error if a specified path does not exist. The preferred path is the Playwright-managed Chromium installation.

### Apply on Ubuntu

In Firefox, export a JSON backup from `/progress` before patching.

```bash
cd ~/Documents/codeverse
git switch feature/codeverse-v06
git status --short             # should be clean
git branch backup/codeverse-v06-before-v061
unzip -o ~/Downloads/CODEVERSE_v0.6.1-alpha.1_HOTFIX.zip
npm install
```

The archive is a small **overlay**, not a new Git repository: it does not contain `.git`, `node_modules`, `dist`, or progress data. Preserve your local `package-lock.json`; `npm install` will reconcile it with the updated version.

### Verification

```bash
npm run lint
npm test
npm run build
npm run test:kernel
npm run test:python
npx playwright install chromium
env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e
```

If the Playwright browser reports missing shared libraries on Ubuntu, try:

```bash
npx playwright install --with-deps chromium
```

The executable `/usr/bin/chromium` did not exist on your Ubuntu installation, so **do not** set `CODEVERSE_CHROMIUM_PATH=/usr/bin/chromium` unless you have confirmed that path exists with `test -x /usr/bin/chromium`.

To cover the previously skipped optional data-science libraries, use an isolated virtual environment rather than installing into system Python:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-data.txt
npm run test:python
```

Python 3.14 package compatibility can vary; a pip wheel/compilation failure should be reported instead of force-installing into the system interpreter.

**Security:** `npm audit` should be reviewed separately. Do not automatically run `npm audit fix --force`, which can install breaking major versions. For runtime-only findings start with `npm audit --omit=dev`.

### Acceptance checks

1. Begin Lesson 1, complete checkpoints 1–7, finish the Student Profile mini-project in the workshop. You must land back at Python Variables step 9 with milestone confirmation and a stored step-8 completion.
2. If the Student Profile is completed before earlier learning checkpoints, ensure CODEVERSE redirects to the earliest unfinished checkpoint (never unlocks step 9 prematurely).
3. Complete all nine checkpoints, revisit the lesson, and repeat a challenge. Refresh, inspect `/progress`, and confirm the previous stored score, code, attempts, and mastered status remain unchanged.
4. Request Hint 1, then Hint 2 and Hint 3. Confirm guidance is graduated and does not provide a correct letter, answer text, or complete code.
5. Complete the browser regression tests and use Export JSON → Import JSON on valid progress data. Verify a malformed backup is rejected.
6. Verify the existing SQL/Pandas/NumPy/ML world maps still work and locked chapters remain inaccessible.

### Publishing

After acceptance:

```bash
cd ~/Documents/codeverse
git status
git add -A
git commit -m "fix: review mode, milestone resume, graded hints and test reliability"
git push origin feature/codeverse-v06
```

Do not merge `main` while browser tests are red. Keeping `feature/codeverse-v06` as the candidate branch is intentional.

### Revert this patch only

```bash
cd ~/Documents/codeverse
git restore .
git clean -nd               # inspect files first
# If the patch was committed, use git revert <patch-commit-sha> instead.
```

`git clean` is **not** required for reverting and may delete untracked work; do not execute it blindly.
