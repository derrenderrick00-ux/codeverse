import {Canvas, useFrame} from '@react-three/fiber';
import {useRef} from 'react';
import type {Mesh} from 'three';
import {worlds} from '../../lessons/catalog';
import {useNavigate} from 'react-router-dom';
function Orb({index,color,id,still}:{index:number;color:string;id:string;still:boolean}) {
 const mesh=useRef<Mesh>(null);const navigate=useNavigate();useFrame((state,delta)=>{if(mesh.current&&!still){mesh.current.rotation.y+=delta*.1;mesh.current.position.y=Math.sin(state.clock.elapsedTime*.7+index)*.17;}});
 const positions:[number,number,number][]=[[-3.5,.1,0],[-1.75,.8,0],[0,-.15,0],[1.75,.8,0],[3.5,.1,0]];
 return <mesh ref={mesh} position={positions[index]} onClick={()=>navigate(`/world/${id}`)} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}><icosahedronGeometry args={[.77,2]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.45} roughness={.3} metalness={.45}/></mesh>;
}
export default function Atlas3D({still}:{still:boolean}){return <div className="atlas-3d" role="img" aria-label="Five glowing 3D world orbs. Equivalent accessible buttons appear underneath."><Canvas camera={{position:[0,2,9],fov:48}} gl={{antialias:false,powerPreference:'low-power'}} dpr={[1,1.4]}><ambientLight intensity={.8}/><pointLight position={[1,4,5]} intensity={35}/>{worlds.map((w,i)=><Orb key={w.id} index={i} id={w.id} color={w.color} still={still}/>)}</Canvas></div>}
