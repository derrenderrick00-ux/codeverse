# Apply CODEVERSE finalization patch to `f4c4eb1`

**This is a corrective patch, not a declaration of a released build.** It is designed for the known branch `feature/codeverse-v06` after commit `f4c4eb1`.

1. Open CODEVERSE in Firefox and **export any learner progress backup** to a safe directory.
2. Stop the development server. In terminal:

```bash
cd ~/Documents/codeverse
git status
git log -1 --oneline
git branch backup/codeverse-before-release-fix
```

3. Verify the tree is clean and the HEAD is `f4c4eb1`. If your branch has newer commits, inspect them first; don't blindly overwrite overlapping work.
4. Extract the ZIP from `~/Downloads`:

```bash
unzip -o ~/Downloads/CODEVERSE_v0.6.1_FINALIZATION_PATCH.zip
```

5. The patch changes three source/test files, refreshes the README and adds user/developer/release documentation. It does **not** contain personal journal files or browser backups.
6. Run the release suite:

```bash
npm ci
npm run lint && npm test && npm run build && npm run test:kernel && npm run test:python
npx playwright install chromium
env -u CODEVERSE_CHROMIUM_PATH npm run test:e2e
npm audit
npm audit --omit=dev
```

7. Complete the manual checklist in `docs/RELEASE_ACCEPTANCE.md`. If a check fails, fix it and run the entire suite again. **Do not commit or merge a failing release.**
8. After the checks pass, commit and push:

```bash
git diff --check
git status
git add README.md docs/USER_MANUAL.md docs/DEVELOPER_MANUAL.md docs/RELEASE_ACCEPTANCE.md docs/APPLY_RELEASE_FIX.md src/app/App.tsx src/tests/domains.test.ts e2e/learner.spec.ts
git commit -m "fix: stabilize CODEVERSE release gates and document Git installation"
git push origin feature/codeverse-v06
git log -1 --oneline
```

9. Open a PR from `feature/codeverse-v06` into `main`, review/merge it, then switch to `main` and verify `git status`. Only create a release tag after the release gate is complete.

**Private files:** Keep `CODEVERSE_ENGINEERING_JOURNAL_PRIVATE.md/.pdf`, private source ZIP, and `SOURCE_MANIFEST_SHA256.txt` **outside** `~/Documents/codeverse`. They are for personal disaster recovery and must not be committed or included in the PR.

**Rollback:** `git diff` to inspect, then `git restore` only the patch files if you have no other wanted modifications; otherwise recover the backup branch or apply an exported file backup. Never `git reset --hard` without preserving your work.
