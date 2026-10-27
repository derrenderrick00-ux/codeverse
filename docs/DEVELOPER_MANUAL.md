# CODEVERSE — Developer & Maintainer Manual

**Target state:** v0.6.1 corrective release candidate on `feature/codeverse-v06`  
**Repository:** `https://github.com/derrenderrick00-ux/codeverse.git`  
**Development system:** Ubuntu 26.04.1, Node 24 LTS, npm 11, Python 3, Git, VS Code  
**Classification:** Educational alpha. It is not a production sandbox for hostile code.

## 1. System intent and operating boundaries

CODEVERSE demonstrates program state, data processing, numeric transformations and model training through a hybrid 2D/3D educational interface. All five worlds share the same nine-step progression model; simulation engines vary by domain. The architecture explicitly separates **source input → deterministic execution / bounded computation → trace or result → stateful visualization**.

The most important invariant is: **never imply real execution where only guided narration or bounded JS computation occurred.** A second invariant is: **a mastered lesson's persisted evidence is immutable under review**.

This branch extends the original 21-topic Python City to 110 ordered lessons: Python 21; SQL 24; Pandas 25; NumPy 24; ML 16. Python's documented subset is not the complete language. This is a learning simulator, not a replacement for standard Python, SQLite, NumPy, Pandas or scikit-learn.

## 2. Build a development environment from Git

For an **existing** clone:

```bash
cd ~/Documents/codeverse
git status
git branch -vv
git fetch origin
git switch feature/codeverse-v06
git pull --ff-only origin feature/codeverse-v06
npm ci
```

For a **fresh** checkout of the premerge release candidate:

```bash
mkdir -p ~/Documents
cd ~/Documents
git clone -b feature/codeverse-v06 https://github.com/derrenderrick00-ux/codeverse.git codeverse
cd codeverse
npm ci
```

After release approval/merge, substitute `main` for `feature/codeverse-v06`.

Check:

```bash
node --version
npm --version
python3 --version
npm run lint
npm test
npm run build
npx playwright install chromium
env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e
```

Run the dev server with `npm run dev`, then use `http://127.0.0.1:5173`. For a static build, use `npm run build` then `npm run preview`. No backend is required for the browser app. The reference Python scripts use a separate optional virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-data.txt
python3 -m unittest discover -s tests_python -v
```

If an optional scientific dependency cannot be installed, the corresponding test may be **skipped**, which must be reported rather than treated as full verification.

## 3. Repository anatomy and ownership

```text
codeverse/
├── CODEVERSE_MASTER_PLAN.md       # Original 0–12 implementation roadmap
├── README.md                       # Maintained Git installation/overview
├── package.json / package-lock.json
├── index.html / vite.config.ts / tsconfig.json
├── playwright.config.ts           # Chromium and Vite webServer
├── src/
│   ├── main.tsx                   # React entry
│   ├── app/
│   │   ├── App.tsx                 # Navigation, Python lesson, challenge, workshop, progress
│   │   ├── DomainLab.tsx           # SQL, Pandas, NumPy, ML lessons
│   │   └── store.ts               # Zustand + serialized IndexedDB writes
│   ├── components/
│   │   ├── editor/CodePanel.tsx    # CodeMirror-controlled content
│   │   ├── navigation/AtlasSafe.tsx, Atlas3D.tsx
│   │   └── simulation/ObjectGraph.tsx
│   ├── engine/
│   │   ├── execution/interpreter.ts # restricted Python teaching tracer
│   │   ├── execution/challenges.ts  # Python build rubrics
│   │   ├── timeline/controller.ts   # deterministic trace cursor
│   │   ├── domains/experiments.ts   # deterministic domain calculations + regression
│   │   ├── domains/evidence.ts      # structured learner evidence validator
│   │   └── learning/hints.ts        # progressive non-answer guidance
│   ├── lessons/catalog.ts / pythonLessons.json
│   ├── worlds/{sql,pandas,numpy,machine-learning}/lessons.json
│   ├── storage/progress.ts          # progress schema, locks, JSON import/export
│   ├── types.ts
│   ├── style.css
│   └── tests/                      # Vitest
├── examples/                       # independent real Python references
├── tests_python/                   # unittest reference assertions
├── e2e/learner.spec.ts             # Playwright browser journeys
├── scripts/verify-release.sh       # non-browser release gate
└── docs/USER_MANUAL.md, DEVELOPER_MANUAL.md, RELEASE_ACCEPTANCE.md
```

**Ownership rules:** UI must not reinvent progression. Use `src/storage/progress.ts` for gating and `src/app/store.ts` for persistence. Calculations belong in the execution engine or domain experiments, not directly in JSX. Curriculum metadata belongs in JSON and its typed catalog loader, not hard-coded navigation links.

## 4. Runtime architecture

```text
Browser entry (src/main.tsx)
  -> App / BrowserRouter / Shell
      -> Zustand useApp.init() --> IndexedDB loadProgress()
      -> Welcome, Dashboard, Atlas, WorldMap, Progress
      -> LessonLab (Python) OR DomainLab (SQL/PD/NP/ML)
            -> progress functions (canOpenStep/finishStep/statusOf)
            -> interpreter.ts / experiments.ts --> Trace/ExperimentResult
            -> Timeline / ObjectGraph / visual panels
            -> challenge rubric / evidence validator / hints
            -> useApp.change() --> applyLearningEdit() --> saveProgress()
