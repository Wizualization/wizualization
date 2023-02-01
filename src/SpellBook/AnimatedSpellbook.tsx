import * as THREE from "three";
import { MathUtils } from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { Stats, OrbitControls, Text, useTexture } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as iris from "../examples/datasets/iris.json";
import "./styles.css";

let page_width = 0.175;
let page_height = 0.235;
let plane_offset = page_width / 2;
let cover_offset = 0.005;
let scale_factor = 10;
let page_margin = 0.01;
let dataview_time = 0.2;

const spell_references = [
  {
    name: "Workspace Creation",
    spoken: "Workspace",
    description:
      "Initializes a new workspace, allowing a user to switch between collections of views within the same room",
    icon: "assets/200.png"
  },
  {
    name: "View Creation",
    spoken: "View",
    description: "Creates new views in the current workspace",
    icon: "assets/200.png"
  },
  {
    name: "Axis Creation",
    spoken: "Axis",
    description: "Creates a new axis in the current view",
    icon: "assets/200.png"
  },
  {
    name: "Color",
    spoken: "Color",
    description: "Colors marks by variable values",
    icon: "assets/200.png"
  },
  {
    name: "Object Grouping",
    spoken: "Group",
    description:
      "Initializes a free selection sequence that allows the user to select multiple objects in the scene for shared application of grammar translations",
    icon: "assets/200.png"
  },
  {
    name: "Point Mark Type",
    spoken: "Point",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a scatter plot",
    icon: "assets/200.png"
  },
  {
    name: "Bar Mark Type",
    spoken: "Bar",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a bar chart",
    icon: "assets/200.png"
  },
  {
    name: "Column Mark Type",
    spoken: "Column",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a column chart",
    icon: "assets/200.png"
  },
  {
    name: "Line Mark Type",
    spoken: "Bar",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a line chart",
    icon: "assets/200.png"
  }
];

const data_placeholder = [{ values: iris, name: "Iris" }];
const data_unq_vars = data_placeholder.map((d) => {
  return Object.keys(d.values[0]);
  //eh just use the keys
  /*
  d.values.filter(item => {
    var i = data_unq_vars[d.name].findIndex(
      (x) => x.name == item.name && x.date == item.date && x.amt == item.amt
    );
    if (i <= -1) {
      data_unq_vars[d.name].push(item);
    }
    return null;*/
});

