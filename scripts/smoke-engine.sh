#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
echo 'Compiling dependency-free execution kernel with TypeScript...'
tsc --module commonjs --moduleResolution node --target ES2022 --lib ES2022,DOM --skipLibCheck --outDir "$TMP" --noEmit false src/engine/execution/interpreter.ts src/engine/timeline/controller.ts src/engine/execution/challenges.ts src/storage/progress.ts
cd "$TMP"
node <<'JS'
const assert=require('node:assert/strict');
const {executeSubset,validateTrace,curatedTrace}=require('./engine/execution/interpreter.js');
const {Timeline}=require('./engine/timeline/controller.js');
const {gradeStudentProfile,gradeVariablesBuild}=require('./engine/execution/challenges.js');
const {defaultProgress,statusOf,parseBackup,makeBackup}=require('./storage/progress.js');
let count=0;
function check(desc,fn){fn();count++;console.log('PASS',desc);}
check('bindings and two-line stdout',()=>{const t=executeSubset('x = 10\ny = x\nx = 20\nprint(x)\nprint(y)');assert.deepEqual(t.output,['20','10']);assert.equal(t.events[2].bindings.x,t.events[2].bindings.y);assert.notEqual(t.events[3].bindings.x,t.events[3].bindings.y);});
check('snapshots immutable',()=>{const t=executeSubset('x = 1\ny = x\nx = 2');assert.equal(t.events[1].objects[t.events[1].bindings.x].value,1);});
check('list append alias',()=>assert.deepEqual(executeSubset('a = [1, 2]\nb = a\na.append(3)\nprint(len(b))').output,['3']));
check('Python-like floor division',()=>assert.deepEqual(executeSubset('print(7 // 2)').output,['3']));
check('division by zero error',()=>assert.throws(()=>executeSubset('print(5 / 0)'),/ZeroDivision/));
check('undefined name error',()=>assert.throws(()=>executeSubset('print(missing)'),/NameError/));
check('disallow imports',()=>assert.throws(()=>executeSubset('import os'),/Unsupported/));
check('prevent indented arbitrary code',()=>assert.throws(()=>executeSubset('for x in [1]:\n    print(x)'),/Unsupported|Indented/));
check('trace valid',()=>assert.equal(validateTrace(executeSubset('a = 2')),true));
check('trace tampering rejected',()=>{const t=executeSubset('a = 2');t.events[1].bindings.a='missing';assert.equal(validateTrace(t),false);});
check('back / forward / restart',()=>{const t=new Timeline(executeSubset('a = 1\na = 2'));assert.equal(t.next().step,1);assert.equal(t.back().step,0);assert.equal(t.seek(100).step,2);assert.equal(t.reset().step,0);});
check('guided illustration explicitly labeled',()=>assert.equal(curatedTrace('def f(): pass',['illustration']).mode,'curated'));
const good='name="Derrick"\nuniversity="DeKUT"\ncourse="CS"\nyear=1\ncompleted=7\npending=3\ntotal=completed+pending\npercentage=100*completed/total\nprint(name)\nprint(university)\nprint(course)\nprint(percentage)';
check('mini-project correct calculation',()=>assert.equal(gradeStudentProfile(good).pass,true));
check('mini-project wrong calculation fails',()=>assert.equal(gradeStudentProfile(good.replace('percentage=100*completed/total','percentage=80')).pass,false));
check('rejects hard-coded Variables outputs',()=>assert.equal(gradeVariablesBuild('print(20)\nprint(10)').pass,false));
check('accepts authentic Variables bindings',()=>assert.equal(gradeVariablesBuild('x = 10\ny = x\nx = 20\nprint(x)\nprint(y)').pass,true));
check('progress requires all evidence gates',()=>{const p=defaultProgress();assert.equal(statusOf(p),'not-started');p.visited=[1,2,3,4,5,6,7,8,9];p.quizPassed=true;assert.equal(statusOf(p),'practicing');p.predictPassed=p.repairPassed=p.buildPassed=p.projectDone=p.mainDone=true;assert.equal(statusOf(p),'demonstrated');});
check('backup roundtrip',()=>{const p=defaultProgress();p.visited=[1,2];assert.deepEqual(parseBackup(makeBackup({'py-01':p}))['py-01'].visited,[1,2]);});
check('malformed backup rejected',()=>{assert.throws(()=>parseBackup('not json'));assert.throws(()=>parseBackup('{\"schemaVersion\":2,\"progress\":{}}'));});
console.log(`PASS ${count}/${count} offline kernel smoke assertions`);
JS
