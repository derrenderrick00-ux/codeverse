# CODEVERSE — Master Implementation Plan

**Document version:** 1.0  
**Project:** CODEVERSE — Interactive Programming and Machine Learning Simulator  
**Status:** Architecture and project structure approved; implementation not started  
**Target:** Desktop-first hybrid 2D/3D web application, optimized for an 8 GB Ubuntu laptop  
**Learning sequence:** Python → SQL → Pandas → NumPy → Machine Learning  
**Guiding principle:** Every visualization must accurately explain a computational operation.

---

## 1. Vision and boundaries

CODEVERSE is an interactive, trace-driven educational simulator. Learners read, predict, execute, inspect, experiment, solve, and build. The 3D atlas supports discovery; the 2D/3D laboratory explains execution. Visual presentation never substitutes for correct execution semantics.

### Primary goals
- Follow the ordered five-world curriculum, beginning with Python Variables.
- Apply the nine-step learning method to each substantive topic.
- Synchronize code, structured events, timeline snapshots, output, and visualizations.
- Preserve local progress with validated import/export.
- Keep core learning usable with keyboard navigation, reduced motion, and no WebGL.
- Build the integrated **Study Intelligence** application progressively.

### Non-goals for v0.1.0
- Arbitrary unrestricted Python execution; full language coverage; cloud accounts; multiplayer; full SQL/Pandas/NumPy/ML runtimes; hosted AI tutor; voice narration; real-time collaboration.

### Decision record
| ID | Decision | Rationale |
|---|---|---|
| ADR-001 | Hybrid 2D + 3D | Cinematic navigation without compromising code readability |
| ADR-002 | React + TypeScript + Vite | Modular typed web application |
| ADR-003 | React Three Fiber / Three.js | Lazy-loaded 3D atlas |
| ADR-004 | SVG/React simulation panels | Precise, accessible explanatory diagrams |
| ADR-005 | Deterministic trace-first MVP | Correctness before general-purpose interpreters |
| ADR-006 | IndexedDB + schema-validated JSON backup | Offline-first progress without accounts |
| ADR-007 | Separate execution, simulation, and rendering | Testable behavior independent of animation |
| ADR-008 | One vertical slice before full curriculum | Avoid premature complexity |

---

## 2. Learning architecture

Every lesson follows this **exact nine-step method**:

1. **Topic and objectives** — observable competencies and prerequisites.
2. **Definitions** — accurate terms and glossary examples.
3. **Step-by-step explanation** — incremental reasoning and checkpoints.
4. **Illustrations/diagrams** — faithful representations of state and relationships.
5. **Code/examples** — executable or explicitly labeled curated examples with expected output.
6. **Real-world applications** — authentic engineering and data scenarios.
7. **Exercises** — predict, repair, build; automated checks and useful hints.
8. **Topic mini-project** — independently implemented, testable deliverable.
9. **Integrated main project** — add functionality to Study Intelligence.

**Completion:** Required learning sections visited, assessment threshold met (default 80%), practical tasks verified, and relevant project checkpoint completed. A quiz pass alone does not establish practical mastery. Preserve attempts, hints used, latest result, and best result.

### Worlds and stage projects
| World | Focus | Stage project |
|---|---|---|
| 1. Python City | Variables, types, collections, flow, functions, OOP, modules, files, environments | Python CLI Study Tracker |
| 2. SQL Underground | Querying, joins, grouping, schema, indexes, transactions | Student Management Database |
| 3. Pandas Analytics Lab | DataFrames, selection, cleaning, grouping, merges, time data | Student Performance Analytics |
| 4. NumPy Matrix Dimension | Arrays, shapes, slicing, broadcasting, statistics, matrices | Numerical Data Analysis Engine |
| 5. Machine Learning Nexus | Math, regression, classification, evaluation, optimization, neural networks, deployment | Study Performance Predictor |

**Curriculum source of truth:** A versioned lesson catalog with stable world/topic/lesson IDs. Preserve the original cheat-sheet ordering within the first four worlds; add prerequisite material with explicit tags, without silently renumbering core topics.

