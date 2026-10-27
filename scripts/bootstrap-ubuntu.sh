#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo 'CODEVERSE · Ubuntu setup'
echo "Working directory: $PWD"
command -v node >/dev/null || { echo 'Node.js missing'; exit 1; }
command -v npm >/dev/null || { echo 'npm missing'; exit 1; }
command -v git >/dev/null || { echo 'Git missing'; exit 1; }
if [ ! -f CODEVERSE_MASTER_PLAN.md ]; then echo 'Master plan is missing';exit 1;fi
if [ ! -d .git ]; then
 echo 'Initializing local Git repository (main)'
 git init -b main
else
 echo 'Existing Git repository detected; preserving history.'
fi
printf '\nInstalling npm dependencies from package.json...\n'
npm install --no-audit --no-fund
printf '\nRunning checks...\n'
npm run lint
npm test
npm run build
printf '\nSetup complete. Run: npm run dev\n'
echo 'Make your first commit when you inspect the source: git add . && git commit -m "feat: CODEVERSE phases 1-8 foundation"'
