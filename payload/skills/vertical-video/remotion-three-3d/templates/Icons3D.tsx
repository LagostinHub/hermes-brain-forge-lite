import React, {useRef} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';

// Materials as ELEMENT-returning components (P2: never material={OBJ} prop)
const Steel = () => <meshStandardMaterial color="#c8d0da" metalness={0.55} roughness={0.35} />;
const SteelDark = () => <meshStandardMaterial color="#9aa4b0" metalness={0.55} roughness={0.4} />;
const Black = () => <meshStandardMaterial color="#1c1c24" metalness={0.4} roughness={0.5} />;
const Enamel = () => <meshStandardMaterial color="#E91E8C" metalness={0.25} roughness={0.3} emissive="#E91E8C" emissiveIntensity={0.18} />;
const EnamelLight = () => <meshStandardMaterial color="#FF5CB0" metalness={0.2} roughness={0.32} />;
const Gold = () => <meshStandardMaterial color="#F4C430" metalness={0.6} roughness={0.3} emissive="#F4C430" emissiveIntensity={0.12} />;
const GoldDk = () => <meshStandardMaterial color="#d9a400" metalness={0.6} roughness={0.35} />;
const Leather = () => <meshStandardMaterial color="#7a2090" metalness={0.1} roughness={0.75} />;
const GlassDisc = () => <meshStandardMaterial color="#6a1c80" metalness={0.2} roughness={0.3} transparent opacity={0.28} />;
const GlassRing = () => <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.15} transparent opacity={0.35} />;
const Win = () => <meshStandardMaterial color="#9fe8ff" metalness={0.3} roughness={0.1} transparent opacity={0.7} />;
const Head = () => <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={0.6} roughness={0.4} />;