---

## 3. Screen inventory

| ID | Screen | Required behavior |
|---|---|---|
| S01 | Welcome | Start, resume, skip intro, reduced-motion support |
| S02 | Mission Control | Current lesson, world progress, project access |
| S03 | World Atlas | Five world nodes, lazy 3D, equivalent 2D list |
| S04 | Topic Map | Ordered lessons, prerequisites, status, estimated effort |
| S05 | Learning Laboratory | Editor, trace viewport, output, explanations, timeline controls |
| S06 | Challenge Arena | Predict/repair/build, hints, test feedback |
| S07 | Project Workshop | Requirements, saved code, test evidence, milestones |
| S08 | Progress & Mastery | Nine-step completion, scores, attempts, topic mastery |

**Desktop:** Resizable code/visualization/explanation panes. **Mobile:** Tabs, readable code, 2D-first. No essential task may depend on camera movement.

---

## 4. System architecture

```text
React UI + Router + CodeMirror + Learning Panels
         |                     |
         v                     v
3D Atlas (lazy R3F)       SVG/2D Renderer
         \                     /
          Simulation Controller
                  |
       Timeline + State Snapshots
                  |
          Execution Adapter
                  |
        Curated Trace Catalog
                  |
    Lesson Catalog + Test Evaluator
                  |
       IndexedDB Persistence
```

### Component responsibilities
- **Execution adapter:** Validate supported input; produce typed events and output or an explicit unsupported/error response.
- **Simulation controller:** Convert events to immutable state snapshots, handle seek/play/pause/restart, never infer missing events.
- **Renderer:** Render supplied state; no semantic mutations or execution decisions.
- **Lesson engine:** Deliver nine-step content, prerequisites, assessments, and project milestones.
- **Persistence:** Versioned local records, atomic import validation, export and recovery.
- **UI shell:** Routing, keyboard interaction, settings, focus and accessibility.

### Trace contract (conceptual)
```json
{
  "schemaVersion": 1,
  "runId": "run-example-001",
  "language": "python",
  "sourceHash": "example-hash",
  "events": [
    {"step": 1, "line": 1, "kind": "name_bound", "name": "x", "objectId": "obj-10"}
  ],
  "snapshots": [
    {"step": 1, "bindings": {"x": "obj-10"}, "objects": {"obj-10": {"type": "int", "value": 10}}, "stdout": []}
  ]
}
```

**Invariants:** Sequential step indices; event lines map to source lines; every referenced object exists in the relevant snapshot; stdout order is stable; snapshots are immutable; invalid traces fail validation. The initial trace engine accepts a documented subset of statements and refuses unsupported constructs rather than fabricating output.

### Python Variables reference scenario
```python
x = 10
y = x
x = 20
print(x)
print(y)
```
Expected stdout:
```text
20
10
```
At step 2, `x` and `y` reference the same integer object. At step 3, `x` references 20 while `y` still references 10. Timeline backward navigation replays recorded snapshots; it does not reverse side effects.

### Future runtime adapters
- Python: evaluate browser-based runtime feasibility (e.g., Pyodide) with trace instrumentation; sandbox and resource controls remain mandatory for untrusted code.
- SQL: isolated SQLite/PostgreSQL data fixtures.
- Pandas/NumPy: constrained Python computation adapters.
- ML: bounded model training with recorded loss/metrics, seeded reproducibility, train/validation/test separation.

---

## 5. Approved repository layout

```text
codeverse/
├── public/
│   └── assets/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── navigation/
│   │   ├── editor/
│   │   ├── simulation/
│   │   └── learning/
│   ├── worlds/
│   │   ├── python/
│   │   ├── sql/
│   │   ├── pandas/
│   │   ├── numpy/
│   │   └── machine-learning/
│   ├── engine/
│   │   ├── execution/
│   │   ├── timeline/
│   │   └── visualization/
│   ├── lessons/
│   ├── storage/
│   ├── tests/
│   └── main.tsx
├── docs/
├── package.json
└── vite.config.ts
```

