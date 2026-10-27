/** Bounded, deterministic teaching experiments. These do not execute arbitrary Python or SQL. */
import type {WorldId} from '../../types';
export type Row={id:number;name:string;subject:string;hours:number;score:number;student_id:number};
export const sessions:Row[]=[
 {id:1,name:'Arrays',subject:'Python',hours:2,score:80,student_id:1},
 {id:2,name:'Queries',subject:'SQL',hours:3,score:75,student_id:2},
 {id:3,name:'Loops',subject:'Python',hours:4,score:90,student_id:1},
 {id:4,name:'Joins',subject:'SQL',hours:1,score:60,student_id:3},
 {id:5,name:'DataFrame',subject:'Pandas',hours:2,score:85,student_id:2}
];
export type ExperimentResult={title:string;input:string;output:string;steps:string[];question:string;correct:number;unit:string;kind:'computed'|'model'};
const table=(rows:unknown):string=>JSON.stringify(rows,null,2);
const sum=(a:number[])=>a.reduce((n,x)=>n+x,0);
export function runSQLExercise(minHours:number,subject:string):ExperimentResult {
 if(!Number.isFinite(minHours)||minHours<0||minHours>20)throw new Error('Hours threshold must be between 0 and 20.');
 const rows=sessions.filter(s=>s.hours>minHours&&(subject==='All'||s.subject===subject));
 return {title:'SQL selection / WHERE (computed)',input:`SELECT name, hours FROM sessions WHERE hours > ${minHours}${subject==='All'?'':` AND subject = '${subject}'`};`,output:table(rows.map(({name,hours})=>({name,hours}))),steps:[`Read ${sessions.length} rows`,`Filter hours > ${minHours}`,`Filter subject: ${subject}`,`Project columns name, hours`,`${rows.length} result rows`],question:'How many rows does your SQL query return?',correct:rows.length,unit:'rows',kind:'computed'};
}
export function runPandasExercise(minScore:number,method:'filter'|'group'|'sort'|'clean'):ExperimentResult {
 if(!Number.isFinite(minScore)||minScore<0||minScore>100)throw new Error('Score threshold must be between 0 and 100.');
 const filtered=sessions.filter(s=>s.score>=minScore);
 let output:unknown=filtered.map(({subject,hours,score})=>({subject,hours,score})); let count=filtered.length;
 if(method==='group'){const groups:Record<string,number>={};filtered.forEach(s=>{groups[s.subject]=(groups[s.subject]||0)+s.hours;});output=groups;count=Object.keys(groups).length;}
 if(method==='sort')output=[...filtered].sort((a,b)=>b.score-a.score).map(({name,score})=>({name,score}));
 if(method==='clean')output=filtered.map(({name,score})=>({name,score:Math.round(score)}));
 return {title:`Pandas ${method} transformation (computed in JavaScript)`,input:`5 records · score >= ${minScore} · ${method}`,output:table(output),steps:[`Input has ${sessions.length} observations.`,`Apply Boolean mask: score ≥ ${minScore}.`,method==='group'?'Group by subject and sum hours.':method==='sort'?'Sort by score descending.':method==='clean'?'Project cleaned columns.':'Select matching rows.',`Final result: ${count} ${method==='group'?'groups':'rows'}.`],question:`How many ${method==='group'?'groups':'rows'} are in the transformed result?`,correct:count,unit:method==='group'?'groups':'rows',kind:'computed'};
}
export function runNumPyExercise(mode:'broadcast'|'reshape'|'filter'|'matrix'|'mean',offset:number):ExperimentResult {
 if(!Number.isInteger(offset)||offset<0||offset>10)throw new Error('Parameter must be an integer in [0, 10].');
 const values=[1,2,3,4,5,6];let output:unknown;let correct:number;let unit='';
 if(mode==='broadcast'){output=values.map(x=>x+offset);correct=sum(output as number[]);unit='sum';}
 else if(mode==='reshape'){output=[[1,2,3],[4,5,6]];correct=6;unit='elements';}
 else if(mode==='filter'){output=values.filter(x=>x>offset);correct=(output as number[]).length;unit='elements';}
 else if(mode==='matrix'){const a=[[1,2],[3,4]], b=[[2,0],[1,2]];output=a.map(row=>b[0].map((_,j)=>row.reduce((t,n,k)=>t+n*b[k][j],0)));correct=(output as number[][])[0][0];unit='first element';}
 else {correct=sum(values)/values.length;output={mean:correct};unit='mean';}
 const question=mode==='broadcast'?'What is the sum of the broadcast result?':mode==='matrix'?'What is the top-left element of A @ B?':mode==='mean'?'What is the array mean?':`How many ${unit} does the result contain?`;
 return {title:`NumPy ${mode} (computed in JavaScript)`,input:table({array:values,parameter:offset,mode}),output:table(output),steps:['Start with six numeric elements.',`Apply ${mode} operation.`,`Validate shape and computed values.`,`Required answer: ${unit}.`],question,correct,unit,kind:'computed'};
}
export type Point={x:number;y:number};
export const training:Point[]=[{x:1,y:42},{x:2,y:52},{x:3,y:62},{x:4,y:72}];
export const heldOut:Point[]=[{x:5,y:82},{x:6,y:92}];
export type RegressionState={epoch:number;weight:number;bias:number;loss:number};
export function trainRegression(rate:number,epochs:number):RegressionState[]{
 if(!Number.isFinite(rate)||rate<=0||rate>0.05||!Number.isInteger(epochs)||epochs<1||epochs>200)throw new Error('Rate must be (0,0.05] and epochs 1–200.');
 let w=0,b=0;const states:RegressionState[]=[];
 for(let epoch=0;epoch<=epochs;epoch++){
  const loss=sum(training.map(p=>(w*p.x+b-p.y)**2))/training.length;
  if(!Number.isFinite(loss))throw new Error('Numerical instability: reduce the learning rate.');
  states.push({epoch,weight:w,bias:b,loss});
  if(epoch===epochs)break;
  const dw=2*sum(training.map(p=>(w*p.x+b-p.y)*p.x))/training.length;
  const db=2*sum(training.map(p=>w*p.x+b-p.y))/training.length;
  w-=rate*dw;b-=rate*db;
 }
 return states;
}
export function runMLExercise(rate:number,epochs:number):ExperimentResult{
 const history=trainRegression(rate,epochs);const final=history.at(-1)!;
 const mae=sum(heldOut.map(p=>Math.abs(final.weight*p.x+final.bias-p.y)))/heldOut.length;
 const prediction=final.weight*5+final.bias;
 return {title:'ML linear regression: gradient descent (actual numeric training)',input:table({training,heldOut,rate,epochs}),output:table({slope:+final.weight.toFixed(3),intercept:+final.bias.toFixed(3),trainMSE:+final.loss.toFixed(3),testMAE:+mae.toFixed(3),predictionAt5:+prediction.toFixed(2),lossHistory:history.filter((_,i)=>i%Math.max(1,Math.floor(epochs/10))===0).map(s=>({epoch:s.epoch,loss:+s.loss.toFixed(2)}))}),steps:[`Train on ${training.length} observations (held-out test records are not trained on).`,`Run ${epochs} gradient updates at learning rate ${rate}.`,`Final training MSE: ${final.loss.toFixed(2)}.`,`Held-out MAE: ${mae.toFixed(2)}.`,`Predicted score at 5 study hours: ${prediction.toFixed(2)}.`],question:'Round the final prediction for 5 study hours to the nearest integer.',correct:Math.round(prediction),unit:'score',kind:'model'};
}
export function runExperiment(world:WorldId,options:{threshold:number;mode:string;subject:string;rate:number;epochs:number}):ExperimentResult{
 switch(world){case 'sql':return runSQLExercise(options.threshold,options.subject);
 case 'pandas':return runPandasExercise(options.threshold,options.mode as 'filter'|'group'|'sort'|'clean');
 case 'numpy':return runNumPyExercise(options.mode as 'broadcast'|'reshape'|'filter'|'matrix'|'mean',options.threshold);
 case 'ml':return runMLExercise(options.rate,options.epochs);
 default:throw new Error('Python uses the separately instrumented subset tracer.');}
}
