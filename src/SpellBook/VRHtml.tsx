import React from "react";
import html2canvas from "html2canvas";
import { renderToString } from "react-dom/server";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
// credit: https://github.com/pmndrs/react-xr/issues/21#issuecomment-982593707
// Prevents html2canvas warnings
// @todo maybe remove this if it causes performance issues?

let container = document.querySelector("#htmlContainer");
if (!container) {
  const node = document.createElement("div");
  node.setAttribute("id", "htmlContainer");
  node.style.position = "fixed";
  node.style.opacity = "0";
  node.style.pointerEvents = "none";
  document.body.appendChild(node);
  container = node;
}

function VRHtml({
  children,
  width,
  height,
  color = "transparent",
} : any) {
  const { camera, size: viewSize, gl } = useThree();

  const sceneSize = React.useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fov = (cam.fov * Math.PI) / 180; // convert vertical fov to radians
    const height = 2 * Math.tan(fov / 2) * 5; // visible height
    const width = height * (viewSize.width / viewSize.height);
    return { width, height };
  }, [camera, viewSize]);

  const lastUrl = React.useRef('');

  const [image, setImage] = React.useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
  );
  const [textureSize, setTextureSize] = React.useState({ width, height });

  const node = React.useMemo(() => {
    const node = document.createElement("div");
    node.innerHTML = renderToString(children);
    return node;
  }, [children]);

  React.useEffect(() => {
    if(container){
    container.appendChild(node);
    html2canvas(node, { backgroundColor: color }).then((canvas : any) => {
      setTextureSize({ width: canvas.width, height: canvas.height });
      if (container!.contains(node)) {
        container!.removeChild(node);
      }
      canvas.toBlob((blob : any) => {
        if (blob === null) return;
        if (lastUrl.current !== null) {
          URL.revokeObjectURL(lastUrl.current);
        }
        const url = URL.createObjectURL(blob);
        lastUrl.current = url;
        setImage(url);
      });
    });
    return () => {
      if (!container) return;
      if (container.contains(node)) {
        container.removeChild(node);
      }
    };
    }
  }, [node, viewSize, sceneSize, color]);

  const texture = useTexture(image);

  const size = React.useMemo(() => {
    const imageAspectW = texture.image.height / texture.image.width;
    const imageAspectH = texture.image.width / texture.image.height;

    const cam = camera as THREE.PerspectiveCamera;
    const fov = (cam.fov * Math.PI) / 180; // convert vertical fov to radians

    let h = 2 * Math.tan(fov / 2) * 5; // visible height
    let w = h * imageAspectH;

    if (width !== undefined) {
      w = width;
    }
    if (height !== undefined) {
      h = height;
    }

    if (height === undefined) {
      h = width * imageAspectW;
    }
    if (width === undefined) {
      w = h * imageAspectH;
    }
    return {
      width: w,
      height: h,
    };
  }, [texture, width, height, camera]);

  React.useMemo(() => {
    texture.matrixAutoUpdate = false;
    const aspect = size.width / size.height;
    const imageAspect = texture.image.width / texture.image.height;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearFilter;
    if (aspect < imageAspect) {
      texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
    } else {
      texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
    }
  }, [texture, size, textureSize]);

  return (
    <mesh>
      <planeBufferGeometry args={[size.width, size.height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
    </mesh>
  );
}

export { VRHtml };