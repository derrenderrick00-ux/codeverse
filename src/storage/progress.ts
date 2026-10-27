import type { Progress, ProgressMap, Status } from '../types';
export const VERSION=1;
const KEY='codeverse-progress-v1';
const empty=():Progress=>({visited:[],quizPassed:false,predictPassed:false,repairPassed:false,buildPassed:false,projectDone:false,mainDone:false,attempts:0,bestScore:0,lastScore:0,hintsUsed:0,updatedAt:new Date(0).toISOString()});
export const defaultProgress=empty;
export function statusOf(p:Progress):Status {
 if (p.visited.length===0) return 'not-started';
 if (p.visited.length===9 && p.quizPassed && p.predictPassed && p.repairPassed && p.buildPassed && p.projectDone && p.mainDone) return 'demonstrated';
 return p.quizPassed || p.predictPassed || p.repairPassed || p.buildPassed || p.projectDone ? 'practicing':'learning';
}
const boolKeys=['quizPassed','predictPassed','repairPassed','buildPassed','projectDone','mainDone'] as const;
export function isProgress(value:unknown):value is Progress {
 if (!value || typeof value!=='object') return false;
 const p=value as Record<string,unknown>;
 return Array.isArray(p.visited) && p.visited.length<=9 && p.visited.every(x=>Number.isInteger(x)&&x>=1&&x<=9) && new Set(p.visited).size===p.visited.length && boolKeys.every(k=>typeof p[k]==='boolean') && ['attempts','bestScore','lastScore','hintsUsed'].every(k=>typeof p[k]==='number'&&Number.isFinite(p[k])&&Number(p[k])>=0) && typeof p.updatedAt==='string' && !Number.isNaN(Date.parse(p.updatedAt)) && (p.savedCode===undefined || typeof p.savedCode==='string' && p.savedCode.length<20000) && (p.projectCode===undefined || typeof p.projectCode==='string' && p.projectCode.length<20000);
}
export function parseBackup(raw:string):ProgressMap {
 if(raw.length>2000000) throw new Error('Backup exceeds 2 MB safety limit');
 let object:unknown;try {object=JSON.parse(raw);} catch {throw new Error('Invalid JSON file. No progress changed.');}
 if (!object || typeof object!=='object') throw new Error('Backup root must be an object');
 const data=object as Record<string,unknown>;
 if (data.schemaVersion!==VERSION || !data.progress || typeof data.progress!=='object' || Array.isArray(data.progress)) throw new Error('Incompatible or missing backup schema. No progress changed.');
 const entries=Object.entries(data.progress);if(entries.length>300)throw new Error('Too many progress entries');
 const validated:ProgressMap={};
 for(const [key,value] of entries){if(!/^py-\d{2}$/.test(key)||!isProgress(value))throw new Error(`Invalid record for ${key}. No progress changed.`);validated[key]=value;}
 return validated;
}
export function makeBackup(progress:ProgressMap):string {
 for(const value of Object.values(progress)) if(!isProgress(value)) throw new Error('Cannot back up malformed progress');
 return JSON.stringify({schemaVersion:VERSION,application:'CODEVERSE',exportedAt:new Date().toISOString(),progress},null,2);
}
function openDB():Promise<IDBDatabase> {
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
  const request=indexedDB.open('CODEVERSE_DB',1);
  request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('settings'))request.result.createObjectStore('settings');};
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
 });
}
async function requestDB<T>(mode:IDBTransactionMode,callback:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T> {
 const db=await openDB(); return new Promise((resolve,reject)=>{
  const tx=db.transaction('settings',mode);const req=callback(tx.objectStore('settings'));
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.onerror=()=>reject(tx.error);tx.oncomplete=()=>db.close();
 });
}
export async function loadProgress():Promise<ProgressMap> {
 const value=await requestDB<unknown>('readonly',store=>store.get(KEY));
 if (!value) return {};
 if(typeof value!=='object' || Array.isArray(value)) throw new Error('Saved progress is corrupted; export a backup before resetting.');
 const map=value as Record<string,unknown>; if(!Object.entries(map).every(([key,p])=>/^py-\d{2}$/.test(key)&&isProgress(p))) throw new Error('Saved progress is invalid; no automatic reset performed.');
 return map as ProgressMap;
}
export async function saveProgress(value:ProgressMap):Promise<void> {
 for(const [key,p] of Object.entries(value)) if(!/^py-\d{2}$/.test(key)||!isProgress(p))throw new Error('Invalid progress write blocked');
 await requestDB<IDBValidKey>('readwrite',store=>store.put(value,KEY));
}
