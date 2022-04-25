export const MarkIcon = (props:any) => (
    <mesh>
        <sphereGeometry attach="geometry" args={[0.1, 8, 8]} />
            <meshStandardMaterial
            attach="material"
            color="gold"
            roughness={0.1}
            metalness={0.1}
        />
    </mesh>
)