```

`AtlasSafe` guarantees 2D navigation. `Atlas3D` is an optional lazily loaded renderer and must not gate access to lesson content. The right-hand laboratory is interactive, but code highlighted as **guided** or **reference** must not be represented as executed Python.

## 5. Data contracts

### 5.1 Lesson

See `src/types.ts` (`Lesson`): `id`, `number`, `world`, `title`, `minutes`, objectives, definitions, explanation, diagram, source, expected, applications, quiz, repair, build, miniProject, mainProject, and `supportedInTracer`. IDs are `py-01`, `sql-01`, `pd-01`, `np-01`, `ml-01`, etc.

All 110 `Lesson` records must have the nine method fields represented in the UI, a four-choice concept question, a four-choice repair question, and correct answer indexes in `[0,3]`. Catalog sorting uses `worldOrder = ['python','sql','pandas','numpy','ml']`. Do not reorder lessons casually: global prerequisite logic depends on this order.

### 5.2 Python trace

`interpreter.ts` declares `Trace {schemaVersion:1, mode:'subset'|'curated', source, events, output}`. A `Snapshot` contains step number, source line, description, conceptual name bindings, objects, stdout and event kind. `Timeline` consumes snapshots and moves the cursor backward/forward without re-executing side effects.

**Parser boundaries:** Maximum source length 6,000 chars, up to 120 lines, at most 100 steps. Supported operations include assignment, Python-style primitive values, simple numeric expressions, lists, indexing, `len`, list `append` and `print`. `UnsupportedSyntax` is thrown on prohibited or unknown expressions. `stripComment` removes inline comments **without deleting `#` characters inside quoted strings**. Tests must cover both cases.

Do not add `eval`, JS `Function`, shell invocation or unrestricted server execution. A future interpreter adapter needs explicit grammar, sandboxing, per-run memory/time budgets and a security review.

### 5.3 Domain ExperimentResult

`experiments.ts` declares `{title,input,output,steps,question,correct,unit,kind}`. `runExperiment(world,opts)` routes to a bounded scenario:

- SQL: five study-session rows filtered by hours and subject.
- Pandas: fixed sessions filtered/grouped/sorted/projected using JavaScript.
- NumPy: six-element numeric arrays with broadcasting, reshape, filter, matrix multiplication or mean.
- ML: linear regression `y ≈ w*x + b` trained with full-batch gradient descent on four observations. Two held-out observations are **not** used for training. Learning rate `(0,0.05]`, epochs `1..200`.

The domain labs use the **same experiment demonstration per world** for many topics; the full language-specific interpreter has not been implemented. Label each result according to this limitation.

### 5.4 Progress and persistence

`Progress` stores `visited`, `completedSteps`, quiz/predict/repair/build/mini/integration flags, `simulationPassed`, attempts, best score, hints, optional saved code/evidence and `updatedAt`. `statusOf(p)` returns: `not-started`, `learning`, `practicing` or `demonstrated`. Demonstrated requires **all nine completed steps plus all relevant flags**.

`canOpenStep(p,s)`: `s=1` or prior step completed. `canFinishStep(p,s)`: steps 1–6 require no extra checks; step 7 requires quiz/predict/repair/simulation success; step 8 requires build/project; step 9 requires `mainDone`. `finishStep()` refuses premature advancement. `canOpenLesson()` checks the preceding *global* lesson's demonstrated status.

