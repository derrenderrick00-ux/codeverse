# CODEVERSE — User Manual

**Edition:** v0.6.1 release candidate (source on `feature/codeverse-v06` until merged)  
**Platform:** Ubuntu / desktop browser; a 2D alternative is always available.  
**Scope:** Five-world educational alpha; 110 ordered lessons; some activities use simulations or learner-reported external work instead of unrestricted execution.

> **Start here:** CODEVERSE is a visual learning laboratory, not a general-purpose Python interpreter or hosted Jupyter notebook. The Python tracer runs a restricted subset. SQL, Pandas, NumPy and ML panels calculate bounded educational examples. Complete external assignments in your own Python environment when the screen identifies them as local evidence.

## 1. What you will learn

CODEVERSE follows a five-stage sequence: **Python City (21 lessons) → SQL Underground (24) → Pandas Analytics Lab (25) → NumPy Matrix Dimension (24) → Machine Learning Nexus (16)**. Each lesson uses nine checkpoints, in this order:

1. **Objectives** — what you must be able to do.
2. **Definitions** — precise vocabulary.
3. **Explanation** — causal, step-by-step reasoning.
4. **Illustrations** — visual models of the operation.
5. **Code and simulation** — inspect reference code and execute supported experiments.
6. **Applications** — examples from real software and data systems.
7. **Exercises** — prediction, misconception repair, and practical evidence.
8. **Mini-project** — implement or document an independently tested small artifact.
9. **Study Intelligence** — integrate the concept into the long-running application.

**Progression:** A checkpoint opens after the previous checkpoint has been completed; assessment checkpoints additionally require their checks. The next lesson unlocks only after the previous lesson reaches **Demonstrated** status. A completed lesson is freely revisitable in *Review Mode*, but new review attempts do not alter saved mastery, attempts, scores, or project evidence.

## 2. Installing from GitHub on Ubuntu

### 2.1 Prerequisites

Recommended for the supplied Ubuntu setup: Node.js 24 LTS, npm 11, Git, VS Code, and Python 3. You should have a browser with JavaScript enabled, sufficient disk space, and a network connection for the first npm dependency installation. At least 2 GB of free disk space is a reasonable minimum; 8 GB RAM is enough when using the standard 2D view. **No login or API key is required.**

Check the basics:

```bash
node --version
npm --version
git --version
python3 --version
```

If Node.js is missing, install a supported LTS version using the Node.js distribution method you trust. Do not randomly overwrite a working Node installation.

### 2.2 Clone the repository

Once the documented release has been merged into `main`:

```bash
mkdir -p ~/Documents
cd ~/Documents
git clone https://github.com/derrenderrick00-ux/codeverse.git
cd codeverse
```

**Before the merge**, use the tested feature branch instead:

```bash
cd ~/Documents
git clone --branch feature/codeverse-v06 \
  https://github.com/derrenderrick00-ux/codeverse.git codeverse
cd codeverse
```

> If the folder already exists, **do not clone over it**. Run `cd ~/Documents/codeverse && git status && git branch --show-current` and follow the update procedure below.

### 2.3 Install and launch

```bash
npm ci
npx playwright install chromium   # only needed for automated browser tests
npm run dev
```

In Firefox or Chromium open **http://127.0.0.1:5173/**. Vite prints the actual URL if this port is occupied. `npm ci` installs versions from the committed lockfile; it does not erase your browser's IndexedDB progress.

For a production-mode local smoke test:

```bash
npm run build
npm run preview
```

`npm run preview` serves built assets for a local verification; it is not a configured Internet-facing deployment.

### 2.4 Optional Python data-science setup

Python reference scripts are **separate from the browser app**. In Ubuntu:

```bash
sudo apt install python3-venv     # only if the venv module is unavailable
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements-data.txt
```

Run one of these to connect the course with actual libraries:

```bash
python examples/sql_stage.py
python examples/pandas_stage.py
python examples/numpy_stage.py
python examples/ml_stage.py
python examples/study_intelligence.py --db /tmp/codeverse-study.db --csv /tmp/codeverse-study.csv
```

