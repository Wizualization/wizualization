/*demoState === 3 || demoState === 4 || demoState === 5? props.scales.y(el.petalLength) : demoState === 2 ? 0.02 : 0,
demoState === 4 || demoState === 5 ? props.scales.z(el.sepalWidth) : 0,*/
import * as THREE from 'three';

export const PlotArea = (props:any) => {
        return <mesh>
        {props.data.map((el: any, i: number) => {//(el: any, i: number)
            return (
                <mesh
                    key={`geom${i}`}
                    position={[
                    props.scales.x(el[props.xVariableName]), //must at least have an x variable
                    props.yVariableName ? props.scales.y(el[props.yVariableName]) : 0.02,
                    props.zVariableName ? props.scales.z(el[props.zVariableName]) : 0.02
                    ]}
                >
                    <sphereGeometry attach="geometry" args={[0.01, 8, 8]} />
                    <meshStandardMaterial
                    attach="material"
                    color={props.colorVar ? new THREE.Color(props.scales.color(el[props.colorVar])) : "white"}
                    roughness={0.1}
                    metalness={0.1}
                    />
                </mesh>
            );
        })}
    </mesh>
}

