import { ReactNode } from "react";

interface IMarks {
  children?: ReactNode;
  [props: string]: any;
}

const Marks = ({ children, ...rest }: IMarks) => {
  return (
    <mesh {...rest}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
};

export default Marks;
