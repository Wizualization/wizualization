import "@react-three/fiber";
import { FC } from 'react';

type BoxProps = JSX.IntrinsicElements['mesh'];

export let Box: FC<BoxProps> = props => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"hotpink"} />
    </mesh>
  );
};
