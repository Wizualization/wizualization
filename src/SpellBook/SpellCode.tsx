//This is where the code is formatted into pretty syntax-highlighted blocks
import * as THREE from 'three';
import { Suspense } from 'react';
import { Plane, Text } from '@react-three/drei';
import { VRHtml } from './VRHtml'
import Prism from "prismjs";
import './prism.min.css';

const SpellCode = ({ code, language, optoClass }: any) => {
  //console.log(code);
  const hidden = false;

  /**Choose whether we want to use HTML (inefficient, but has syntax highlighting) or react-three drei Text (efficient, no highlighting)*/
  const useHTML = false;

  if (useHTML) {
    const highlightedText = Prism.highlight(
      code,
      Prism.languages[language],
      language
    );
    return (
      <Suspense fallback={<></>}>
        <VRHtml
          width={2}
          height={1.25}
          style={{
            transition: "all 0.2s",
            opacity: hidden ? 0 : 1,
            transform: `scale(${hidden ? 2 : 1})`
          }}
          distanceFactor={1.5}
          position={[0, 0, 0.01]}
          transform
          occlude
        >
          <div
            className="Code"
            style={{
              fontFamily: "Lucida Console, Courier, monospace",
              fontSize: "100px",
              margin: "1px",
              backgroundColor: "white"
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: highlightedText }}></div>
          </div>
        </VRHtml>
      </Suspense>
    );
  }
  const white = new THREE.MeshLambertMaterial({
    color: "white",
    side: THREE.DoubleSide
  });
  return (
    <mesh>
      <Plane args={[1.65, 2.25]} material={white} />
      <Suspense fallback={null}>
        <Text
          color="black"
          anchorX="center"
          anchorY="top"
          outlineWidth="5%"
          position={[0, 1.05, 0.01]}
        >
          {optoClass.toUpperCase()}
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.01]}
        >
          {code
            .replaceAll("[", "=>")
            .replaceAll("{", "")
            .replaceAll("]", "")
            .replaceAll("}", "")}
        </Text>
      </Suspense>
    </mesh>
  );
};

export default SpellCode;
