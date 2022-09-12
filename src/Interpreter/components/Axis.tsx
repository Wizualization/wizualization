import * as THREE from "three";
import { Text } from "@react-three/drei";
import { ChannelType, ViewType } from "optomancy/dist/types";
import { ReactNode, useContext, Suspense } from "react";
import { OptionsContext } from "../contexts";
import { AxisTypeType } from "../types";
import Ticks from "./Ticks";

interface IAxis {
  children?: ReactNode;
  type: AxisTypeType;
  view: ViewType;
  channel: ChannelType;
  [props: string]: any;
}

// Axis radius
export const AXIS_RADIUS = 0.005;
// Title font size (Aestehtically pleasing size)
const TITLE_FONT_SIZE = 0.075;
// Title offset (Aestehtically pleasing size)
const TITLE_OFFSET = 0.2;

const Axis = ({ children, type, view, channel, ...rest }: IAxis) => {
  const options = useContext(OptionsContext);
  const axisColor = options?.theme === "light" ? "black" : "white";
  const axisLength = getLength(type, view);

  return channel.axis !== false ? (
    <mesh
      {...rest}
      rotation={getRotation(type, view)}
      position={getPosition(type, view)}
    >
      {/* TODO: Create axis line component from below*/}
      <mesh>
        <cylinderGeometry
          attach="geometry"
          args={[AXIS_RADIUS, AXIS_RADIUS, axisLength]}
        />
        <meshStandardMaterial color={axisColor} />
      </mesh>

      {/* Ticks */}
      <Ticks
        channel={channel}
        axisName={type}
        axisColor={axisColor}
        axisLength={axisLength}
      />

      {/* Title */}
      <mesh>
        <Suspense fallback={null}>
          <Text
            color={axisColor}
            rotation={getTitleRotation(type)}
            position={getTitlePosition(type)}
            fontSize={TITLE_FONT_SIZE}
          >
            {channel.axis!.title}
          </Text>
        </Suspense>
      </mesh>
    </mesh>
  ) : null;
};

function getRotation(type: AxisTypeType, view: ViewType) {
  switch (type) {
    case "x":
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(-90));
    case "y":
      return new THREE.Euler(0, 0, 0);
    case "z":
      return new THREE.Euler(THREE.MathUtils.degToRad(-90), 0, 0);
    default:
      // x
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(90));
  }
}

function getLength(type: AxisTypeType, view: ViewType) {
  switch (type) {
    case "x":
      return view.width ?? 1;
    case "y":
      return view.height ?? 1;
    case "z":
      return view.depth ?? 1;
    default:
      // x
      return view.width ?? 1;
  }
}

function getPosition(type: AxisTypeType, view: ViewType) {
  switch (type) {
    case "x":
      return new THREE.Vector3(0, -view.height! / 2, view.depth! / 2);
    case "y":
      return new THREE.Vector3(-view.width! / 2, 0, view.depth! / 2);
    case "z":
      return new THREE.Vector3(-view.width! / 2, -view.height! / 2, 0);
    default:
      // x
      return new THREE.Vector3(0, -view.height! / 2, view.depth! / 2);
  }
}

function getTitleRotation(type: AxisTypeType) {
  switch (type) {
    case "x":
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(90));
    case "y":
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(90));
    case "z":
      return new THREE.Euler(
        0,
        THREE.MathUtils.degToRad(-90),
        THREE.MathUtils.degToRad(-90)
      );
    // x
    default:
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(90));
  }
}

function getTitlePosition(type: AxisTypeType) {
  switch (type) {
    case "x":
      return new THREE.Vector3(TITLE_OFFSET, 0, 0);
    case "y":
      return new THREE.Vector3(-TITLE_OFFSET, 0, 0);
    case "z":
      return new THREE.Vector3(0, 0, -TITLE_OFFSET);
    // x
    default:
      new THREE.Vector3(0, -TITLE_OFFSET, 0);
  }
}

export default Axis;
