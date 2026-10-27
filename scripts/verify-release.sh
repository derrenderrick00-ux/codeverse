#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo '=== CODEVERSE v0.6 release verification ==='
echo '[1/6] Standalone kernel TypeScript typecheck'
if command -v tsc >/dev/null; then tsc -p tsconfig.kernel.json; else npx tsc -p tsconfig.kernel.json; fi
echo '[2/6] 29+ kernel regression cases'
node scripts/kernel-smoke.cjs
echo '[3/6] Python reference implementations'
python3 -m unittest discover -s tests_python -v
echo '[4/6] React TypeScript compilation'
npm run lint
echo '[5/6] Vitest unit tests'
npm test
echo '[6/6] Vite production build'
npm run build
echo 'All non-browser checks passed. Run npm run test:e2e for browser acceptance.'
