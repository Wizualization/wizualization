import * as THREE from "three";
import { MathUtils } from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { Stats, OrbitControls, Text } from "@react-three/drei";
import "./styles.css";

let page_width = 0.175;
let page_height = 0.235;
let plane_offset = page_width / 2;
let cover_offset = 0.005;
let scale_factor = 10;
let page_margin = 0.01;

const spell_references = [
  {
    name: "spell1",
    description:
      "This spell does blah blah blah and can be cast via blah blah blah",
    icon: "path_to/icon1.png"
  },
  {
    name: "spell2",
    description:
      "This spell does yadda yadda yadda and can be cast via yadda yadda yadda",
    icon: "path_to/icon2.png"
  },
  {
    name: "spell3",
    description: "This spell does etc etc etc and can be cast via etc etc etc",
    icon: "path_to/icon3.png"
  },
  {
    name: "spell4",
    description: "This spell does something and can be cast via something",
    icon: "path_to/icon4.png"
  },
  {
    name: "spell5",
    description: "This spell does whatever and can be cast via whatever",
    icon: "path_to/icon5.png"
  }
];

const data_placeholder = [
  { name: "dataset1" },
  { name: "dataset2" },
  { name: "dataset3" }
];

const SpellReference = (props: any) => {
  const blue = new THREE.MeshLambertMaterial({
    color: "blue",
    side: THREE.DoubleSide
  });

  return (
    <mesh position={[0, props.y_pos, -0.0001]}>
      <Plane args={[page_width - page_margin, 0.045]} material={blue} />
      <Text
        fontSize={0.01}
        color="black"
        anchorX="center"
        anchorY="top"
        // outlineWidth="5%"
        position={[0, 0, -0.0002]}
        rotation={new THREE.Euler(0, -Math.PI, 0)}
      >
        {props.refText}
      </Text>
    </mesh>
  );
};

