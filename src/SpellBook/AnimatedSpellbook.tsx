import * as THREE from "three";
import { MathUtils } from "three";
import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Plane, Line } from "@react-three/drei";
import { Text, useTexture } from "@react-three/drei";
//import { TextureLoader } from "three/src/loaders/TextureLoader";
import * as iris from "../examples/datasets/iris.json";
import { SpellBlock } from "./SpellBlock";
import { SpellPages } from "./SpellPages";

// Icon textures
//import axisIconTexture from "icons/axis.png";

let page_width = 0.175;
let page_height = 0.235;
let plane_offset = page_width / 2;
let cover_offset = 0.005;
let scale_factor = 10;
let page_margin = 0.01;
let dataview_time = 0.2;
const numVarsMaxView = 5;

const spell_references = [
  {
    name: "Workspace Creation",
    spoken: "Workspace",
    description:
      "Initializes a new workspace, allowing a user to switch between collections of views within the same room",
    icon: "assets/icons-png/workspace.png"
  },
  {
    name: "View Creation",
    spoken: "View",
    description: "Creates new views in the current workspace",
    icon: "assets/icons-png/new-view.png"
  },
  {
    name: "Axis Creation",
    spoken: "Axis",
    description: "Creates a new axis in the current view",
    icon: "assets/icons-png/axis.png"
  },
  {
    name: "Color",
    spoken: "Color",
    description: "Colors marks by variable values",
    icon: "assets/icons-png/color.png"
  },
  {
    name: "Object Grouping",
    spoken: "Group",
    description:
      "Initializes a free selection sequence that allows the user to select multiple objects in the scene for shared application of grammar translations",
    icon: "assets/icons-png/group.png"
  },
  {
    name: "Point Mark Type",
    spoken: "Point",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a scatter plot",
    icon: "assets/icons-png/point.png"
  },
  {
    name: "Bar Mark Type",
    spoken: "Bar",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a bar chart",
    icon: "assets/icons-png/bar.png"
  },
  {
    name: "Column Mark Type",
    spoken: "Column",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a column chart",
    icon: "assets/icons-png/columns.png"
  },
  {
    name: "Line Mark Type",
    spoken: "Bar",
    description:
      "Modifies the type of mark used for a selected visualization or group such that the figure is a line chart",
    icon: "assets/icons-png/line.png"
  }
];

const demo_spellbookBlocks = [
  {
    code: `{
  "workspaces": [
    {
      "views": [
        {
          "mark": "point"
        }
      ]
    }
  ]
}`,
    language: "javascript",
    optoClass: "column"
  },
  {
    code: `{
  "workspaces": [
    {
      "views": [
        {
          "mark": "point"
        }
      ]
    }
  ]
}`,
    language: "javascript",
    optoClass: "axis"
  },
  {
    code: `{
  "workspaces": [
    {
      "views": [
        {
          "mark": "point"
        }
      ]
    }
  ]
}`,
    language: "javascript",
    optoClass: "axis"
  },
  {
    code: `{
  "workspaces": [
    {
      "views": [
        {
          "mark": "point"
        }
      ]
    }
  ]
}`,
    language: "javascript",
    optoClass: "view"
  },
  {
    code: `{
  "workspaces": [
    {
      "views": [
        {
          "mark": "point"
        }
      ]
    }
  ]
}`,
    language: "javascript",
    optoClass: "point"
  },
  {
    code: `{
  "workspaces": [
    {
      "views": [
        {
          "mark": "point"
        }
      ]
    }
  ]
}`,
    language: "javascript",
    optoClass: "axis"
  }
];

