import { ChannelType } from "optomancy/dist/types";
import { useContext, Suspense } from "react";
import { IndexContext, OptionsContext, OptomancyContext } from "../contexts";
import { AxisTypeType } from "../types";
import { AXIS_RADIUS } from "./Axis";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ITicks {
  channel: ChannelType;
  axisName: AxisTypeType;
  axisColor: string;
  axisLength: number;
}

const Ticks = ({
  channel,
  axisName,
  axisColor,
  axisLength,
  ...rest
}: ITicks) => {
  const optomancy = useContext(OptomancyContext);
  const index = useContext(IndexContext);
  const options = useContext(OptionsContext);

  // Tick radius (Double the radius of the axis itself)
  const TICK_RADIUS = AXIS_RADIUS * 2;
  // Tick width (Radius of axis itself)
  const TICK_WIDTH = AXIS_RADIUS;
  // Tick label font size (Aestehtically pleasing size)
  const LABEL_FONT_SIZE = 0.03;

  // Ticks
  let tickValues;
  let tickOffset = 0;
  let tickCount = null;

  // FIXME: Once d3 is installed, type this with ScaleLinear | ScaleOrdinal etc...
  const axisScale: any =
    optomancy!.scales[index.workspace][index.view][index.layer][axisName];

  // Use scale for ticks for quantitative fields
  if (channel.type === "quantitative") {
    // Tick values from scale
    tickCount = channel?.axis?.tickCount || tickCount;
    if (tickCount !== null) {
      tickValues = axisScale.ticks(tickCount);
    } else {
      tickValues = axisScale.ticks();
    }

    // Use scale domain for ticks for categorical fields
  } else {
    tickValues = axisScale.domain();
    tickOffset = axisScale.bandwidth() / 2;
  }
  // console.log(`w: ${index.workspace}, v: ${index.view}, axis: ${axisName}`);
  // console.log("tick", axisScale(tickValues[0]));

  const ticks = tickValues.map((tick: string | number, i: number) => {
    // Key
    // Example: axt0w0v0l0 = Axis X, Tick 0, Workspace 0, View 0, Layer 0
    const key = `a${axisName}t${i}w${index.workspace}v${index.view}l${index.layer}}`;

    return (
      <mesh
        key={key}
        position={[0, axisScale(tick) + tickOffset - axisLength / 2, 0]}
      >
        <cylinderGeometry
          attach="geometry"
          args={[TICK_RADIUS, TICK_RADIUS, TICK_WIDTH]}
        />
        <meshStandardMaterial color={axisColor} />
      </mesh>
    );
  });

  const labels = tickValues.map((tick: string | number, i: number) => {
    let value = tick;
    if (
      typeof value === "number" &&
      typeof channel?.numberFormat === "string"
    ) {
      // FIXME: Install D3 and fix module resolutions...
      // value = d3.format(numberFormat)(tick);
    }

    // Key
    // Example: axtv0w0v0l0 = Axis X, Tick Value 0, Workspace 0, View 0, Layer 0
    const key = `a${axisName}tv${i}w${index.workspace}v${index.view}l${index.layer}}`;

    return (
      <mesh
        key={key}
        position={getLabelPosition(
          axisName,
          tick,
          axisScale,
          tickOffset,
          axisLength
        )}
        rotation={getLabelRotation(axisName)}
      >
        <Suspense fallback={null}>
          <Text
            color={axisColor}
            anchorX="right"
            anchorY="middle"
            textAlign="right"
            fontSize={LABEL_FONT_SIZE}
          >
            {value}
          </Text>
        </Suspense>
      </mesh>
    );
  });

  return (
    <mesh>
      {ticks}
      {labels}
    </mesh>
  );
};

function getLabelPosition(
  type: AxisTypeType,
  tick: string | number,
  // FIXME: Once d3 is installed, type this with ScaleLinear | ScaleOrdinal etc...
  axisScale: any,
  tickOffset: number,
  axisLength: number
) {
  // Tick label offset (Aesthetically pleasing distance)
  const LABEL_OFFSET = -0.05;

  switch (type) {
    case "x":
      return new THREE.Vector3(
        -LABEL_OFFSET,
        axisScale(tick) + tickOffset - axisLength / 2,
        0
      );
    case "y":
      return new THREE.Vector3(
        LABEL_OFFSET,
        axisScale(tick) + tickOffset - axisLength / 2,
        0
      );
    case "z":
      return new THREE.Vector3(
        0,
        axisScale(tick) + tickOffset - axisLength / 2,
        LABEL_OFFSET
      );
    default:
      return new THREE.Vector3(
        -LABEL_OFFSET,
        axisScale(tick) + tickOffset - axisLength / 2,
        0
      );
  }
}

function getLabelRotation(type: AxisTypeType) {
  switch (type) {
    case "x":
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(180));
    case "y":
      return new THREE.Euler(0, 0, 0);
    case "z":
      return new THREE.Euler(
        THREE.MathUtils.degToRad(-90),
        THREE.MathUtils.degToRad(-90),
        THREE.MathUtils.degToRad(-90)
      );
    default:
      // x
      return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(180));
  }
}

export default Ticks;
