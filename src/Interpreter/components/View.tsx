import { ViewType } from "optomancy/dist/types";
import { ReactNode, useContext } from "react";
import * as THREE from "three";
import { IndexContext } from "../contexts";
import CartesianAxes from "./CartesianAxes";
import Marks from "./Marks";

function getViewPosition(view: ViewType, index: number) {
  const viewMargin = 0.2;
  return new THREE.Vector3(0, index + viewMargin * index, -1);
}

interface IView {
  children?: ReactNode;
  view: ViewType;
  [props: string]: any;
}

// TODO: Make contexts for viewIndex and workspaceIndex?
const View = ({ children, view, ...rest }: IView) => {
  const index = useContext(IndexContext);

  return (
    <mesh {...rest} position={getViewPosition(view, index.view)}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"green"}
          opacity={0.1}
          transparent={true}
        />
      </mesh>

      {/* Cartesian Axes */}
      <CartesianAxes view={view} />

      {/* Marks */}
      <Marks position={[-0.25, -0.25, -0.25]} />
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"red"} />
      </mesh> */}
      {children}
    </mesh>
  );
};

export default View;
