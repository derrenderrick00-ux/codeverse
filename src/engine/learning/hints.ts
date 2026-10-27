import type {WorldId} from '../../types';
export type HintArea='concept'|'repair'|'build'|'experiment';
/** Scaffold a learner's next reasoning move, never expose an answer or solution. */
export function learningHint(world:WorldId,topic:string,area:HintArea,level:number):string {
 const n=Math.max(1,Math.min(3,Math.floor(level)));
 const contexts:Record<WorldId,string>={
  python:'Track the names, types and values after each statement.',
  sql:'List the input rows first, then apply each query clause in order.',
  pandas:'Identify the input columns and trace the rows through the transformation.',
  numpy:'Write down the array shapes before calculating any output.',
  ml:'Compare the training input, model prediction and evaluation metric separately.'
 };
 const focus:Record<HintArea,string>={concept:'Underline the action word in the question; compare the options to the lesson definitions.',repair:'Find the assumption that makes the original claim unreliable.',build:'Identify required inputs, expected outputs, and the cases that should be tested.',experiment:'Try changing one parameter and watch which output changes.'};
 if(n===1)return `Start with ${topic}: ${focus[area]}`;
 if(n===2)return `Use the visualization as a scratchpad. ${contexts[world]}`;
 return area==='build'?'Test one ordinary case and one boundary case. Read the error or failed check, then correct one small part at a time.':area==='experiment'?'Repeat the experiment with a smaller input and calculate the first step by hand.':'Eliminate one option at a time by checking whether it matches the observed behavior. Explain why the remaining option would work before choosing it.';
}
