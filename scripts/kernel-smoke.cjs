/* Dependency-free test runner for the CODEVERSE teaching kernel. Needs TypeScript installed globally or locally. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process');
let ts;try{ts=require('typescript');}catch{try{ts=require(path.join(cp.execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript'));}catch{throw new Error('TypeScript not installed. Install npm dependencies first.');}}
const root=path.resolve(__dirname,'..');const cache=new Map();
function load(file){if(!path.extname(file))file+='.ts';if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);
const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
new Function('require','module','exports',compiled)((name)=>{if(name.startsWith('.'))return load(path.resolve(path.dirname(file),name));return require(name);},module,module.exports);return module.exports;}
const progress=load(path.join(root,'src/storage/progress.ts'));const interp=load(path.join(root,'src/engine/execution/interpreter.ts'));const ch=load(path.join(root,'src/engine/execution/challenges.ts'));const experiments=load(path.join(root,'src/engine/domains/experiments.ts'));const catalog=load(path.join(root,'src/lessons/catalog.ts'));const evidence=load(path.join(root,'src/engine/domains/evidence.ts'));
let count=0;function test(name,fn){try{fn();count++;process.stdout.write('PASS '+name+'\n');}catch(e){console.error('FAIL '+name);throw e;}}
test('existing Python variable aliasing',()=>assert.deepEqual(interp.executeSubset('x = 10\ny = x\nx = 20\nprint(x)\nprint(y)').output,['20','10']));
test('inline comments accepted without deleting string hashes',()=>{const t=interp.executeSubset('total = 2 + 3 # note\nprint(total)\nprint("#literal")');assert.deepEqual(t.output,['5','#literal']);});
test('inline comments are not code executed',()=>assert.deepEqual(interp.executeSubset('x = 3 # print(99)\nprint(x)').output,['3']));
test('name resolution errors fail safely',()=>assert.throws(()=>interp.executeSubset('print(unknown)'),/NameError/));
test('zero division fails safely',()=>assert.throws(()=>interp.executeSubset('x = 2 / 0'),/division by zero/));
test('excessive programs rejected',()=>assert.throws(()=>interp.executeSubset('x=2\n'.repeat(200)),/limits/));
test('student profile with inline comments grades',()=>{const code='name="Derrick"\nuniversity="DeKUT"\ncourse="Computer Science"\nyear=1\ncompleted=7\npending=3\ntotal=completed+pending # correct\npercentage=100*completed/total # correct\nprint(name)\nprint(university)\nprint(course)\nprint(percentage)';assert.equal(ch.gradeStudentProfile(code).pass,true);});
test('incorrect student totals rejected',()=>assert.equal(ch.gradeStudentProfile('total=999').pass,false));
test('shell environment evidence accepts Python version',()=>assert.equal(ch.gradeLocalEvidence('python3 -m venv .venv\nsource .venv/bin/activate\npython --version','Python 3.14.4','Displays the active Python version',true,true).pass,true));
test('unconfirmed local evidence is rejected',()=>assert.equal(ch.gradeLocalEvidence('python3 -m venv .venv\nsource .venv/bin/activate\npython --version','Python 3.14.4','irrelevant',false,true).pass,false));
test('all 5 worlds and 110 lessons',()=>assert.deepEqual(catalog.worlds.map(x=>x.count),[21,24,25,24,16]));
test('lesson ID uniqueness',()=>assert.equal(new Set(catalog.allLessons.map(l=>l.id)).size,110));
test('learning step 2 gated',()=>assert.equal(progress.canOpenStep(progress.defaultProgress(),2),false));
test('locked lesson cannot skip predecessor',()=>assert.equal(progress.canOpenLesson(catalog.allLessons,'sql-01',{}),false));
test('unsatisfied step 7 cannot be marked complete',()=>{let p=progress.defaultProgress();p.completedSteps=[1,2,3,4,5,6];assert.throws(()=>progress.finishStep(p,7));});
test('sequential step 1 unlocks 2',()=>assert.equal(progress.canOpenStep(progress.finishStep(progress.defaultProgress(),1),2),true));
test('world progress JSON backup round trip',()=>{const p=progress.defaultProgress();p.integrationNotes='Input output validation';assert.equal(progress.parseBackup(progress.makeBackup({'np-01':p}))['np-01'].integrationNotes,p.integrationNotes);});
test('v1 record migration',()=>{const p=progress.defaultProgress();p.visited=[1,2];assert.deepEqual(progress.parseBackup(JSON.stringify({schemaVersion:1,progress:{'py-01':p}}))['py-01'].completedSteps,[1,2]);});
test('reject malformed backup atomically',()=>assert.throws(()=>progress.parseBackup('{'),/Invalid JSON/));
test('SQL deterministic selection count',()=>assert.equal(experiments.runSQLExercise(2,'All').correct,2));
test('SQL reject invalid threshold',()=>assert.throws(()=>experiments.runSQLExercise(-1,'All')));
test('Pandas group aggregation count',()=>assert.equal(experiments.runPandasExercise(70,'group').correct,3));
test('NumPy broadcast sum',()=>assert.equal(experiments.runNumPyExercise('broadcast',3).correct,39));
test('NumPy matrix multiplication',()=>assert.equal(experiments.runNumPyExercise('matrix',1).correct,4));
test('ML regression loss decreases',()=>{const s=experiments.trainRegression(.02,100);assert.ok(s.at(-1).loss<s[0].loss);});
test('ML test MAE separate from training set',()=>assert.ok(experiments.runMLExercise(.02,100).output.includes('testMAE')));
test('ML rejects extreme learning rate',()=>assert.throws(()=>experiments.trainRegression(1,80)));
test('engineering journal rejects trivial text',()=>assert.equal(evidence.evaluateArtifact('done','SELECT').pass,false));
test('valid engineering journal structure',()=>assert.equal(evidence.evaluateArtifact('Input — SELECT with a five row table of study sessions. Output — returned two matching rows. Validation — checked the filters, row count and source records before accepting the SQL result.','SELECT').pass,true));
console.log(`\nCODEVERSE kernel smoke: ${count} / ${count} passed`);