**Implementation convention:** Add `types/`, `fixtures/`, `accessibility/`, and test-support subfolders only when required. Avoid speculative scaffolding.

---

## 6. Implementation phases and gates

### Phase 0 — Environment and reproducibility (NO product code)
**Tasks:** Audit Ubuntu, Node/npm, Git, VS Code, browser, storage, memory; choose project directory; check npm registry connectivity; confirm Git identity; record versions; set baseline smoke-check commands; confirm no secrets committed.

**Outputs:** `docs/ENVIRONMENT.md` with actual versions, installation gaps, reproducibility commands, and a go/no-go report.

**Exit criteria:** Supported Node LTS or compatible current Node; npm and Git work; VS Code opens a folder; browser supports WebGL or 2D fallback; npm registry accessible; at least 2 GB free disk space recommended for development; working Git identity; no installation blockers. If offline, document which steps are deferred.

### Phase 1 — Foundation and navigation
**Tasks:** Vite React TypeScript app, Tailwind, routing, design tokens, eight screen shells, five-world metadata, lazy-loaded atlas, 2D navigation fallback, error boundary, reduced-motion option, test harness.

**Exit criteria:** Clean build; routes load; 3D optional; 2D navigation and keyboard path work; no blocking console errors.

### Phase 2 — Deterministic simulation core
**Tasks:** Typed trace schema, validators, object graph, immutable snapshots, seek/play/pause/reset, error states, reference fixtures, unit tests.

**Exit criteria:** The Python Variables reference scenario produces correct bindings and output; replay is deterministic; malformed traces are rejected; unit tests pass.

### Phase 3 — Learning laboratory
**Tasks:** CodeMirror editor, code/output panels, highlighted current line, SVG object/reference visualization, step controls, speed control, explanation synchronization, supported-syntax messaging.

**Exit criteria:** Editor, event timeline and visual state remain synchronized; invalid/unsupported edits receive clear feedback; keyboard controls work.

### Phase 4 — Nine-step Python Variables lesson
**Tasks:** Lesson schema, glossary, objectives, explanation, diagrams, curated examples, real applications, checkpoints, topic mini-project instructions, Study Intelligence milestone.

**Exit criteria:** All nine steps present and navigable; source content and expected outputs reviewed; lesson can be completed through the UI.

### Phase 5 — Challenges and project workshop
**Tasks:** Predict/repair/build challenge types; deterministic grading fixtures; hints; student-profile mini-project; integrated project checkpoint; error feedback.

**Exit criteria:** At least one passing and failing test for each challenge mode; no answer leakage in default hints; project checklist works.

### Phase 6 — Persistence and mastery
**Tasks:** IndexedDB schema, progress writes, attempt history, mastery calculations, versioned JSON export/import, malformed data handling, reset confirmation.

**Exit criteria:** Refresh retains state; import/export round trip succeeds; invalid import leaves existing records intact; mastery status matches evidence.

### Phase 7 — QA, accessibility and v0.1.0 release
**Tasks:** Vitest unit/integration tests; Playwright learner journey; keyboard/a11y checks; 2D-only test; reduced-motion test; target-device performance review; docs and release package.

**Exit criteria:** All 12 MVP criteria below verified with recorded evidence; build and test commands pass; release notes identify known limitations.

### Phase 8 — Python expansion (v0.2–v0.5)
**Tasks:** Add types/collections, control flow, functions/call stacks, OOP, modules, files, and remaining Python syllabus. Introduce more capable execution only with appropriate isolation and trace fidelity.

**Exit criteria:** Each topic meets the nine-step lesson contract, correct traces, exercises, project integration and regression tests.

### Phase 9 — SQL world (v0.6+)
**Tasks:** Relational model, SELECT/WHERE, joins, grouping, advanced queries, schema and transaction visualizations; controlled SQL adapter.

**Exit criteria:** Query results agree with reference database fixtures; join/aggregation explanations are correct.

### Phase 10 — Pandas world
**Tasks:** DataFrame inspection, selection, filtering, missing data, merges, grouping, time series, stage analytics project.

