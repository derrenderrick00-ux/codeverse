# CODEVERSE — Release Candidate Verification Record

**Candidate:** v0.6.1 corrective patch on top of Git commit `f4c4eb1` (`feature/codeverse-v06`)  
**Created:** 2026-10-27  
**Status:** **PENDING Ubuntu acceptance**. Do not tag or merge as a verified final release before completing the checks below.

## What the corrective patch fixes

1. `src/app/App.tsx`: explicitly type the intermediate project-grading result as `Progress`, resolving the optional `projectCode` return-type mismatch with `finishStep()`.
2. `src/tests/domains.test.ts`: remove a wrong global assumption that every lesson's correct repair answer is identical; validate the per-lesson answer index and text instead.
3. `e2e/learner.spec.ts`: update the workshop test for intentional automatic navigation after successful milestone grading; navigate back to `/workshop` to verify saved code.
4. `e2e/learner.spec.ts`: seed mastered progress using the public JSON-import path instead of a direct asynchronous IndexedDB write behind the Zustand store.
5. Documentation: Git clone instructions, learner workflow, developer contracts, and release checks.

## Already observed on user's Ubuntu (before this corrective patch)

| Check | Observed outcome |
|---|---|
| `npm run lint` | **FAIL**: `App.tsx` TypeScript inference |
| `npm test` | **FAIL**: one domains test; 33/34 pass |
| `npm run build` | **FAIL**: same TypeScript inference |
| `npm run test:kernel` | **PASS**: 32/32 |
| `npm run test:python` | **PASS**: 6 pass, 2 skipped (Pandas/scikit-learn absent) |
| `npm run test:e2e` | **FAIL**: 4/6 passed; 2 test failures |
| `npm install` | **3 vulnerabilities**: 1 moderate, 2 critical |
| Git push | **SUCCESS** to `origin/feature/codeverse-v06` at `f4c4eb1` |

## Checks completed against the corrected source in packaging environment

- [x] Standalone deterministic kernel smoke: **32/32 PASS**.
- [x] Python unittest: **8/8 PASS** (scientific libraries available in packaging environment).
- [x] TypeScript/TSX source parsing (not complete compilation): **PASS**, 24 source files.
- [x] Archive integrity and file exclusion inspection: **PASS**.
- [ ] Full `npm run lint`: requires installed frontend dependencies; **not run here**.
- [ ] Full `npm test`: requires installed frontend dependencies; **not run here**.
- [ ] `npm run build`: requires installed frontend dependencies; **not run here**.
- [ ] Playwright browser suite: requires installed frontend dependencies and browser; **not run here**.
- [ ] Browser manual validation: **pending user Ubuntu acceptance**.
- [ ] `npm audit` remediation/review: **pending**.

## Required Ubuntu commands (fail fast)

```bash
cd ~/Documents/codeverse
git status
git diff --check
npm ci
npm run lint && npm test && npm run build && npm run test:kernel && npm run test:python
npx playwright install chromium
env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e
npm audit
npm audit --omit=dev
```

If `npm audit` flags dependencies, record the exact packages and whether they affect production bundles before deciding on targeted upgrades; **do not** run `npm audit fix --force` without understanding the dependency changes.

## Manual release gate

- [ ] First visit opens Mission Control and Python Variables.
- [ ] Lesson 2 cannot be opened before Lesson 1 demonstrates all steps.
- [ ] Nine checkpoints unlock in order; step 7 requires all checks.
- [ ] Student Profile project validates correct calculations with inline comments, then returns to the correct checkpoint.
- [ ] Draft code remains available when reopening `/workshop`.
- [ ] A mastered lesson can be revisited without changing persisted scores/evidence.
- [ ] Hints guide problem solving without giving quiz answers.
- [ ] SQL/Pandas/NumPy/ML worlds load; outputs match bounded experiments and labels.
- [ ] Progress JSON export/import round-trips; invalid input is rejected.
- [ ] 2D atlas works when 3D/WebGL is disabled.
- [ ] No console errors in standard learning path; browser rendering is usable on an 8 GB laptop.

## Final commit protocol

Create the final commit only after these checks pass:

```bash
git add -A
git status
git commit -m "fix: stabilize CODEVERSE release gates and document installation"
git push origin feature/codeverse-v06
git log -1 --oneline
```

Update this record with actual pass/fail output and commit hash. Review and merge the feature branch into `main` only after the release gate is satisfied. **Do not add the private engineering journal, private source snapshot, or personal progress JSON to Git.**
