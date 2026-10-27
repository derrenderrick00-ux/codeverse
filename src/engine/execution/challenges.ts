import {executeSubset,UnsupportedSyntax} from './interpreter';
export type Grade={pass:boolean;messages:string[]};
/** Mini-project's runnable, bounded rubric; the student's code itself is checked, not a checkbox. */
export function gradeStudentProfile(code:string):Grade {
 try {
  const trace=executeSubset(code);const last=trace.events.at(-1)!;const messages:string[]=[];
  const val=(key:string)=>{const id=last.bindings[key];return id?last.objects[id].value:undefined;};
  if(typeof val('name')!=='string'||!(val('name') as string).trim())messages.push('Create a nonempty string variable named name.');
  if(typeof val('university')!=='string'||!(val('university') as string).trim())messages.push('Create university as a string.');
  if(typeof val('course')!=='string'||!(val('course') as string).trim())messages.push('Create course as a string.');
  if(!Number.isInteger(val('year')) || Number(val('year'))<1)messages.push('Create year as a positive integer.');
  const c=val('completed'),p=val('pending'),t=val('total'),percent=val('percentage');
  if(!Number.isInteger(c)||Number(c)<0||!Number.isInteger(p)||Number(p)<0)messages.push('completed and pending must be nonnegative integers.');
  if(typeof c==='number' && typeof p==='number') {
   if(t!==c+p)messages.push('The combined assignment count does not match the two input counts.');
   if(c+p<=0)messages.push('Provide at least one assignment to calculate a percentage.');
   else if(typeof percent!=='number'||Math.abs(percent-100*c/(c+p))>0.0001)messages.push('The percentage is inconsistent with the completed and total assignment counts.');
  }
  if(trace.output.length<4)messages.push('Print at least four lines reporting the profile and calculations.');
  const output=trace.output.join(' ');for(const [field,value] of [['name',val('name')],['university',val('university')],['course',val('course')],['percentage',val('percentage')]] as const){if(value!==undefined&&!output.includes(String(value)))messages.push(`Print the calculated ${field} value in your report.`);}
  return {pass:messages.length===0,messages:messages.length?messages:['Correct: required variables, calculated totals, and output checks passed.']};
 } catch(e){return {pass:false,messages:[e instanceof UnsupportedSyntax?`Line ${e.line??'?'}: ${e.message}`:String(e)]};}
}
export function gradeBuild(code:string,expectedOutput:string):Grade {
 try {const trace=executeSubset(code);const actual=trace.output.join('\n').trim();return actual===expectedOutput.trim()?{pass:true,messages:['Exact expected output produced.']}:{pass:false,messages:[`Output differs from the target. Received: ${actual || '(empty)'}. Recheck the required calculation and compare with your trace.`]};}
 catch(e){return {pass:false,messages:[e instanceof Error?e.message:String(e)]};}
}

/** Specific Variables build validator: do not award mastery for hard-coded print statements. */
export function gradeVariablesBuild(code:string):Grade {
 const graded=gradeBuild(code,'20\n10'); if(!graded.pass)return graded;
 try{const trace=executeSubset(code);const last=trace.events.at(-1)!;const value=(name:string)=>{const id=last.bindings[name];return id?last.objects[id]?.value:undefined;};
 if(value('x')!==20||value('y')!==10)return {pass:false,messages:['The final name bindings disagree with the variable-reference trace. Compute the output instead of hard-coding it.']};
 return {pass:true,messages:['Output and final Python name bindings verified.']};
 }catch(e){return {pass:false,messages:[e instanceof Error?e.message:String(e)]};}
}

/** Local proof is explicitly self-reported; this validates formatting, not execution authenticity. */
export function gradeLocalEvidence(code:string,observed:string,referenceOutput:string,confirmed:boolean,isShell:boolean):Grade {
 const messages:string[]=[];
 if(!confirmed)messages.push('Confirm the example was executed locally before submitting evidence.');
 if(code.trim().length<25)messages.push('Provide the local source or commands (minimum 25 characters).');
 if(isShell){if(!/^Python 3\.\d+(?:\.\d+)?\b/.test(observed.trim()))messages.push('For virtual environments, enter the observed Python 3.x version output from the terminal.');}
 else if(observed.trim()!==referenceOutput.trim())messages.push('Observed output does not match the lesson reference; rerun in Python and inspect differences.');
 return {pass:messages.length===0,messages:messages.length?messages:['Local run evidence accepted (learner attestation, not verified execution).']};
}
