import {describe,it,expect} from 'vitest';
import {defaultProgress,statusOf,parseBackup,makeBackup,isProgress} from '../storage/progress';
describe('progress evidence and validated backups',()=>{
 it('starts not started',()=>expect(statusOf(defaultProgress())).toBe('not-started'));
 it('requires all learning and practical gates to demonstrate',()=>{const p=defaultProgress();p.visited=[1,2,3,4,5,6,7,8,9];p.quizPassed=true;expect(statusOf(p)).toBe('practicing');p.predictPassed=p.repairPassed=p.buildPassed=p.projectDone=p.mainDone=true;expect(statusOf(p)).toBe('demonstrated');});
 it('round trips valid data',()=>{const p=defaultProgress();p.visited=[1,5];const backup=makeBackup({'py-01':p});expect(parseBackup(backup)['py-01'].visited).toEqual([1,5]);});
 it('rejects bad JSON and invalid version',()=>{expect(()=>parseBackup('{')).toThrow();expect(()=>parseBackup('{"schemaVersion":999,"progress":{}}')).toThrow();});
 it('rejects corrupt records and duplicate visited steps',()=>{const p=defaultProgress();p.visited=[1,1];expect(isProgress(p)).toBe(false);expect(()=>parseBackup(JSON.stringify({schemaVersion:1,progress:{'py-01':p}}))).toThrow();});
});
