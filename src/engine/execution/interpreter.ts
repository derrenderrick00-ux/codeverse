/* Deliberately restricted teaching tracer. Never uses eval/Function or executes arbitrary Python. */
export type Primitive = number | string | boolean | null;
export type Value = Primitive | Value[];
export type HeapObject = { type: string; value: Value };
export type Snapshot = { step: number; line: number; description: string; bindings: Record<string, string>; objects: Record<string, HeapObject>; stdout: string[]; kind: 'start' | 'bind' | 'print' | 'mutate' };
export type Trace = { schemaVersion: 1; mode: 'subset' | 'curated'; source: string; events: Snapshot[]; output: string[] };
export class UnsupportedSyntax extends Error { constructor(message: string, public line?: number) { super(message); this.name = 'UnsupportedSyntax'; } }
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const describe = (v: Value): string => v === null ? 'None' : typeof v === 'boolean' ? (v ? 'True' : 'False') : typeof v === 'string' ? v : Array.isArray(v) ? `[${v.map(describe).join(', ')}]` : String(v);
export const printable = describe;
function splitTop(source: string, separator: string): string[] {
  const results: string[] = []; let quote = ''; let depth = 0; let from = 0;
  for (let i = 0; i < source.length; i++) { const c = source[i]; if (quote) { if (c === quote && source[i-1] !== '\\') quote = ''; continue; } if (c === '"' || c === "'") { quote = c; continue; } if ('([{'.includes(c)) depth++; if (')]}'.includes(c)) depth--; if (depth < 0) throw new UnsupportedSyntax('Unbalanced brackets'); if (depth === 0 && source.slice(i, i + separator.length) === separator) { results.push(source.slice(from,i).trim()); from = i + separator.length; i += separator.length-1; } }
  if (quote || depth !== 0) throw new UnsupportedSyntax('Unclosed string or brackets'); results.push(source.slice(from).trim()); return results;
}
function findArithmetic(source: string): [string, number] | undefined {
  for (const operators of [['+', '-'], ['*', '//', '/', '%']]) { let quote = ''; let depth = 0; for (let i = source.length-1; i >= 0; i--) { const c = source[i]; if (c === '"' || c === "'") { quote = quote === c ? '' : quote || c; continue; } if (quote) continue; if (c === ']' || c === ')') depth++; if (c === '[' || c === '(') depth--; if (depth === 0 && operators.includes(c) && i > 0 && !(c==='/' && source[i+1]==='/') && source[i-1] !== '*' && source[i-1] !== '+' && source[i-1] !== '-') { const op = c === '/' && source[i-1] === '/' ? '//' : c; return [op, op === '//' ? i-1 : i]; } } }
  return undefined;
}
function evaluate(source: string, bindings: Record<string,string>, heap: Record<string,HeapObject>): { value: Value; reference?: string } {
  const s=source.trim(); if (!s) throw new UnsupportedSyntax('Missing expression');
  if (/^(['"])(?:.|\n)*\1$/.test(s)) return {value:s.slice(1,-1).replace(/\\n/g,'\n')};
  if (/^-?\d+(\.\d+)?$/.test(s)) return {value:Number(s)};
  if (s === 'True' || s === 'False') return {value:s === 'True'};
  if (s === 'None') return {value:null};
  if (/^[A-Za-z_]\w*$/.test(s)) { const id=bindings[s]; if (!id) throw new UnsupportedSyntax(`NameError: '${s}' is not defined`); return { value: clone(heap[id].value), reference:id }; }
  if (s.startsWith('(') && s.endsWith(')')) return evaluate(s.slice(1,-1),bindings,heap);
  if (s.startsWith('[') && s.endsWith(']')) return {value: splitTop(s.slice(1,-1), ',').filter(Boolean).map(part=>evaluate(part,bindings,heap).value)};
  if (s.startsWith('len(') && s.endsWith(')')) { const inner=evaluate(s.slice(4,-1),bindings,heap).value; if (Array.isArray(inner) || typeof inner==='string') return {value:inner.length}; throw new UnsupportedSyntax('len() supports strings and lists'); }
  const index = s.match(/^([A-Za-z_]\w*)\[(\d+)\]$/); if (index) { const object=evaluate(index[1],bindings,heap).value; if (Array.isArray(object) || typeof object==='string') { const i=Number(index[2]); if (i>=object.length) throw new UnsupportedSyntax('IndexError: index out of range'); return {value:object[i] as Value}; } throw new UnsupportedSyntax('Indexing supported for lists and strings only'); }
  const op=findArithmetic(s); if (op) { const [symbol,i]=op; const left=evaluate(s.slice(0,i),bindings,heap).value; const right=evaluate(s.slice(i+symbol.length),bindings,heap).value; if (symbol==='+' && typeof left === 'string' && typeof right === 'string') return {value:left+right}; if (typeof left !== 'number' || typeof right !== 'number') throw new UnsupportedSyntax('Arithmetic requires two numbers (or two strings for +)'); if ((symbol==='/' || symbol==='//' || symbol==='%') && right===0) throw new UnsupportedSyntax('ZeroDivisionError: division by zero'); const result=symbol==='+' ? left+right : symbol==='-' ? left-right : symbol==='*' ? left*right : symbol==='/' ? left/right : symbol==='//' ? Math.floor(left/right) : ((left%right)+right)%right; return {value: result}; }
  throw new UnsupportedSyntax(`Unsupported expression: ${s}. Supported: variables, simple literals, lists, indexing, arithmetic, len(), print().`);
}
function stripComment(raw:string):string{let quote='';let escaped=false;for(let i=0;i<raw.length;i++){const c=raw[i];if(quote){if(c===quote&&!escaped)quote='';if(c==='\\'&&!escaped)escaped=true;else escaped=false;}else if(c==='\"'||c==="'")quote=c;else if(c==='#')return raw.slice(0,i).trimEnd();}return raw;}
export function executeSubset(source:string): Trace {
  if (source.length > 6000 || source.split('\n').length > 120) throw new UnsupportedSyntax('Example exceeds local tracer limits (6000 characters / 120 lines).');
  const bindings:Record<string,string>={}; const heap:Record<string,HeapObject>={}; const stdout:string[]=[];
  let nextObject=0; const events:Snapshot[]=[{step:0,line:0,description:'Ready — no statements executed.',bindings:{},objects:{},stdout:[],kind:'start'}];
  const push=(line:number,description:string,kind:Snapshot['kind']) => events.push({step:events.length,line,description,bindings:clone(bindings),objects:clone(heap),stdout:[...stdout],kind});
  for (const [position,raw] of source.split('\n').entries()) {
    const line=position+1; const text=stripComment(raw).trim(); if(!text || text.startsWith('#')) continue;
    if (raw !== raw.trimStart()) throw new UnsupportedSyntax('Indented code is not supported by the subset tracer; use your local Python interpreter for this lesson.', line);
    if (events.length>100) throw new UnsupportedSyntax('Execution limit reached (100 steps).',line);
    const assignment=text.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
    const print=text.match(/^print\((.*)\)$/);
    const append=text.match(/^([A-Za-z_]\w*)\.append\((.*)\)$/);
    try {
      if (assignment) { const [, name, expression]=assignment; const data=evaluate(expression,bindings,heap); let id=data.reference; if (!id) { id=`obj_${++nextObject}`; const val=data.value; heap[id]={type: Array.isArray(val)? 'list' : val===null?'NoneType':typeof val==='number'?(Number.isInteger(val)?'int':'float'):typeof val==='string'?'str':'bool',value:val}; } bindings[name]=id; push(line,`${name} now refers to ${describe(heap[id].value)}.`, 'bind'); }
      else if (print) { const segments=splitTop(print[1],',').filter(Boolean); const out=segments.map(p=>{const v=evaluate(p,bindings,heap).value; return typeof v==='string'?v:describe(v)}).join(' '); stdout.push(out); push(line,`Printed ${JSON.stringify(out)}.`, 'print'); }
      else if (append) { const [,name,expression]=append; const id=bindings[name]; if(!id) throw new UnsupportedSyntax(`NameError: '${name}' is not defined`); if(!Array.isArray(heap[id].value)) throw new UnsupportedSyntax('append() requires a list'); (heap[id].value as Value[]).push(evaluate(expression,bindings,heap).value); push(line,`Appended an element to ${name}.`, 'mutate'); }
      else throw new UnsupportedSyntax(`Unsupported statement: ${text}. Use the example's Guided trace for advanced Python.`,line);
    } catch (error) { if (error instanceof UnsupportedSyntax) { error.line=line; throw error; } throw error; }
  }
  return { schemaVersion:1,mode:'subset',source,events,output:stdout };
}
export function validateTrace(trace:Trace): boolean {
  if(trace.schemaVersion!==1 || trace.events.length<1 || trace.events[0].step!==0) return false;
  return trace.events.every((snap,index)=> snap.step===index && snap.line>=0 && Array.isArray(snap.stdout) && Object.values(snap.bindings).every(id=>id in snap.objects));
}
export function curatedTrace(source:string,description:string[]): Trace {
  const events: Snapshot[]=[{step:0,line:0,description:'Illustrative steps — not Python interpreter execution.',bindings:{},objects:{},stdout:[],kind:'start'}];
  description.forEach((text,i)=> events.push({step:i+1,line:0,description:text,bindings:{},objects:{},stdout:[],kind:'start'}));
  return {schemaVersion:1,mode:'curated',source,events,output:[]};
}
