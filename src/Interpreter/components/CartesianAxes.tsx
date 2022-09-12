import { ReactNode } from "react";
import ViewType from "optomancy/dist/types/ViewType";
import Axis from "./Axis";
import { IndexType } from "../types";

interface ICartesianAxes {
  children?: ReactNode;
  view: ViewType;
}

const CartesianAxes = ({ children, view, ...rest }: ICartesianAxes) => {
  return (
    <mesh {...rest}>
      {view.encoding && view.encoding.x ? (
        <Axis type={"x"} view={view} channel={view.encoding.x} />
      ) : null}
      {view.encoding && view.encoding.y ? (
        <Axis type={"y"} view={view} channel={view.encoding.y} />
      ) : null}
      {view.encoding && view.encoding.z ? (
        <Axis type={"z"} view={view} channel={view.encoding.z} />
      ) : null}
    </mesh>
  );
};

export default CartesianAxes;
