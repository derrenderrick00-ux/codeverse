import {describe,it,expect} from 'vitest';
import {defaultProgress,statusOf,parseBackup,makeBackup,isProgress,canOpenStep,canOpenLesson,canFinishStep,finishStep,applyLearningEdit,nextStudyStep} from '../storage/progress';
const nine=Array.from({length:9},(_,i)=>i+1);
describe('sequential progression and versioned local backups',()=>{
 it('begins empty and locks later checkpoints',()=>{const p=defaultProgress();expect(statusOf(p)).toBe('not-started');expect(canOpenStep(p,1)).toBe(true);expect(canOpenStep(p,2)).toBe(false);expect(canFinishStep(p,7)).toBe(false);});
 it('advances one reviewed checkpoint at a time',()=>{const first=finishStep(defaultProgress(),1);expect(first.completedSteps).toEqual([1]);expect(canOpenStep(first,2)).toBe(true);expect(()=>finishStep(first,4)).toThrow();});
 it('rejects an unverified assessment and project',()=>{const p=defaultProgress();p.completedSteps=[1,2,3,4,5,6];expect(canOpenStep(p,7)).toBe(true);expect(()=>finishStep(p,7)).toThrow();p.quizPassed=p.predictPassed=p.repairPassed=p.simulationPassed=true;p.completedSteps=nine.slice(0,6);const result=finishStep(p,7);expect(canOpenStep(result,8)).toBe(true);expect(canFinishStep(result,8)).toBe(false);});
 it('requires every step and evidence flag to demonstrate mastery',()=>{const p=defaultProgress();p.visited=nine;p.completedSteps=nine;p.quizPassed=true;expect(statusOf(p)).not.toBe('demonstrated');p.predictPassed=p.repairPassed=p.buildPassed=p.projectDone=p.mainDone=p.simulationPassed=true;expect(statusOf(p)).toBe('demonstrated');});
 it('locks the next lesson until its immediate prerequisite is mastered',()=>{const lessons=[{id:'py-01'},{id:'py-02'},{id:'sql-01'}];const map={'py-01':defaultProgress()};expect(canOpenLesson(lessons,'py-01',map)).toBe(true);expect(canOpenLesson(lessons,'py-02',map)).toBe(false);const p=defaultProgress();p.completedSteps=nine;p.quizPassed=p.predictPassed=p.repairPassed=p.buildPassed=p.projectDone=p.mainDone=p.simulationPassed=true;map['py-01']=p;expect(canOpenLesson(lessons,'py-02',map)).toBe(true);expect(canOpenLesson(lessons,'sql-01',map)).toBe(false);});
 it('freezes mastered lessons during unlimited unsaved review',()=>{
  const p=defaultProgress();p.completedSteps=nine;p.visited=nine;p.quizPassed=p.predictPassed=p.repairPassed=p.buildPassed=p.projectDone=p.mainDone=p.simulationPassed=true;
  const original=JSON.stringify(p);
  const changed=applyLearningEdit(p,old=>({...old,hintsUsed:900,attempts:900,savedCode:'danger'}));
  expect(changed).toBe(p);expect(JSON.stringify(p)).toBe(original);
  expect(canOpenStep(p,1)).toBe(true);expect(canOpenStep(p,9)).toBe(true);
  expect(statusOf(p)).toBe('demonstrated');
 });
 it('returns to the next unlocked checkpoint after a milestone',()=>{
  const p=defaultProgress();p.completedSteps=nine.slice(0,7);p.quizPassed=p.predictPassed=p.repairPassed=p.simulationPassed=true;
  expect(nextStudyStep(p)).toBe(8);
  p.projectDone=p.buildPassed=true;
  const after=finishStep(p,8);
  expect(nextStudyStep(after)).toBe(9);
  expect(nextStudyStep(defaultProgress())).toBe(1);
 });
 it('round-trips multi-world progress without losing notes',()=>{const p=defaultProgress();p.visited=[1,2];p.integrationNotes='Testing SQL';const backup=makeBackup({'sql-01':p});expect(parseBackup(backup)['sql-01'].integrationNotes).toBe('Testing SQL');});
 it('migrates old v1 backups without dropping visited lessons',()=>{const p=defaultProgress();p.visited=[1,2,3];delete p.completedSteps;delete p.simulationPassed;const restored=parseBackup(JSON.stringify({schemaVersion:1,progress:{'py-01':p}}));expect(restored['py-01'].completedSteps).toEqual([1,2,3]);expect(restored['py-01'].visited).toEqual([1,2,3]);});
 it('refuses malformed data without resetting',()=>{expect(()=>parseBackup('{')).toThrow();expect(()=>parseBackup('{"schemaVersion":999,"progress":{}}')).toThrow();const p=defaultProgress();p.visited=[1,1];expect(isProgress(p)).toBe(false);expect(()=>parseBackup(JSON.stringify({schemaVersion:2,progress:{'py-01':p}}))).toThrow();});
});
