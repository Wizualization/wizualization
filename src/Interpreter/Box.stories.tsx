import React from "react";
import { Story } from "@ladle/react";
import { Box } from "./Box";
import { Canvas } from "@react-three/fiber";

export let Boxes: Story = () => (
  <Canvas>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </Canvas>
);
