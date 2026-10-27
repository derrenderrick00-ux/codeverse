# CODEVERSE — QA Release Gate (v0.5.0-alpha.1)

**Status: NOT YET ACCEPTED.** Source code is packaged for the owner's Ubuntu machine. This checklist records what has and has not been verified.

## A. Environment (Phase 0)

- [x] Node 24.21, npm 11.19, Git 2.53, VS Code 1.143, Python 3.14 confirmed by owner
- [x] Registry ping succeeded from owner's laptop
- [x] 49 GiB disk free and 7 GiB memory confirmed
- [x] Owner's Git identity configured
- [x] Existing folder and master plan present
- [ ] Firefox WebGL status reviewed (the 2D fallback works independently of hardware acceleration)

## B. Confirmed programmatic checks in package construction

- [x] `bash scripts/smoke-engine.sh`: **19/19 PASS**, including references, timeline, unsupported syntax, output and project checker.
- [x] `python3 scripts/verify_lessons.py`: **20/20 PASS** for real Python 3 reference examples. The virtual-environment lesson is shell code, intentionally not run through Python.
- [x] Strict TypeScript compilation of dependency-free core and persistence modules.

## C. Must-run commands on Ubuntu

```bash
cd ~/Documents/codeverse
npm install
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run dev
```

**Do not report success until the actual output of each command is checked.** If a package version has broken compatibility, resolve that first and retain lockfile changes.

## D. Manual target-device walkthrough

- [ ] Welcome opens; skip and enter dashboard.
- [ ] All eight screens accessible by link and browser back.
- [ ] 3D mode works if supported; 2D mode retains full navigation if WebGL unavailable.
- [ ] Firefox in responsive narrow viewport: code/lesson panels remain readable.
- [ ] Keyboard Tab, Enter and Space can reach lesson steps, controls and exercises.
- [ ] Reduced-motion switch pauses visible atlas motion (check both OS setting and app toggle).
- [ ] Variables example: x/y alias at step 2, x=20/y=10 at step 3, stdout `20` then `10`.
- [ ] Back, seek, reset and playback never change recorded snapshot semantics.
- [ ] Invalid/unsupported syntax produces errors rather than invented output.
- [ ] All nine lesson steps reachable in order.
- [ ] Predict/Repair/Build correctly distinguish success and failure.
- [ ] Mini-project fails with broken percent; succeeds with correct formula.
- [ ] Reload retains progress.
- [ ] Valid backup import/export round-trip is lossless.
- [ ] Corrupt JSON import leaves existing progress intact.
- [ ] CPU/memory use acceptable on 8 GB device in 2D and optional 3D.

## E. Remaining known limitations

1. Not a general Python interpreter; subset supported syntax is explicitly documented.
2. Advanced Python lessons use narrated guided steps, not executed runtime traces.
3. All-world atlas is a navigation preview; SQL, Pandas, NumPy and ML are not implemented yet.
4. No hosted backend, login, cloud sync, code isolation for arbitrary Python, or full course auto-grading.
5. Some advanced topics have conceptual assessment but require local Python for independent code execution.
6. Actual React production build and Playwright browser evidence are pending Ubuntu testing.

### Release sign-off

Owner acceptance: [ ]  
Automation suite: [ ]  
Manual UI gate: [ ]  
Phase 8 full topic-depth gate: [ ]  
Commit ID: _to be recorded after local Git commit_
