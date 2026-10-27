import {describe,it,expect} from 'vitest';
import {runSQLExercise,runPandasExercise,runNumPyExercise,runMLExercise,trainRegression,sessions} from '../engine/domains/experiments';
import {allLessons,lessonsByWorld,worlds} from '../lessons/catalog';
import {evaluateArtifact} from '../engine/domains/evidence';
import {learningHint} from '../engine/learning/hints';
describe('phases 9–12 computational exercises',()=>{
 it('includes all ordered world missions without duplicate IDs',()=>{expect(allLessons).toHaveLength(110);expect(new Set(allLessons.map(l=>l.id)).size).toBe(110);expect(worlds.map(w=>w.count)).toEqual([21,24,25,24,16]);});
 it('provides nine method fields for every world',()=>{for(const l of allLessons){expect(l.objectives.length).toBeGreaterThan(0);expect(l.definitions.length).toBeGreaterThan(0);expect(l.explanation.length).toBeGreaterThan(0);expect(l.quiz.options).toHaveLength(4);expect(l.quiz.options[l.quiz.answer].trim().length).toBeGreaterThan(0);expect(l.repair.options[l.repair.answer]).toBe('Verify assumptions and inspect the result.');}expect(lessonsByWorld.sql[0].title).toBe('SELECT');});
 it('SQL exercise filters and limits based on actual rows',()=>{const result=runSQLExercise(2,'All');expect(result.correct).toBe(2);expect(result.output).toContain('Queries');expect(result.output).not.toContain('DataFrame');expect(()=>runSQLExercise(-1,'All')).toThrow();});
 it('Pandas exercise groups by subject and counts the groups',()=>{const result=runPandasExercise(70,'group');expect(result.correct).toBe(3);expect(result.output).toContain('Python');expect(result.output).toContain('SQL');expect(result.output).toContain('Pandas');});
 it('NumPy exercise computes broadcast sum and matrix result',()=>{expect(runNumPyExercise('broadcast',3).correct).toBe(39);expect(runNumPyExercise('matrix',4).correct).toBe(4);expect(runNumPyExercise('reshape',0).correct).toBe(6);expect(()=>runNumPyExercise('filter',100)).toThrow();});
 it('gradient descent reduces training loss, with separate test evaluation',()=>{const history=trainRegression(0.02,100);expect(history.at(-1)!.loss).toBeLessThan(history[0].loss);expect(history.length).toBe(101);const result=runMLExercise(0.02,100);expect(result.output).toContain('testMAE');expect(result.correct).toBeGreaterThan(0);expect(()=>trainRegression(1,100)).toThrow();});
 it('journal validator requires topic, sufficient content and ordered evidence',()=>{const text='Input — SELECT uses a five row study dataset with session hours. Output — two rows are returned. Validation — I filtered manually and counted rows to verify the SELECT result.';expect(evaluateArtifact(text,'SELECT').pass).toBe(true);expect(evaluateArtifact('Done!','SELECT').pass).toBe(false);});
 it('offers graduated guidance without exposing quiz solutions or answers',()=>{
  const l=allLessons[0];
  for(const world of worlds)for(const area of ['concept','repair','build','experiment'] as const){
   for(const level of [1,2,3]){
    const hint=learningHint(world.id,l.title,area,level);
    expect(hint.length).toBeGreaterThan(30);
    expect(hint).not.toContain(l.quiz.options[l.quiz.answer]);
    expect(hint).not.toContain(l.repair.options[l.repair.answer]);
   }
  }
 });
 it('keeps the demo dataset stable across operations',()=>expect(sessions.length).toBe(5));
});