const SpellReference = (props: any) => {
  const white = new THREE.MeshLambertMaterial({
    color: 0x999999,
    side: THREE.DoubleSide
  });
  const blue = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide
  });

  const padding = 0.01;
  const spellHeight = 0.045;

  // const iconTexture = useLoader(TextureLoader, "assets/200.jpg");
  // const iconMaterial = new THREE.MeshStandardMaterial({ map: iconTexture });

  let iconAsset: "string" =
    props.refIcon !== null &&
    props.refIcon !== undefined &&
    typeof props.refIcon === "string"
      ? props.refIcon
      : "assets/200.jpg";

  const iconTexture = useTexture(iconAsset);

  console.log(iconTexture);

  return (
    <mesh position={[0, props.y_pos, -0.0001]}>
      <Plane args={[page_width - page_margin, spellHeight]} material={white} />
      <mesh
        position={[(page_width - page_margin - spellHeight) / 2, 0, -0.001]}
      >
        <planeBufferGeometry
          attach="geometry"
          args={[spellHeight, spellHeight]}
        />
        <meshStandardMaterial attach="material" map={iconTexture} />
      </mesh>

      <Text
        fontSize={0.007}
        color="black"
        anchorX="left"
        anchorY="middle"
        textAlign="left"
        maxWidth={page_width - page_margin - padding - spellHeight}
        // outlineWidth="5%"
        position={[spellHeight - padding, 0, -0.0002]}
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
      ? MathUtils.lerp(
          DataSelectPlane.current!.scale.y,
          1.33,
          dataview_time + 0.005
        )
      : MathUtils.lerp(DataSelectPlane.current!.scale.y, 0.5, dataview_time);

    SpellCardsPlane.current!.scale.y = dataSelectViewed
      ? MathUtils.lerp(SpellCardsPlane.current!.scale.y, 0.5, dataview_time)
      : MathUtils.lerp(
          SpellCardsPlane.current!.scale.y,
          1.33,
          dataview_time + 0.005
        );

    DataSelect.current!.position.y = dataSelectViewed
      ? MathUtils.lerp(
          DataSelect.current!.position.y,
          0.1 * page_height,
          dataview_time + 0.005
        )
      : MathUtils.lerp(
          DataSelect.current!.position.y,
          0.35 * page_height,
          0.02
        );
    SpellCards.current!.position.y = dataSelectViewed
      ? MathUtils.lerp(
          SpellCards.current!.position.y,
          -0.35 * page_height,
          dataview_time
        )
      : MathUtils.lerp(
          SpellCards.current!.position.y,
          -0.1 * page_height,
          dataview_time + 0.005
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
            <Plane
              args={[0.05, 0.02]}
              material={green}
              position={[0, -page_height / 2 + 0.02 / 2, -0.001]}
              onPointerDown={() =>
                updateSpellRefViewStart(
                  spellRefViewStart < spell_references.length - 4
                    ? spellRefViewStart + 1
                    : spellRefViewStart
                )
              }
            />

            {/* Spell References */}
            {/* TODO: FINISH FORMATTING */}
            <mesh>
              <SpellReference
                refName={spell_references[spellRefViewStart].name}
                refSpoken={spell_references[spellRefViewStart].spoken}
                refText={spell_references[spellRefViewStart].description}
                refIcon={spell_references[spellRefViewStart].icon}
                y_pos={0.125 - 0.05}
              />
              <SpellReference
                refName={spell_references[spellRefViewStart].name}
                refSpoken={spell_references[spellRefViewStart].spoken}
                refText={spell_references[spellRefViewStart + 1].description}
                refIcon={spell_references[spellRefViewStart + 1].icon}
                y_pos={0.025}
              />
              <SpellReference
                refName={spell_references[spellRefViewStart].name}
                refSpoken={spell_references[spellRefViewStart].spoken}
                refText={spell_references[spellRefViewStart + 2].description}
                refIcon={spell_references[spellRefViewStart + 2].icon}
                y_pos={-0.025}
              />
              <SpellReference
                refName={spell_references[spellRefViewStart].name}
                refSpoken={spell_references[spellRefViewStart].spoken}
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
            {/* <Text
              fontSize={0.01}
              color="black"
              anchorX="center"
              anchorY="top"
              // outlineWidth="5%"
              position={[0, 0, -0.001]} 
              rotation={new THREE.Euler(0, -Math.PI, 0)}
            >
              Lorem Ipsum but not really
            </Text> */}
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
          position={new THREE.Vector3(plane_offset, 0.25 * page_height, 0.001)}
        >
          {/* Page */}
          <Plane
            ref={DataSelectPlane}
            args={[0.95 * page_width, 0.45 * page_height]}
            material={blue}
            onPointerDown={() => isDataSelectViewed(true)}
          />
          {data_placeholder.map((d, i) => {
            return (
              <mesh position={new THREE.Vector3(0, 0, 0.001)}>
                <Text
                  fontSize={0.01}
                  color="black"
                  anchorX="left"
                  anchorY="top"
                  // outlineWidth="5%"
                  position={[
                    -0.35 * page_width,
                    dataSelectViewed ? 0.25 * page_height : 0.05 * page_height,
                    0.001
                  ]}
                  //rotation={new THREE.Euler(0, -Math.PI, 0)}
                >
                  {d.name}
                </Text>
                {dataSelectViewed ? (
                  data_unq_vars[i].map((varname, j) => {
                    return (
                      <mesh>
                        <Plane
                          args={[0.85 * page_width, 0.1 * page_height * j]}
                          material={red}
                          position={[
                            0 * page_width,
                            0.1 * page_height * j - 0.33 * page_height,
                            0.001
                          ]}
                        >
                          <Text
                            fontSize={0.01}
                            color="black"
                            anchorX="center"
                            anchorY="middle"
                            // outlineWidth="5%"
                            position={[
                              0,
                              0.03, //* page_height * j - 0.225 * page_height,
                              0.001
                            ]}
                            //rotation={new THREE.Euler(0, -Math.PI, 0)}
                          >
                            {varname}
                          </Text>
                        </Plane>{" "}
                      </mesh>
                    );
                  })
                ) : (
                  <mesh />
                )}
              </mesh>
            );
          })}
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
//        concurrent
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