const SpellReference = (props: any) => {
  const white = new THREE.MeshLambertMaterial({
    color: 0xffffff,
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

  console.log("Icon Texture", iconTexture);

  return (
    <mesh position={[0, props.y_pos, -0.0001]}>
      <Plane args={[page_width - page_margin, spellHeight]} />
      <mesh
        position={[(page_width - page_margin - spellHeight) / 2, 0, -0.0001]}
        rotation={[
          THREE.MathUtils.degToRad(180),
          0,
          THREE.MathUtils.degToRad(180)
        ]}
      >
        <planeBufferGeometry
          attach="geometry"
          args={[spellHeight, spellHeight]}
        />
        <meshStandardMaterial attach="material" map={iconTexture} transparent />
      </mesh>

      <Text
        fontSize={0.007}
        color="black"
        anchorX="left"
        anchorY="middle"
        textAlign="left"
        maxWidth={page_width - page_margin - padding - spellHeight}
        position={[spellHeight - padding, 0, -0.0002]}
        rotation={new THREE.Euler(0, -Math.PI, 0)}
      >
        {props.refText}
      </Text>
    </mesh>
  );
};

const SpellBook = (props: any) => {
  const data_placeholder = [...props.spells];

  // const data_placeholder = [{ values: iris, name: "Iris" }];
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
  const [selectedVarName, selectVarName] = useState("");
  const [bookOpened, isBookOpened] = useState(true);
  const [dataSelectViewed, isDataSelectViewed] = useState(true);
  const [pagesUnfolded, arePagesUnfolded] = useState(false);
  const [spellRefViewStart, updateSpellRefViewStart] = useState(0);
  const [varStart, updateVarStart] = useState(0);
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
          0.135 * page_height,
          dataview_time + 0.005
        )
      : MathUtils.lerp(
          DataSelect.current!.position.y,
          0.35 * page_height,
          dataview_time
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

  const white = new THREE.MeshPhongMaterial({
    color: "white",
    side: THREE.DoubleSide,
    opacity: 0.1,
    transparent: true
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

  const offwhite = new THREE.MeshPhongMaterial({
    color: 0x999999,
    side: THREE.DoubleSide,
    opacity: 0.1,
    transparent: true
  });

  const blue = new THREE.MeshPhongMaterial({
    color: "blue",
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true
  });

  const arrowTexture = useTexture("assets/arrow.png");

  const leftPageTexture = useTexture("assets/left-page.jpg");
  const rightPageTexture = useTexture("assets/right-page.jpg");

  const leftPageMaterial = new THREE.MeshStandardMaterial({
    map: leftPageTexture
  });
  const rightPageMaterial = new THREE.MeshStandardMaterial({
    map: rightPageTexture
  });

  /* Preload test */
  const preloadGroupTexture = useTexture("assets/icons-png/group.png");

  const PreloadedTexture = (props: any) => {
    let iconAsset: "string" =
      props.refIcon !== null &&
      props.refIcon !== undefined &&
      typeof props.refIcon === "string"
        ? props.refIcon
        : "assets/200.jpg";

    const t = useTexture(iconAsset);

    return (
      <mesh position={[0, 0, 0.0001]}>
        <planeBufferGeometry attach="geometry" args={[0.0001, 0.0001]} />
        <meshStandardMaterial attach="material" map={t} transparent />
      </mesh>
    );
  };

  /* Preload textures */
  const preloadedTextures = spell_references.map((el, i) => (
    <PreloadedTexture key={`preload${i}`} refIcon={el.icon} />
  ));

  /* Lines prep */
  const lines = demo_spellbookBlocks.map((node, i) => {
    let curvepoints = [];
    if (i > 0) {
      const start = new THREE.Vector3(
        (0.85 * page_width * 7 * i) / demo_spellbookBlocks.length,
        -0.01 * page_height,
        0.001
      );
      const end = new THREE.Vector3(
        (0.85 * page_width * 7 * (i - 1)) / demo_spellbookBlocks.length,
        -0.01 * page_height,
        0.001
      );

      let mid = new THREE.Vector3(0, 0, 0);
      mid = start.clone().add(end.clone().sub(start)).add(new THREE.Vector3((start.x - end.x), start.y + 0.5, (start.z - end.z))) // prettier-ignore
      curvepoints = new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(
        10
      );
    } else {
      curvepoints = [new THREE.Vector3(0, 0, 0)];
    }

    // const curvepoints_arr = curvepoints.map((v) => {
    //   return [v.x, v.y, v.z];
    // });

    // return curvepoints_arr;
    return curvepoints;
  });

  lines.shift();
  console.log(lines);
  return (
    <mesh
      position={[0, 0, 2]}
      scale={[scale_factor, scale_factor, scale_factor]}
    >
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
            {/* Preloaded textures */}
            {preloadedTextures}
          </mesh>
        </mesh>

        <mesh ref={frontcube}>
          <mesh position={new THREE.Vector3(plane_offset, 0, 0)}>
            {/* Page */}
            <Plane
              args={[page_width, page_height]}
              material={leftPageMaterial}
              rotation={[
                THREE.MathUtils.degToRad(180),
                0,
                THREE.MathUtils.degToRad(180)
              ]}
            />

            {/* Scroll up */}
            <mesh
              position={[0, page_height / 2 - 0.02 / 2, -0.0001]}
              rotation={[
                THREE.MathUtils.degToRad(180),
                0,
                THREE.MathUtils.degToRad(180)
              ]}
              onPointerDown={() =>
                updateSpellRefViewStart(
                  spellRefViewStart > 0 ? spellRefViewStart - 1 : 0
                )
              }
            >
              <planeBufferGeometry attach="geometry" args={[0.05, 0.02]} />
              <meshStandardMaterial
                attach="material"
                map={arrowTexture}
                transparent
              />
            </mesh>

            {/* Scroll down */}
            <mesh
              position={[0, -page_height / 2 + 0.02 / 2, -0.0001]}
              rotation={[THREE.MathUtils.degToRad(180), 0, 0]}
              onPointerDown={() =>
                updateSpellRefViewStart(
                  spellRefViewStart < spell_references.length - 4
                    ? spellRefViewStart + 1
                    : spellRefViewStart
                )
              }
            >
              <planeBufferGeometry attach="geometry" args={[0.05, 0.02]} />
              <meshStandardMaterial
                attach="material"
                map={arrowTexture}
                transparent
              />
            </mesh>

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
            <Plane
              args={[page_width, page_height]}
              material={rightPageMaterial}
              // rotation={[
              //   THREE.MathUtils.degToRad(180),
              //   0,
              //   THREE.MathUtils.degToRad(180)
              // ]}
            />
          </mesh>
        </mesh>

        <mesh
          ref={DataSelect}
          position={
            DataSelect.current
              ? DataSelect.current.position
              : new THREE.Vector3(plane_offset, 0.25 * page_height, 0.001)
          }
        >
          {/* Page */}
          <Plane
            ref={DataSelectPlane}
            args={[0.95 * page_width, 0.45 * page_height]}
            material={offwhite}
            onPointerDown={() => isDataSelectViewed(true)}
          />
          {data_placeholder.map((d, i) => {
            return (
              <mesh position={new THREE.Vector3(0, 0, 0.001)}>
                <mesh
                  position={[
                    0,
                    dataSelectViewed ? 0.25 * page_height + 0.01 : 0,
                    0.0001
                  ]}
                  rotation={[
                    0,
                    dataSelectViewed ? 0 : THREE.MathUtils.degToRad(180),
                    0
                  ]}
                  onPointerDown={() =>
                    updateVarStart(
                      varStart < data_unq_vars[i].length - numVarsMaxView
                        ? varStart + 1
                        : varStart
                    )
                  }
                >
                  <planeBufferGeometry attach="geometry" args={[0.05, 0.02]} />
                  <meshStandardMaterial
                    attach="material"
                    map={arrowTexture}
                    transparent
                  />
                </mesh>
                <mesh
                  position={[
                    0,
                    dataSelectViewed ? -0.2 * page_height - 0.025 : 0,
                    0.0001
                  ]}
                  rotation={[
                    0,
                    dataSelectViewed ? 0 : THREE.MathUtils.degToRad(180),
                    THREE.MathUtils.degToRad(180)
                  ]}
                  onPointerDown={() =>
                    updateVarStart(varStart > 0 ? varStart - 1 : 0)
                  }
                >
                  <planeBufferGeometry attach="geometry" args={[0.05, 0.02]} />
                  <meshStandardMaterial
                    attach="material"
                    map={arrowTexture}
                    transparent
                  />
                </mesh>
                <Text
                  fontSize={0.01}
                  color="black"
                  anchorX="center"
                  anchorY="top"
                  // outlineWidth="5%"
                  position={[
                    0,
                    dataSelectViewed ? 0.25 * page_height : 0.05 * page_height,
                    0.003
                  ]}
                  //rotation={new THREE.Euler(0, -Math.PI, 0)}
                >
                  {d.name}
                </Text>
                {dataSelectViewed ? (
                  data_unq_vars[i].map((varname, j_interm) => {
                    let j = j_interm - varStart;
                    let var_view_len = Math.min(
                      data_unq_vars[i].length,
                      numVarsMaxView
                    );
                    return j < var_view_len && j >= 0 ? (
                      <mesh onPointerDown={() => selectVarName(varname)}>
                        <Plane
                          args={[
                            0.85 * page_width,
                            (0.45 * page_height) / var_view_len
                          ]}
                          material={varname === selectedVarName ? blue : white}
                          position={[
                            0 * page_width,
                            (0.45 * page_height * j) / var_view_len -
                              0.23 * page_height,
                            0.001
                          ]}
                        >
                          <Text
                            fontSize={Math.min(0.009, 0.045 / var_view_len)}
                            color="black"
                            anchorX="left"
                            anchorY="middle"
                            // outlineWidth="5%"
                            position={[
                              -0.4 * page_width,
                              0, //* page_height * j - 0.225 * page_height,
                              0.001
                            ]}
                            //rotation={new THREE.Euler(0, -Math.PI, 0)}
                          >
                            {(data_unq_vars[i].length - j_interm).toString() +
                              ". " +
                              varname}
                          </Text>
                        </Plane>{" "}
                      </mesh>
                    ) : (
                      <mesh />
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
            SpellCards.current
              ? SpellCards.current.position
              : new THREE.Vector3(
                  plane_offset,
                  -0.25 * page_height,
                  cover_offset
                )
          }
        >
          {/* Page */}
          <Plane
            ref={SpellCardsPlane}
            args={[0.95 * page_width, 0.45 * page_height]}
            material={offwhite}
            onPointerDown={() => isDataSelectViewed(false)}
          >
            {dataSelectViewed ? (
              <mesh>
                {demo_spellbookBlocks.map((props, i) => {
                  return (
                    <mesh
                      position={[
                        (0.85 * page_width * i) / demo_spellbookBlocks.length -
                          0.35 * page_width,
                        -0.01 * page_height,
                        0.001
                      ]}
                    >
                      <Plane
                        args={[
                          (0.75 * page_width) / demo_spellbookBlocks.length,
                          0.3 * page_height
                        ]}
                        material={white}
                        position={[0, 0, 0.001]}
                      >
                        <Text
                          fontSize={Math.min(
                            0.009,
                            0.045 / demo_spellbookBlocks.length
                          )}
                          color="black"
                          anchorX="center"
                          anchorY="middle"
                          // outlineWidth="5%"
                          position={[
                            0,
                            0, //* page_height * j - 0.225 * page_height,
                            0.001
                          ]}
                          //rotation={new THREE.Euler(0, -Math.PI, 0)}
                        >
                          {props.optoClass}
                        </Text>
                      </Plane>{" "}
                    </mesh>
                  );
                })}
              </mesh>
            ) : (
              demo_spellbookBlocks.map((props, i) => {
                return (
                  <mesh onPointerDown={() => arePagesUnfolded(!pagesUnfolded)}>
                    <group>
                      {lines.map((points, index) => (
                        <Line
                          key={index.toString() + "_lineidx"}
                          points={points}
                          color="white"
                          dashed
                          dashScale={30} 
                          alphaWrite={undefined}                        />
                      ))}
                    </group>

                    <mesh
                      position={
                        pagesUnfolded
                          ? [0.175 * i, 0, 0.006]
                          : [0.005 * i, -0.01 * i, 0.005 * i + 0.001]
                      }
                    >
                      <SpellBlock
                        code={props.code}
                        language={props.language}
                        optoClass={props.optoClass}
                      />
                    </mesh>
                  </mesh>
                );
              })
            )}
          </Plane>
        </mesh>
      </mesh>
    </mesh>
  );
};
/*
const Scene = () => {
  return (
    <>
      <gridHelper />
      <axesHelper />
      <pointLight intensity={1.0} position={[5, 3, 5]} />
      <SpellBook />
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
*/
export {SpellBook};
