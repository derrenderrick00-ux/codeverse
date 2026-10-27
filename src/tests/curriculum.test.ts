import {describe,it,expect} from 'vitest';
import {pythonLessons,worlds} from '../lessons/catalog';
import {gradeStudentProfile} from '../engine/execution/challenges';
describe('Python expansion',()=>{
 it('has all 21 ordered topics in the textbook sequence',()=>{
 expect(pythonLessons).toHaveLength(21);
 expect(pythonLessons.map(l=>l.title)).toEqual(['Variables','Data types','Lists','Tuples','Sets','Dictionaries','If / elif / else','For loops','While loops','Functions','Lambda','List comprehensions','Exception handling','*args and **kwargs','Classes','Modules','map()','filter()','zip()','File handling','Virtual environments']);
 });
 it('provides nine-step fields and challenge fixtures',()=>{for(const l of pythonLessons){expect(l.objectives.length).toBeGreaterThan(0);expect(l.definitions.length).toBeGreaterThan(0);expect(l.explanation.length).toBeGreaterThan(0);expect(l.diagram).toBeTruthy();expect(l.source).toBeTruthy();expect(l.applications.length).toBeGreaterThan(0);expect(l.quiz.options).toHaveLength(4);expect(l.repair.options).toHaveLength(4);expect(l.miniProject).toBeTruthy();expect(l.mainProject).toBeTruthy();}});
 it('declares five worlds',()=>expect(worlds).toHaveLength(5));
 it('grades a working student profile',()=>{const code='name = "Derrick"\nuniversity = "DeKUT"\ncourse = "CS"\nyear = 1\ncompleted = 7\npending = 3\ntotal = completed + pending\npercentage = 100 * completed / total\nprint(name)\nprint(university)\nprint(course)\nprint(percentage)';expect(gradeStudentProfile(code).pass).toBe(true);});
 it('rejects incorrect percentage',()=>{const code='name="D"\nuniversity="DeKUT"\ncourse="CS"\nyear=1\ncompleted=7\npending=3\ntotal=10\npercentage=80\nprint(name)\nprint(university)\nprint(course)\nprint(percentage)';expect(gradeStudentProfile(code).pass).toBe(false);});
});
