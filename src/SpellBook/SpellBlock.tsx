//This is really just a mesh wrapper that is necessary for grabbing, scaling.
import SpellCode from './SpellCode';
import * as THREE from "three";
//pass block position, code, and language params as props
const SpellBlock = (props: any) => {
  //console.log(props)
  const size = new THREE.Vector3(0.1, 0.05, 0.1);
  return (
    <mesh scale={size}>
      <SpellCode
        code={props.code}
        language={props.language}
        optoClass={props.optoClass}
      />
    </mesh>
  );
};

export { SpellBlock };
