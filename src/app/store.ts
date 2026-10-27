import {create} from 'zustand';
import type {Progress,ProgressMap} from '../types';
import {applyLearningEdit,defaultProgress,loadProgress,saveProgress} from '../storage/progress';
type AppStore = { progress:ProgressMap; ready:boolean; error:string|null; reducedMotion:boolean; prefer2d:boolean;
 init:()=>Promise<void>; change:(id:string,edit:(current:Progress)=>Progress)=>Promise<void>; replace:(records:ProgressMap)=>Promise<void>;
 toggleMotion:()=>void;toggle2d:()=>void;clearError:()=>void;};
// Serial writes prevent fast typing from overwriting newer persisted snapshots.
let pendingWrite:Promise<void>=Promise.resolve();
export const useApp=create<AppStore>((set,get)=>({progress:{},ready:false,error:null,reducedMotion:typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,prefer2d:true,
 init:async()=>{try{const progress=await loadProgress();set({progress,ready:true,error:null});}catch(error){set({ready:true,error:error instanceof Error?error.message:'Storage unavailable'});}},
 change:async(id,edit)=>{const old=get().progress;const previous=old[id]??defaultProgress();const changed=applyLearningEdit(previous,edit);if(changed===previous)return;const next={...old,[id]:{...changed,updatedAt:new Date().toISOString()}};
  set({progress:next});pendingWrite=pendingWrite.catch(()=>undefined).then(()=>saveProgress(next));
  try{await pendingWrite;set({error:null});}catch(error){set({error:error instanceof Error?`Save failed; recent edits may be unsaved: ${error.message}`:'Save failed'});}
 },
 replace:async(records)=>{try{await pendingWrite;await saveProgress(records);set({progress:records,error:null});}catch(error){set({error:error instanceof Error?error.message:'Import failed'});throw error;}},
 toggleMotion:()=>set(s=>({reducedMotion:!s.reducedMotion})),toggle2d:()=>set(s=>({prefer2d:!s.prefer2d})),clearError:()=>set({error:null})}));