On some machines the newest system Python may not have compatible binary wheels for every optional scientific dependency yet. If a library cannot be installed, use a compatible isolated Python version instead of modifying system Python or using `sudo pip`.

## 3. Getting started: first session

1. Open **Welcome** and select **Enter Mission Control**.
2. Select **Python City** or the **World Atlas**.
3. Start **Variables**, lesson `py-01`.
4. Read **Objectives**, choose **Complete & continue**, then read **Definitions**.
5. Continue through Explanation, Illustrations, Code and Applications.
6. In the execution laboratory, predict what `x = 10; y = x; x = 20` will show, then use the step buttons and inspect references. The expected printed result is `20`, then `10`.
7. In **Challenge Arena**, attempt concept and repair questions and the required code/build task. Use **Request a hint** for progressively stronger guidance; hints are not complete answers.
8. Visit **Project Workshop** for the first Student Profile milestone. Correct its assignment-count and percentage calculations; choose **Run project checks**.
9. On a passing milestone the app returns you to your next unlocked learning checkpoint. Complete Study Intelligence evidence to demonstrate the topic and unlock the next lesson.

The nine checkpoints are a **learning contract**, not a timer or video watch requirement. Read-only guided content and external examples are labeled honestly. Scores and checkpoints persist in your browser profile.

## 4. Navigation reference

| Screen / route | Main function |
|---|---|
| `/` | Welcome and entry |
| `/dashboard` | Mission Control, current lesson, progress overview |
| `/atlas` | Five world cards, optional 3D atlas |
| `/world/python` (also `sql`, `pandas`, `numpy`, `ml`) | Ordered topic map with locked, active, and completed lessons |
| `/lesson/py-01` | Nine-step Python lesson and execution timeline |
| `/lesson/sql-01` etc. | Nine-step domain lesson and computed experiment |
| `/challenge/py-01` | Predict / Repair / Build checks for Python topics |
| `/workshop` | Study Intelligence Student Profile milestone |
| `/progress` | Status, backup export/import, topic directory |

**Navigation tip:** If a lesson says *Mission locked*, open the previous lesson and finish its remaining checkpoints. Browsing the atlas does not override prerequisites.

## 5. Understanding the simulation controls

In a supported Python lesson:

- **Run subset** processes supported source and creates an ordered execution trace.
- **Previous / Next / Restart / Play / Pause / Speed** control playback of a recorded trace.
- **Object Graph** depicts conceptual Python name-to-object references; its object IDs are teaching-model identifiers, not actual RAM addresses.
- **Output** displays what the **supported subset** printed at the current point.
- **Reset code** restores the lesson's reference snippet; save evidence through the challenge/checkpoint workflow.

Examples outside the supported Python subset use **Guided Trace**. Its visualized narration and expected output are **illustrations**, not claims that complete Python code was run by the browser.

The four later worlds provide real computations over fixed small datasets: row filtering in SQL, row transforms in Pandas, numeric operations in NumPy, and gradient descent plus held-out testing in ML. They **do not parse arbitrary language-specific source snippets**.

## 6. Challenge Arena and hints

**Concept** checks your understanding of the topic. **Repair** checks whether you can identify the corrected statement. **Build** evaluates a supported Python program or records local evidence for unsupported advanced code. In later worlds the third exercise can require predicting a computed numerical result.

Hints have three levels: identify the relevant question, guide inspection, then suggest a debugging method or boundary test. They intentionally do not display the multiple-choice solution. Try at least one independent attempt before using all three hints.

A Python build failure may indicate unsupported syntax rather than incorrect real Python. Check the *subset* label. For unsupported constructs, run the code in your own Python terminal, record actual output, and submit explicitly labeled learner-attested evidence where allowed. **A passed local evidence format is not proof of interpreter-executed correctness.**

## 7. Milestone workshop and automatic return

The first milestone is **Student Profile**. It asks for non-empty `name`, `university`, and `course` strings; a positive integer `year`; nonnegative `completed`/`pending` counts; calculated `total` and `percentage`; and at least four meaningful output lines.

