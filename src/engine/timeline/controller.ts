import type { Snapshot, Trace } from '../execution/interpreter';
export class Timeline {
  private cursor=0;
  constructor(public trace:Trace) { if(!trace.events.length) throw new Error('No trace events'); }
  get index() {return this.cursor;}
  get length() {return this.trace.events.length;}
  get current():Snapshot {return this.trace.events[this.cursor];}
  seek(step:number):Snapshot {this.cursor=Math.max(0,Math.min(this.length-1,Math.trunc(step)));return this.current;}
  next():Snapshot{return this.seek(this.cursor+1);}
  back():Snapshot{return this.seek(this.cursor-1);}
  reset():Snapshot{return this.seek(0);}
}