When `statusOf(previous)==='demonstrated'`, `applyLearningEdit()` returns `previous` unchanged. This is the write barrier for non-persisting review mode. All new persistent edits must go through `useApp.change()`; do not mutate `Progress` objects directly.

`store.ts` serializes IndexedDB saves with a `pendingWrite` promise chain. The authoritative record lives in `CODEVERSE_DB` > `settings` > `codeverse-progress-v2`; schema v1 is migrated. `makeBackup()`/`parseBackup()` validate a JSON wrapper with `schemaVersion`, `exportedAt` and `progress`. Imports reject malformed records **before** replacing store state. This is **data validation, not account authentication or tamper-proof anti-cheat**.

## 6. End-to-end process contracts (pseudocode)

### 6.1 Start and restore

```text
ON APP MOUNT:
    await loadProgress()       # validate v2 or migrate valid v1
    set(progress, ready=true)  # failures produce visible error
ON ROUTE /lesson/<id>:
    lesson = catalog.find(id)
    if missing -> Not Found
    if predecessor is not DEMONSTRATED -> Mission locked
    else render Python LessonLab or DomainLab
```

### 6.2 Complete checkpoint

```text
advance(currentStep, progress):
    if statusOf(progress) == DEMONSTRATED:
        navigate next visible review step; NEVER write progress
    else:
        assert canOpenStep(progress,currentStep)
        assert canFinishStep(progress,currentStep)
        update(progress = finishStep(progress,currentStep))
        display saved state
        navigate to next checkpoint or next unlocked lesson
```

### 6.3 Python trace

```text
executeSubset(source):
    reject oversized source
    initialize name bindings, object table, stdout, start snapshot
    for every source line:
        strip safe inline comment (respect quoting/escapes)
        skip blank/comment-only lines
        reject indent/unknown statement
        parse assignment OR print OR list.append
        evaluate supported expression, rejecting unknown syntax
        mutate name/object model, or append stdout
        deep-copy conceptual state to next Snapshot
    return Trace(mode='subset',events=snapshots,output=stdout)
```

### 6.4 Student-profile rubric and return

```text
grade(code):
    trace = executeSubset(code)
    inspect FINAL state for required names and types
    assert count total equals completed+pending
    assert percentage equals 100*completed/total (total > 0)
    assert >=4 printed lines with calculated required values
    if passes:
        update project flags and conditionally finish step 8
        await persistence
        navigate /lesson/py-01?step=<nextStudyStep>&milestone=complete
```

### 6.5 Import progress without corruption

```text
parseBackup(fileText):
    reject too-large or malformed JSON
    verify schema is 1 or 2
    validate each lesson ID, all flags, scores and step arrays
    normalize/migrate as required
    return validated map; never mutate current data yet
replace(validatedMap):
    await previously queued saves
    write one validated map to IndexedDB
    only then replace in-memory progress
```

## 7. Nine-step lesson implementation guide

To add a lesson without breaking navigation:

1. Create a typed JSON `Lesson` item with a unique sequential ID and an accurate topic definition.
2. Provide objectives, glossary, explanation, diagram label, source, expected output, applications, quiz, repair, build, mini-project and main-project task.
3. Set `supportedInTracer` accurately. If `false`, use a guided illustration, never counterfeit execution output.
4. Add a specific deterministic test for any new computation or grading rule.
5. Keep global order, unlock logic, and progress schema backwards-compatible.
6. Add a Playwright scenario covering the new lesson's navigation and any new UI control.
7. Run the entire release verification and manually check browser storage and review mode.

**Do not regenerate catalog JSON using scripts without reviewing diffs**. Generated explanations can be too generic, and mastered learners may be unable to complete gates if a necessary execution path does not exist.

## 8. Git workflow and release checklist

Known lineage from developer terminal records:

```text
7b180e5  main — original CODEVERSE Python City alpha
4667da2  feature/codeverse-v06 — gated learning + worlds
f4c4eb1  feature/codeverse-v06 — v0.6.1 review/hints patch (known test failures)
```

This manual accompanies a corrective patch intended to be installed **after** `f4c4eb1`. Do not invent a new commit SHA in documentation; obtain it from `git rev-parse HEAD` after committing.

Recommended release steps:

```bash
git status
git diff --check
npm ci
npm run lint
npm test
npm run build
npm run test:kernel
npm run test:python
npx playwright install chromium
env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e
npm audit
npm audit --omit=dev
```

