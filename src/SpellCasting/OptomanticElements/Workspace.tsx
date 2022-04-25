import * as THREE from 'three';

export const Workspace = () => (
    <mesh rotation={[THREE.MathUtils.degToRad(90), 0, 0]}>
      <torusGeometry attach="geometry" args={[0.5, 0.01, 16, 100]}/>
      <meshBasicMaterial attach="material" color="gold"/>
    </mesh>
  );

