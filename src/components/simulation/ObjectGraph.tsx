import type {Snapshot} from '../../engine/execution/interpreter';
export function ObjectGraph({state}:{state:Snapshot}) {
 const names=Object.keys(state.bindings);
 return <section className="object-graph" aria-label="Python references visualization">
 <div className="graph-heading"><span className="pulse-dot"/> MEMORY MODEL <span className="subtle">conceptual, not physical RAM</span></div>
 {names.length===0?<div className="empty-graph">No names bound yet. Run or step through the example.</div>:
 <div className="graph-cols"><div className="graph-column"><small>NAMES</small>{names.map(name=><div className="reference" key={name}><span>{name}</span><span className="arrow">↗</span><code>{state.bindings[name]}</code></div>)}</div>
 <div className="graph-column"><small>OBJECTS</small>{[...new Set(Object.values(state.bindings))].map(id=>{const obj=state.objects[id];return <div className="heap-object" key={id}><small>{id} · {obj.type}</small><strong>{JSON.stringify(obj.value)}</strong></div>;})}</div></div>}
 <div className="explain-current">{state.description}</div>
 </section>;
}
