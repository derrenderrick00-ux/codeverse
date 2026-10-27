import {Component,lazy,Suspense} from 'react';
import type {ErrorInfo,ReactNode} from 'react';
const Atlas3D=lazy(()=>import('./Atlas3D'));
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
 state={failed:false};static getDerivedStateFromError(){return {failed:true}};
 componentDidCatch(error:Error,_info:ErrorInfo){console.warn('WebGL scene failed; retained 2D navigation',error.message)}
 render(){return this.state.failed?<p role="status" className="callout">3D unavailable. Select any world using the accessible cards below.</p>:this.props.children;}
}
export function AtlasSafe({enabled,still}:{enabled:boolean;still:boolean}){
 const webgl=(()=>{try{const canvas=document.createElement('canvas');return !!(canvas.getContext('webgl2')||canvas.getContext('webgl'));}catch{return false;}})();
 if(!enabled||!webgl)return <div className="atlas-banner"><span>◎</span><p>2D ATLAS MODE<br/><small>All five worlds are available below.</small></p></div>;
 return <SceneBoundary><Suspense fallback={<p>Loading lightweight 3D atlas…</p>}><Atlas3D still={still}/></Suspense></SceneBoundary>;
}
