export const Axis = (props:any) => (
    <mesh 
        position={props.position}
        rotation={props.rotation}
    >
        <cylinderGeometry
        attach="geometry"
        args={[0.01, 0.01, 0.5]}
        />
        <meshBasicMaterial attach="material" color="white" />
    </mesh>
)