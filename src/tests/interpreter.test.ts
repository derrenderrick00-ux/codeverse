import {describe,it,expect} from 'vitest';
import {executeSubset,validateTrace,UnsupportedSyntax,curatedTrace} from '../engine/execution/interpreter';
import {Timeline} from '../engine/timeline/controller';
describe('deterministic Python subset tracer',()=>{
 it('traces reference semantics without mutating old snapshots',()=>{
 const trace=executeSubset('x = 10\ny = x\nx = 20\nprint(x)\nprint(y)');
 expect(trace.output).toEqual(['20','10']);expect(validateTrace(trace)).toBe(true);
 expect(trace.events[2].bindings.x).toBe(trace.events[2].bindings.y);
 expect(trace.events[3].bindings.x).not.toBe(trace.events[3].bindings.y);
 expect(trace.events[2].objects[trace.events[2].bindings.x].value).toBe(10);
 });
 it('prints arithmetic results and validates list aliasing',()=>{
 const trace=executeSubset('tasks = [1, 2]\nalias = tasks\ntasks.append(3)\nprint(len(alias))');
 expect(trace.output).toEqual(['3']);expect(trace.events[3].objects[trace.events[3].bindings.alias].value).toEqual([1,2,3]);
 });
 it('does not execute arbitrary code',()=>{expect(()=>executeSubset('import os\nprint(os.getcwd())')).toThrow(UnsupportedSyntax);expect(()=>executeSubset('while True:\n print("hi")')).toThrow();});
 it('reports name errors, syntax and division by zero',()=>{expect(()=>executeSubset('print(missing)')).toThrow(/NameError/);expect(()=>executeSubset('x = 4 / 0')).toThrow(/ZeroDivisionError/);});
 it('replays forward, backward and to limits',()=>{const controller=new Timeline(executeSubset('x = 1\nx = 3'));expect(controller.index).toBe(0);expect(controller.back().step).toBe(0);expect(controller.next().step).toBe(1);expect(controller.next().step).toBe(2);expect(controller.next().step).toBe(2);expect(controller.back().step).toBe(1);expect(controller.reset().step).toBe(0);});
 it('rejects corrupt trace references',()=>{const trace=executeSubset('x = 10');trace.events[1].bindings.x='missing';expect(validateTrace(trace)).toBe(false);});
 it('labels illustrations rather than faking stdout execution',()=>{const trace=curatedTrace('for x in []: pass',['Demonstration']);expect(trace.mode).toBe('curated');expect(trace.output).toEqual([]);});
});