**Exit criteria:** Visual transforms match reproducible Pandas fixture outputs.

### Phase 11 — NumPy world
**Tasks:** Arrays, shapes, indexing, broadcasting, vectorized operations, descriptive statistics, matrix multiplication.

**Exit criteria:** Shapes, element values, broadcasting compatibility and outputs match NumPy fixtures.

### Phase 12 — Machine Learning Nexus and v1.0
**Tasks:** ML foundations, probability/statistics/linear algebra/calculus refreshers, regression/classification, evaluation, leakage, gradient descent, neural networks, model serving, integrated predictor.

**Exit criteria:** Training runs are reproducible within stated tolerances; datasets are split correctly; metrics and predictions match reference tests; educational claims disclose model limitations.

**Rule:** Do not start the next phase until the current phase's exit criteria are met or a documented exception is accepted.

---

## 7. MVP acceptance matrix (v0.1.0)

| ID | Requirement | Verification |
|---|---|---|
| AC-01 | Eight screens navigable | Browser journey test |
| AC-02 | 3D atlas + equivalent 2D path | WebGL on/off manual tests |
| AC-03 | Complete nine-step Variables lesson | Content schema audit |
| AC-04 | Accurate trace and stdout | Reference unit tests |
| AC-05 | Run/pause/step/back/restart/reset | Controller tests |
| AC-06 | Supported code editing and explicit unsupported feedback | Editor integration tests |
| AC-07 | Predict/repair/build challenges | Pass/fail fixture tests |
| AC-08 | Student-profile mini-project | Functional checks |
| AC-09 | Persistent progress + validated JSON backup | Refresh and import/export tests |
| AC-10 | Graceful invalid-code/data recovery | Negative tests |
| AC-11 | Keyboard/reduced-motion/2D fallback | Accessibility smoke tests |
| AC-12 | Automated suite + manual release gate pass | Recorded QA report |

---

## 8. Security, correctness, and accessibility requirements

- Never execute arbitrary learner code in the app server process.
- Label curated/simulated traces clearly; do not claim real interpreter execution when absent.
- Validate all import files and trace schemas; avoid HTML injection in lesson/code output.
- Put resource/time limits on future execution adapters and disable unnecessary network access.
- Do not embed API keys or secrets in frontend code or repository.
- Support keyboard navigation, readable focus indicators, text equivalents and reduced motion.
- Use semantic color-independent status indicators; 3D is optional.
- Store progress locally by default; clearly describe data deletion and backup behavior.

---

## 9. Testing and quality strategy

**Unit:** Event validators, reducers, state invariants, scoring, schema migration.  
**Integration:** Editor → execution adapter → timeline → visualization → persisted progress.  
**End-to-end:** Welcome → atlas → Python topic → lesson → challenge → project → progress → export/import.  
**Negative:** Unsupported code, invalid trace, malformed JSON, WebGL unavailable, browser reload, interrupted write.  
**Manual:** Keyboard navigation, narrow screen, reduced motion, target ThinkPad performance, meaningful visual explanations.

**Release evidence:** `docs/QA_RELEASE_GATE.md` with commands, outputs, pass/fail results, known issues, and commit identifier.

---

## 10. Definition of done

A phase is complete only if its functionality works, automated tests pass, error paths are covered, documentation is updated, and its acceptance criteria have been verified. A visual mockup alone does not satisfy an implementation phase. A feature is not 'done' if the UI claims a capability that its engine does not support.

## 11. Immediate next action

**Execute Phase 0 only.** Audit the current Ubuntu environment; install only missing essentials; record versions and checks. Do not scaffold the React project until Phase 0 is accepted.

**Suggested Phase 0 output:**
```text
Phase 0: PASS / BLOCKED
OS:
Node:
npm:
Git:
VS Code:
Browser/WebGL:
Disk free:
RAM:
Registry access:
Git identity:
Missing dependencies:
Next action:
```

---

*End of CODEVERSE Master Implementation Plan v1.0.*