const Cube = () => {
  const [bookOpened, isBookOpened] = useState(true);
  const [dataSelectViewed, isDataSelectViewed] = useState(true);
  const [spellRefViewStart, updateSpellRefViewStart] = useState(0);
  const book = useRef<THREE.Mesh>();
  const frontcube = useRef<THREE.Mesh>();
  const backcube = useRef<THREE.Mesh>();

  const frontcover = useRef<THREE.Mesh>();
  const backcover = useRef<THREE.Mesh>();

  const SpellCards = useRef<THREE.Mesh>();
  const DataSelect = useRef<THREE.Mesh>();

  const SpellCardsPlane = useRef<THREE.Mesh>();
  const DataSelectPlane = useRef<THREE.Mesh>();

  useFrame(() => {
    //cube.current!.rotation.x += 0.01;
    //cube.current!.rotation.y += 0.01;
    /*
    frontcube.current!.rotateOnAxis(
      new THREE.Vector3(
        frontcube.current!.position.x,
        frontcube.current!.position.y,
        frontcube.current!.position.z
      ),
      bookOpened
        ? MathUtils.lerp(frontcube.current!.rotation.x, -Math.PI / 2, 0.025)
        : MathUtils.lerp(frontcube.current!.rotation.x, 0, 0.025)
    );
    frontcube.current!.position.y = bookOpened
      ? MathUtils.lerp(frontcube.current!.position.y, -0.5, 0.01)
      : MathUtils.lerp(frontcube.current!.position.y, 0, 0.025);

    frontcube.current!.position.z = bookOpened
      ? MathUtils.lerp(frontcube.current!.position.z, -0.55, 0.025)
      : MathUtils.lerp(frontcube.current!.position.z, -0.05, 0.02);
    */
    book.current!.rotation.x = bookOpened
      ? MathUtils.lerp(book.current!.rotation.x, 0, 0.025)
      : MathUtils.lerp(book.current!.rotation.x, -Math.PI / 4, 0.025);

    frontcube.current!.rotation.y = bookOpened
      ? MathUtils.lerp(frontcube.current!.rotation.y, -Math.PI, 0.025)
      : MathUtils.lerp(frontcube.current!.rotation.y, 0, 0.02);

    frontcover.current!.rotation.y = bookOpened
      ? MathUtils.lerp(frontcube.current!.rotation.y, -Math.PI, 0.025)
      : MathUtils.lerp(frontcube.current!.rotation.y, 0, 0.02);

    DataSelectPlane.current!.scale.y = dataSelectViewed
      ? MathUtils.lerp(DataSelectPlane.current!.scale.y, 1.33, 0.025)
      : MathUtils.lerp(DataSelectPlane.current!.scale.y, 0.5, 0.02);

    SpellCardsPlane.current!.scale.y = dataSelectViewed
      ? MathUtils.lerp(SpellCardsPlane.current!.scale.y, 0.5, 0.02)
      : MathUtils.lerp(SpellCardsPlane.current!.scale.y, 1.33, 0.025);

    DataSelect.current!.position.y = dataSelectViewed
      ? MathUtils.lerp(DataSelect.current!.position.y, 0.1 * page_height, 0.025)
      : MathUtils.lerp(
          DataSelect.current!.position.y,
          0.35 * page_height,
          0.02
        );

    SpellCards.current!.position.y = dataSelectViewed
      ? MathUtils.lerp(
          SpellCards.current!.position.y,
          -0.35 * page_height,
          0.02
        )
      : MathUtils.lerp(
          SpellCards.current!.position.y,
          -0.1 * page_height,
          0.025
        );

    /*
    backcube.current!.position.y = bookOpened
      ? MathUtils.lerp(backcube.current!.position.y, -0.5, 0.01)
      : MathUtils.lerp(backcube.current!.position.y, 0, 0.025);

    backcube.current!.position.z = bookOpened
      ? MathUtils.lerp(backcube.current!.position.z, 0.55, 0.025)
      : MathUtils.lerp(backcube.current!.position.z, 0.05, 0.02);
      */
    /*
    backcube.current!.rotation.y = bookOpened
      ? MathUtils.lerp(backcube.current!.rotation.y, Math.PI / 2, 0.025)
      : MathUtils.lerp(backcube.current!.rotation.y, 0, 0.02);
      */
  });

  const white = new THREE.MeshLambertMaterial({
    color: "white",
    side: THREE.DoubleSide
  });

  const brown = new THREE.MeshLambertMaterial({
    color: "brown",
    side: THREE.DoubleSide
  });

  const red = new THREE.MeshLambertMaterial({
    color: "red",
    side: THREE.DoubleSide
  });

  const green = new THREE.MeshLambertMaterial({
    color: "green",
    side: THREE.DoubleSide
  });

  const blue = new THREE.MeshLambertMaterial({
    color: "blue",
    side: THREE.DoubleSide
  });

  return (
    <mesh scale={[scale_factor, scale_factor, scale_factor]}>
      <mesh ref={book}>
        <mesh ref={frontcover}>
          <mesh
            position={new THREE.Vector3(plane_offset, 0, cover_offset)}
            //onPointerDown={() => isBookOpened(!bookOpened)}
          >
            {/* Page */}
            <Plane args={[page_width, page_height]} material={brown} />
          </mesh>
        </mesh>

        <mesh ref={backcover}>
          <mesh position={new THREE.Vector3(plane_offset, 0, -cover_offset)}>
            {/* Page */}
            <Plane
              args={[page_width, page_height]}
              material={brown}
              //onPointerDown={() => isBookOpened(!bookOpened)}
            />
          </mesh>
        </mesh>

        <mesh ref={frontcube}>
          <mesh position={new THREE.Vector3(plane_offset, 0, 0)}>
            {/* Page */}
            <Plane args={[page_width, page_height]} material={white} />

            {/* Scroll up */}
            {/* TODO: LIMIT OPEN-CLOSE INTERACTION TO CLICKING A SPECIFIC AREA SINCE SCROLLING ALSO OPENS/CLOSES BOOK */}
            <Plane
              args={[0.05, 0.02]}
              material={red}
              position={[0, page_height / 2 - 0.02 / 2, -0.001]}
              onPointerDown={() =>
                updateSpellRefViewStart(
                  spellRefViewStart > 0 ? spellRefViewStart - 1 : 0
                )
              }
            />

            {/* Scroll down */}
            {/* TODO: LIMIT OPEN-CLOSE INTERACTION TO CLICKING A SPECIFIC AREA SINCE SCROLLING ALSO OPENS/CLOSES BOOK */}
            <Plane
              args={[0.05, 0.02]}
              material={green}
              position={[0, -page_height / 2 + 0.02 / 2, -0.001]}
              onPointerDown={() =>
                updateSpellRefViewStart(
                  spellRefViewStart < spell_references.length - 3
                    ? spellRefViewStart + 1
                    : spellRefViewStart
                )
              }
            />

            {/* Spell References */}
            {/* TODO: FINISH FORMATTING */}
            <mesh>
              <SpellReference
                refText={spell_references[spellRefViewStart].description}
                refIcon={spell_references[spellRefViewStart].icon}
                y_pos={0.125 - 0.05}
              />
              <SpellReference
                refText={spell_references[spellRefViewStart + 1].description}
                refIcon={spell_references[spellRefViewStart + 1].icon}
                y_pos={0.025}
              />
              <SpellReference
                refText={spell_references[spellRefViewStart + 2].description}
                refIcon={spell_references[spellRefViewStart + 2].icon}
                y_pos={-0.025}
              />
              <SpellReference
                refText={spell_references[spellRefViewStart + 3].description}
                refIcon={spell_references[spellRefViewStart + 3].icon}
                y_pos={-0.075}
              />
            </mesh>
            {/* 
            <Plane
              args={[page_width - page_margin, 0.045]}
              material={blue}
              position={[0, 0.125 - 0.05, -0.001]}
            />
            <Plane
              args={[page_width - page_margin, 0.045]}
              material={blue}
              position={[0, 0.025, -0.001]}
            />
            <Plane
              args={[page_width - page_margin, 0.045]}
              material={blue}
              position={[0, -0.025, -0.001]}
            />
            <Plane
              args={[page_width - page_margin, 0.045]}
              material={blue}
              position={[0, -0.075, -0.001]}
            />
            */}
            <Text
              fontSize={0.01}
              color="black"
              anchorX="center"
              anchorY="top"
              // outlineWidth="5%"
              position={[0, 0, -0.001]}
              rotation={new THREE.Euler(0, -Math.PI, 0)}
            >
              Lorem Ipsum but not really
            </Text>
          </mesh>
        </mesh>
        <mesh ref={backcube}>
          <mesh position={new THREE.Vector3(plane_offset, 0, 0)}>
            <Plane args={[page_width, page_height]} material={white} />
            <Text
              fontSize={0.01}
              color="black"
              anchorX="center"
              anchorY="top"
              // outlineWidth="5%"
              position={[0, 0, 0.001]}
              //rotation={new THREE.Euler(0, -Math.PI, 0)}
            >
              Test Text
            </Text>
          </mesh>
        </mesh>

        <mesh
          ref={DataSelect}
          position={
            new THREE.Vector3(plane_offset, 0.25 * page_height, cover_offset)
          }
        >
          {/* Page */}
          <Plane
            ref={DataSelectPlane}
            args={[0.95 * page_width, 0.45 * page_height]}
            material={blue}
            onPointerDown={() => isDataSelectViewed(true)}
          />
        </mesh>

        <mesh
          ref={SpellCards}
          position={
            new THREE.Vector3(plane_offset, -0.25 * page_height, cover_offset)
          }
        >
          {/* Page */}
          <Plane
            ref={SpellCardsPlane}
            args={[0.95 * page_width, 0.45 * page_height]}
            material={blue}
            onPointerDown={() => isDataSelectViewed(false)}
          />
        </mesh>
      </mesh>
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <gridHelper />
      <axesHelper />
      <pointLight intensity={1.0} position={[5, 3, 5]} />
      <Cube />
    </>
  );
};

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Canvas
        camera={{
          near: 0.1,
          far: 1000,
          zoom: 1
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#252934");
        }}
      >
        <Stats />
        <OrbitControls />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
