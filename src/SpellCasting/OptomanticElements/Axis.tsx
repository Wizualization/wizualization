/*demoState === 3 || demoState === 4 || demoState === 5? props.scales.y(el.petalLength) : demoState === 2 ? 0.02 : 0,
demoState === 4 || demoState === 5 ? props.scales.z(el.sepalWidth) : 0,*/
import * as THREE from 'three';

export const Axis = (props:any) => {
    return <>{props.data.map((el: any, i: number) => {//(el: any, i: number)
        return (
        <mesh
            key={`geom${i}`}
            position={[
            props.scales.x(el.petalWidth),
            0, 0
            ]}
        >
            <sphereGeometry attach="geometry" args={[0.01, 8, 8]} />
            <meshStandardMaterial
            attach="material"
            color={props.color ? new THREE.Color(props.scales.color(props.color)) : "white"}
            roughness={0.1}
            metalness={0.1}
            />
        </mesh>
        );
    })}</>
}