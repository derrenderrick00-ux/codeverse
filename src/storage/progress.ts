import type { Progress, ProgressMap, Status } from '../types';
export const VERSION=2;
const KEY='codeverse-progress-v2', OLD_KEY='codeverse-progress-v1';
const empty=():Progress=>({visited:[],completedSteps:[],quizPassed:false,predictPassed:false,repairPassed:false,buildPassed:false,projectDone:false,mainDone:false,simulationPassed:false,attempts:0,bestScore:0,lastScore:0,hintsUsed:0,updatedAt:new Date(0).toISOString()});
export const defaultProgress=empty;
export function completedSteps(p:Progress):number[]{return p.completedSteps??[];}
export function statusOf(p:Progress):Status {
 if (completedSteps(p).length===9 && p.quizPassed && p.predictPassed && p.repairPassed && p.buildPassed && p.projectDone && p.mainDone && p.simulationPassed) return 'demonstrated';
 if (p.quizPassed||p.predictPassed||p.repairPassed||p.buildPassed||p.projectDone||completedSteps(p).some(n=>n>=7))return 'practicing';
 return (p.visited.length||completedSteps(p).length)?'learning':'not-started';
}
const boolKeys=['quizPassed','predictPassed','repairPassed','buildPassed','projectDone','mainDone'] as const;
export const validId=(id:string)=>/^(py|sql|pd|np|ml)-\d{2}$/.test(id);
function validSteps(data:unknown):data is number[]{return Array.isArray(data)&&data.length<=9&&data.every(x=>Number.isInteger(x)&&x>=1&&x<=9)&&new Set(data).size===data.length;}
export function isProgress(value:unknown):value is Progress {
 if (!value||typeof value!=='object'||Array.isArray(value))return false;
 const p=value as Record<string,unknown>;
 return validSteps(p.visited) && (p.completedSteps===undefined || validSteps(p.completedSteps)) && boolKeys.every(k=>typeof p[k]==='boolean') && (p.simulationPassed===undefined||typeof p.simulationPassed==='boolean') && (p.localVerified===undefined||typeof p.localVerified==='boolean') && ['attempts','bestScore','lastScore','hintsUsed'].every(k=>typeof p[k]==='number'&&Number.isFinite(p[k])&&Number(p[k])>=0) && typeof p.updatedAt==='string' && !Number.isNaN(Date.parse(p.updatedAt)) && ['savedCode','projectCode','reflection','integrationNotes'].every(k=>p[k]===undefined||(typeof p[k]==='string'&&(p[k] as string).length<20000));
}
const normalize=(p:Progress,legacy:boolean):Progress=>{
 const completed=legacy?(statusOfLegacy(p)?[1,2,3,4,5,6,7,8,9]:p.visited.filter(x=>x<=6)):completedSteps(p);
 return {...empty(),...p,completedSteps:completed,simulationPassed:legacy?statusOfLegacy(p):(p.simulationPassed??false)};
};
function statusOfLegacy(p:Progress):boolean{return p.visited.length===9&&p.quizPassed&&p.predictPassed&&p.repairPassed&&p.buildPassed&&p.projectDone&&p.mainDone;}
function validateMap(value:unknown,legacy=false):ProgressMap {
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Backup progress must be a record object.');
 const entries=Object.entries(value);if(entries.length>300)throw new Error('Backup has too many lessons.');
 const result:ProgressMap={};
 for(const [id,p] of entries){if(!validId(id)||!isProgress(p))throw new Error(`Invalid lesson ${id}; progress was not changed.`);result[id]=normalize(p,legacy);}
 return result;
}
export function parseBackup(raw:string):ProgressMap {
 if(raw.length>15000000)throw new Error('Backup exceeds 15 MB safety limit.');
 let data:unknown;try{data=JSON.parse(raw);}catch{throw new Error('Invalid JSON; no changes applied.');}
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Backup must be an object.');
 const payload=data as Record<string,unknown>;
 if(payload.schemaVersion!==1&&payload.schemaVersion!==2)throw new Error('Unsupported backup version; no changes applied.');
 return validateMap(payload.progress,payload.schemaVersion===1);
}
export function makeBackup(progress:ProgressMap):string{return JSON.stringify({application:'CODEVERSE',schemaVersion:VERSION,exportedAt:new Date().toISOString(),progress:validateMap(progress)},null,2);}
function openDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{if(typeof indexedDB==='undefined')return reject(new Error('IndexedDB is unavailable'));const r=indexedDB.open('CODEVERSE_DB',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('settings'))r.result.createObjectStore('settings');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function transact<T>(mode:IDBTransactionMode,callback:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction('settings',mode);const req=callback(tx.objectStore('settings'));let result:T;req.onsuccess=()=>{result=req.result;};req.onerror=()=>reject(req.error);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);tx.oncomplete=()=>{db.close();resolve(result);};});}
export async function loadProgress():Promise<ProgressMap>{const modern=await transact<unknown>('readonly',s=>s.get(KEY));if(modern!==undefined)return validateMap(modern);const old=await transact<unknown>('readonly',s=>s.get(OLD_KEY));if(old===undefined)return {};const migrated=validateMap(old,true);await saveProgress(migrated);return migrated;}
export async function saveProgress(value:ProgressMap):Promise<void>{const validated=validateMap(value);await transact('readwrite',s=>s.put(validated,KEY));}
/** A demonstrated lesson is immutable: revision exercises run in memory only. */
export function applyLearningEdit(p:Progress,edit:(current:Progress)=>Progress):Progress {
 return statusOf(p)==='demonstrated'?p:edit({...p});
}
/** Highest currently open checkpoint for resuming after a mini-project. */
export function nextStudyStep(p:Progress):number {
 for(let step=1;step<=9;step++)if(!completedSteps(p).includes(step)&&canOpenStep(p,step))return step;
 return 9;
}
export function canOpenStep(p:Progress,step:number):boolean{return step===1||completedSteps(p).includes(step-1);}
export function canOpenLesson(lessons:{id:string}[],id:string,map:ProgressMap):boolean{const index=lessons.findIndex(x=>x.id===id);return index===0 || (index>0 && statusOf(map[lessons[index-1].id]??empty())==='demonstrated');}
export function canFinishStep(p:Progress,step:number):boolean{
 if(step<=6)return true;
 if(step===7)return p.quizPassed&&p.predictPassed&&p.repairPassed&&p.simulationPassed===true;
 if(step===8)return p.buildPassed&&p.projectDone;
 return p.mainDone;
}
export function finishStep(p:Progress,step:number):Progress{if(!canOpenStep(p,step)||!canFinishStep(p,step))throw new Error(`Complete the required checks for step ${step} before advancing.`);return {...p,completedSteps:[...new Set([...completedSteps(p),step])].sort((a,b)=>a-b)};}