function Disc({x}:{x:number}){
  return (
    <group position={[x,0.3,-0.4]}>
      <mesh><torusGeometry args={[1.5,0.12,24,64]} /><GlassRing/></mesh>
      <mesh rotation={[Math.PI/2,0,0]} position={[0,0,-0.1]}><cylinderGeometry args={[1.5,1.5,0.18,64]} /><GlassDisc/></mesh>
    </group>
  );
}
// P1: animation via useFrame in a CHILD component (ref-based)
function SpinGroup({children, x, phase, baseY}:{children:React.ReactNode;x:number;phase:number;baseY:number}){
  const ref=useRef<THREE.Group>(null);
  useFrame(({clock})=>{
    if(!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime*0.5 + phase)*0.35;
    ref.current.position.y = baseY + Math.sin(clock.elapsedTime*1.1 + phase)*0.12;
  });
  return <group ref={ref} position={[x,baseY,0]}>{children}</group>;
}
function Cutlery(){
  return (
    <group>
      <mesh position={[-0.38,0.25,0]} castShadow><boxGeometry args={[0.18,1.5,0.05]} /><Steel/></mesh>
      <mesh position={[-0.38,-0.72,0]} castShadow><boxGeometry args={[0.15,0.95,0.1]} /><Black/></mesh>
      <mesh position={[0.42,0.95,0]} castShadow><boxGeometry args={[0.38,0.55,0.06]} /><Steel/></mesh>
      {[-1,0,1].map(i=>(<mesh key={i} position={[0.42+i*0.14,1.28,0]} castShadow><boxGeometry args={[0.08,0.6,0.05]} /><Steel/></mesh>))}
      <mesh position={[0.42,-0.72,0]} castShadow><boxGeometry args={[0.15,0.95,0.1]} /><Black/></mesh>
      <mesh position={[0,0.95,0]} scale={[1,0.55,0.42]} rotation={[Math.PI,0,0]} castShadow><sphereGeometry args={[0.22,20,20,0,Math.PI*2,0,Math.PI/2]} /><Steel/></mesh>
    </group>
  );
}
function Bus(){
  return (
    <group>
      <mesh castShadow><boxGeometry args={[2.0,1.0,1.0]} /><Enamel/></mesh>
      <mesh position={[0,0.55,0]} castShadow><boxGeometry args={[1.7,0.25,0.9]} /><EnamelLight/></mesh>
      {[-1,0,1].map(i=>(<mesh key={i} position={[i*0.55,0.1,0.51]}><boxGeometry args={[0.4,0.4,0.02]} /><Win/></mesh>))}
      <mesh position={[-0.7,-0.35,0.51]}><boxGeometry args={[0.18,0.18,0.05]} /><Head/></mesh>
      <mesh position={[0.7,-0.35,0.51]}><boxGeometry args={[0.18,0.18,0.05]} /><Head/></mesh>
      <group position={[-0.6,-0.6,0]}><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[0.32,0.32,0.22,28]} /><Black/></mesh><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[0.14,0.14,0.24,16]} /><SteelDark/></mesh></group>
      <group position={[0.6,-0.6,0]}><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[0.32,0.32,0.22,28]} /><Black/></mesh><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[0.14,0.14,0.24,16]} /><SteelDark/></mesh></group>
    </group>
  );
}
function Cap(){
  const tassel = useRef<THREE.Group>(null);
  useFrame(({clock})=>{ if(tassel.current) tassel.current.rotation.z = Math.sin(clock.elapsedTime*1.6)*0.18; });
  return (
    <group>
      <mesh position={[0,0.1,0]} rotation={[0,0,0.06]} castShadow><boxGeometry args={[1.7,0.18,1.7]} /><Black/></mesh>
      <mesh position={[0,0.22,0]} rotation={[0,0,0.06]} castShadow><boxGeometry args={[1.55,0.1,1.55]} /><SteelDark/></mesh>
      <mesh position={[0,0.4,0]} castShadow><sphereGeometry args={[0.12,16,16]} /><Gold/></mesh>
      <mesh position={[0,0.15,0]} castShadow><cylinderGeometry args={[0.02,0.02,0.55,8]} /><SteelDark/></mesh>
      <group ref={tassel} position={[0.7,0.0,0.7]}>
        <mesh position={[0,-0.45,0]} castShadow><sphereGeometry args={[0.18,16,16]} /><Leather/></mesh>
        {Array.from({length:8}).map((_,i)=>{const a=i/8*Math.PI*2; return (<mesh key={i} position={[Math.cos(a)*0.08,-0.6,Math.sin(a)*0.08]}><boxGeometry args={[0.03,0.35,0.03]} /><Leather/></mesh>);})}
      </group>
    </group>
  );
}
function Coins(){
  const items=[];
  for(let i=0;i<4;i++){
    items.push(
      <group key={i}>
        <mesh position={[0,-0.5+i*0.2,0]} rotation={[Math.PI/2*(i%2?0.04:-0.04),0,0]} castShadow><cylinderGeometry args={[0.85,0.85,0.16,40]} /><Gold/></mesh>
        <mesh position={[0,-0.5+i*0.2+0.085,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[0.55,0.05,12,40]} /><GoldDk/></mesh>
      </group>
    );
  }
  return (
    <group>
      {items}
      <mesh position={[-0.04,0.585,0.0]}>
        <group position={[0,0,-0.05]}>
          <mesh position={[-0.1,0,0]}><boxGeometry args={[0.08,0.5,0.06]} /><GoldDk/></mesh>
          <mesh position={[0.12,0.18,0]}><boxGeometry args={[0.32,0.08,0.06]} /><GoldDk/></mesh>
          <mesh position={[0.08,-0.02,0]}><boxGeometry args={[0.22,0.08,0.06]} /><GoldDk/></mesh>
          <mesh position={[0.22,-0.16,0]} rotation={[0,0,-0.5]}><boxGeometry args={[0.4,0.08,0.06]} /><GoldDk/></mesh>
        </group>
      </mesh>
    </group>
  );
}
// P1: NO useCurrentFrame here. P5: explicit width/height.
export const Icons3D: React.FC<{withBg?:boolean}> = ({withBg=true}) => {
  return (
    <ThreeCanvas style={{background:'transparent'}} width={1920} height={1080} camera={{position:[0,1.5,16], fov:38}}>
      {withBg && (
        <mesh position={[0,0,-12]}>
          <planeGeometry args={[60,40]} />
          <meshStandardMaterial color="#3D1152" emissive="#2a0838" emissiveIntensity={0.6} roughness={1} />
        </mesh>
      )}
      {withBg && <pointLight position={[4,4,-6]} color="#E91E8C" intensity={120} distance={40} />}
      <ambientLight color="#6a4a7a" intensity={0.8} />
      <hemisphereLight color="#E91E8C" groundColor="#3D1152" intensity={0.6} />
      <directionalLight position={[5,8,6]} intensity={2.6} castShadow shadow-mapSize={[1024,1024]} />
      <directionalLight position={[-6,2,4]} color="#E91E8C" intensity={1.3} />
      <directionalLight position={[0,3,-8]} color="#FF5CB0" intensity={1.8} />
      <pointLight position={[0,-2,4]} color="#E91E8C" intensity={35} distance={20} />
      {withBg && <mesh position={[0,-1.4,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
        <planeGeometry args={[40,40]} />
        <meshStandardMaterial color="#1a0726" roughness={1} />
      </mesh>}
      {[-5.4,-1.8,1.8,5.4].map(x=> <Disc key={x} x={x} />)}
      <SpinGroup x={-5.4} phase={0} baseY={0.3}><Cutlery/></SpinGroup>
      <SpinGroup x={-1.8} phase={0.7} baseY={0.5}><Bus/></SpinGroup>
      <SpinGroup x={1.8} phase={1.4} baseY={0.3}><Cap/></SpinGroup>
      <SpinGroup x={5.4} phase={2.1} baseY={0.6}><Coins/></SpinGroup>
    </ThreeCanvas>
  );
};