Record exact **pass/fail/skip** counts and the Git commit under `docs/RELEASE_ACCEPTANCE.md` or your PR. Automated tests alone do not replace manual validation of keyboard navigation, review immutability, chapter gates, milestone return, and IndexedDB backup/restore. Do not claim a passing frontend/browser suite until those checks run on the final source.

The user observed **three npm vulnerabilities (one moderate, two critical)** before this fix. Investigate the advisory tree with `npm audit`; decide on targeted semver-safe upgrades and rerun all tests. Avoid `npm audit fix --force` without understanding the major-version changes.

Once approved:

```bash
git add -A
git commit -m "fix: stabilize CODEVERSE release gates and document installation"
git push origin feature/codeverse-v06
# open PR to main, review, merge after checks; optionally tag an accepted release
```

**Critical privacy boundary:** `CODEVERSE_ENGINEERING_JOURNAL_PRIVATE.md`, its PDF, private-source snapshots and personal backups **must not enter Git tracking**. Keep them in a separate directory outside `~/Documents/codeverse`.

## 9. Browser regression design

`e2e/learner.spec.ts` covers: prereq gating; restoring an existing learner's record; inline-comment project grading; automatic milestone return; five world cards; locked SQL; immutable mastered review; graduated hints.

**Root causes corrected in this patch:**

1. TypeScript inferred `projectCode: string` as required in a local `next` object, but `finishStep()` returns a `Progress` where that field is optional. Declare `let next: Progress` before applying `finishStep()`.
2. A curriculum test hard-coded a generic repair-answer phrase for every topic. Replace it with semantic data-shape checks; let per-topic content vary.
3. The passing workshop deliberately navigates back to the lesson, so an E2E test must navigate to the workshop before inspecting the persisted editor.
4. Writing directly to IndexedDB while the app initializes is a race with the app store. Seed a mastered record through **the validated Import JSON UI**, ensuring IndexedDB and Zustand agree, then test reload/review.

## 10. Operational quality and security

- The current parser enforces a length/step limit but is **not a security sandbox**. Do not treat it as one.
- User code and learning evidence are stored locally. Do not print, collect, or upload them via analytics by default.
- Avoid adding `dangerouslySetInnerHTML` for raw learner content.
- Keep the exported backup versioned and schema-validated; design migrations before changing fields.
- Maintain accessible 2D navigation regardless of GPU/WebGL support.
- Plan bundle splitting: the 3D atlas is lazy-loaded, but the main application bundle still generated >500 kB size warnings on Ubuntu; measure before optimization.
- For offline capability, IndexedDB persists records, but static assets are **not guaranteed offline** without a documented service-worker/cache strategy.
- Consider controlled error boundaries around data-corruption, WebGL or IndexedDB exceptions to avoid a blank screen.

## 11. Troubleshooting runbook

- **TypeScript error around `let next`:** ensure the variable is typed `Progress`, not inferred with a mandatory `projectCode`.
- **Vitest domain answer mismatch:** do not hard-code a universal repair choice; test answer indexes and meaningful nonempty answers.
- **Playwright `executable doesn't exist`:** run `npx playwright install chromium` and unset `CODEVERSE_CHROMIUM_PATH` unless pointing to an installed executable.
- **E2E worksheet source mismatch after pass:** the app auto-returned to the lesson; navigate back to `/workshop` before checking its saved draft.
- **Review mode not appearing in a test:** import a validated mastered record using UI and await confirmation; don't mutate IndexedDB behind an active store.
- **Tests skipped:** install optional scientific dependencies into a venv; rerun and distinguish installed-passed from skipped.
- **`npm audit` warning:** review affected package dependency tree. Don't force major upgrades just to get a green audit.

## 12. Future engineering roadmap and gates

Prioritize completeness and correctness before visual polish: (1) real isolated Python execution and structured traces; (2) real SQL sandbox and query-plan visualization; (3) browser/worker-backed Pandas+NumPy execution with explicit limits; (4) ML dataset uploads, leakage safeguards and reproducible evaluation; (5) more accessible simulations and performance optimization; (6) optional synchronization with explicit consent and security controls; (7) richer integrated Study Intelligence projects and verified external assessment.

Future work is **not implemented** merely because a catalog topic exists. Each feature requires its own threat model, executable acceptance tests, documentation, and measured performance on the 8 GB target laptop.

**Maintainer rule:** Implement → Verify semantics → Add regression test → Run whole suite → Inspect UI → Record findings → Commit → Release.