A successful check records `projectDone` and `buildPassed` (unless you are already in immutable review mode) and returns to the next unlocked learning checkpoint. Passing early **does not bypass** missing earlier steps. If the lesson is fully mastered, you can explore the workshop without changing its stored evidence.

Example valid calculations (write and understand them yourself):

```python
total = completed + pending
percentage = 100 * completed / total  # valid when total > 0
```

The current demonstration rubric requires a positive total. Extend the future workshop to support a zero-total policy if the curriculum needs it.

## 8. Saving progress, resuming, and reviewing

- CODEVERSE stores progress under **IndexedDB / `CODEVERSE_DB` / `settings` / `codeverse-progress-v2`** in the *browser profile and origin* you are using.
- Visit **Progress & Mastery** and select **Export JSON** to make a backup (`codeverse-progress-v2.json`). Store it outside the repository; it may contain your submitted work.
- To restore, choose **Import JSON**, select the backup, and wait for the validation confirmation. The import is version-checked; malformed files are rejected without replacing current progress.
- The app can migrate its earlier v1 schema. Imported progress may contain your original project code and written evidence.
- **Completed lessons** are intentionally read-only in the progress store. You may navigate, run simulations and retry locally, but reviews do not change original mastery data.

**Important limits:** Clearing site data, private browsing, switching browsers, changing the website origin, or deleting the browser profile may make your progress appear missing. A Vite URL on another hostname/port is a different origin. Automatic cloud sync is not implemented. Export backups regularly.

## 9. Settings, accessibility, and low-RAM mode

CODEVERSE defaults to **2D**. The top-bar toggle enables an optional 3D atlas, which loads extra assets. If animation performance is poor, return to 2D. The motion toggle reduces visual activity and the app also reads the browser's reduced-motion preference. Content access does not require WebGL.

The UI is **desktop-first**. Keyboard focus, screen-reader labels, and responsive layout should be checked on each release. Do not assume full WCAG certification merely because a 2D fallback exists.

## 10. Troubleshooting and errors

| Problem | Diagnostic action |
|---|---|
| `npm: command not found` | Verify Node/npm installation and shell PATH. |
| `EADDRINUSE` / port occupied | Close the other Vite process; use the URL printed by your current server. |
| `Mission locked` | Finish prerequisite lesson including steps 7–9. |
| `UnsupportedSyntax` | The subset tracer cannot run that statement; use the guided view or local Python. |
| Work missing after browser restart | Check exact browser/profile/origin and import your exported JSON. |
| Import rejected | Verify that the JSON is the CODEVERSE export with supported schema and valid records. |
| 3D is slow or blank | Use 2D mode; check WebGL support/graphics drivers. |
| Playwright browser missing | `npx playwright install chromium`, then `env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e`. |
| npm reports vulnerabilities | Run `npm audit` and `npm audit --omit=dev` for details; do **not** blindly run `npm audit fix --force`. |
| `python -m pip` fails due to managed system environment | Activate a virtual environment and retry without `sudo`. |

## 11. Updating a clone safely

First **export progress from the app**. Then:

```bash
cd ~/Documents/codeverse
git status
git branch --show-current
git fetch origin
```

When the release is merged to main and the working tree is clean:

```bash
git switch main
git pull --ff-only origin main
npm ci
npm run lint
npm test
npm run build
```

If your working tree has modifications, **do not run `git reset --hard`**. Commit/stash the changes or make a backup first. Browser IndexedDB is separate from the Git checkout, but export progress before significant upgrades.

## 12. Known alpha limitations

- The Python tracer is deliberately incomplete: no arbitrary loops, functions, classes, files, imports, or full Python semantics.
- The data worlds' experiments use small fixed datasets rather than interpreting all SQL or Pandas/NumPy commands.
- Some advanced evidence is learner-attested, not automatically checked against external files.
- ML training is a small numeric demonstration, not a validated real-world grade predictor or deployed AI.
- No user accounts, hosted sync, server-side grading, or guaranteed offline asset caching are included.
- Browser/React release acceptance must be completed against the exact commit being distributed.

**Learning rule:** Read → Predict → Run or observe → Explain → Build → Test → Record evidence → Advance.
