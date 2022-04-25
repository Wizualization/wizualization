// ******************** Optomancy ********************
import * as THREE from "three";
import { Mesh } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import {useRef, useEffect} from 'react';
import { Workspace } from './OptomanticElements/Workspace';
import { PlotArea } from "./OptomanticElements/PlotArea";
import { Axis } from './OptomanticElements/Axis';
import { MarkIcon } from './OptomanticElements/MarkIcon';
import Optomancy from "optomancy";

/**Demo dataset */
import iris from "../assets/iris.json";
//for later versions we will just get this from the dataset being used but for now we're out of time.
const allVarNames = [
  "sepalLength",
  "sepalWidth",
  "petalLength",
  "petalWidth",
  "species"
]

declare global {
  interface Window {
    OptomancyNS: any;
  }
}

window.OptomancyNS = window.OptomancyNS || {};
const transitionConfig = {
  title: "The Iris Flower Dataset",
  data: { values: iris },
};
const optomancyConfig = {
  data: iris,
};
export const joints = [
  /*    'wrist',
      'thumb-metacarpal',
      'thumb-phalanx-proximal',
      'thumb-phalanx-distal',*/
      'thumb-tip',
  /*    'index-finger-metacarpal',
      'index-finger-phalanx-proximal',
      'index-finger-phalanx-intermediate',
      'index-finger-phalanx-distal',*/
      'index-finger-tip'//,
  /*    'middle-finger-metacarpal',
      'middle-finger-phalanx-proximal',
      'middle-finger-phalanx-intermediate',
      'middle-finger-phalanx-distal',
      'middle-finger-tip',
      'ring-finger-metacarpal',
      'ring-finger-phalanx-proximal',
      'ring-finger-phalanx-intermediate',
      'ring-finger-phalanx-distal',
      'ring-finger-tip',
      'pinky-finger-metacarpal',
      'pinky-finger-phalanx-proximal',
      'pinky-finger-phalanx-intermediate',
      'pinky-finger-phalanx-distal',
      'pinky-finger-tip'*/
    ]

// ***************************************************

  // ******************** Optomancy ********************

  // ******************** Optomancy ********************
  window.OptomancyNS.optomancy = new Optomancy(optomancyConfig);
  window.OptomancyNS.optomancy.cast("x", {
    field: "petalWidth",
    type: "continuous",
  });
  window.OptomancyNS.optomancy.cast("y", {
    field: "petalLength",
    type: "continuous",
  });
  window.OptomancyNS.optomancy.cast("z", {
    field: "sepalWidth",
    type: "continuous",
  });
  window.OptomancyNS.optomancy.cast("color", {
    field: "species",
    type: "categorical",
  });
  // ***************************************************

  const { data } = window.OptomancyNS.optomancy.config;
  const { scales } = window.OptomancyNS.optomancy.propsExport;
  // ***************************************************

function Interpreter(props:any) {//:any
  const optoRef = useRef<Mesh | null>();
  //const optoRef = useRef();
  const { gl } = useThree();

  useEffect(()=>{    
    console.log('Interpreted: ', props.castSpells)
  });

  const hand0 = (gl.xr as any).getHand(0) as any;
  const hand1 = (gl.xr as any).getHand(1) as any;
  //const hand0 = (gl.xr).getHand(0);
  //const hand1 = (gl.xr).getHand(1);
  useFrame(() => {
    if (!optoRef.current) return
    const index0 = hand0.joints['index-finger-tip']
    const index1 = hand1.joints['index-finger-tip']
    const thumb0 = hand0.joints['thumb-tip']
    const thumb1 = hand1.joints['thumb-tip']
    if(index0 && index1){
      const left_isNear = Math.max(0, 1 - index0.position.distanceTo(optoRef.current?.position) / 2) > 0.8
      const right_isNear = Math.max(0, 1 - index1.position.distanceTo(optoRef.current?.position) / 2) > 0.8
      if(left_isNear){
        const grabPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1) > 0.6
        if(grabPinch_left){
          //blockRef.current?.position.set(index0.position.x, index0.position.y, index0.position.z);
          optoRef.current.position.x = index0.position.x;
          optoRef.current.position.y = index0.position.y;
          optoRef.current.position.z = index0.position.z;
          optoRef.current.rotation.x = index0.rotation.x;
          optoRef.current.rotation.y = index0.rotation.y;
          optoRef.current.rotation.z = index0.rotation.z;
        }
      } else {
        //lefty dominance if trying to grab with both hands, which the user should never do bc it will craft a spell lol
        if(right_isNear){
          const grabPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1) > 0.6
          if(grabPinch_right){
            //blockRef.current?.position.set(index1.position.x, index1.position.y, index1.position.z);
            optoRef.current.position.x = index1.position.x;
            optoRef.current.position.y = index1.position.y;
            optoRef.current.position.z = index1.position.z;
            optoRef.current.rotation.x = index1.rotation.x;
            optoRef.current.rotation.y = index1.rotation.y;
            optoRef.current.rotation.z = index1.rotation.z;
              }
            
        }
    
      }
    }
  });

  // inputCastList = [{ ... optoClass: "point"}, { ... optoClass: "axis"}, "axis", "axis", "color"]
  const setAxisCount = (inputCastListLength: any) => {
    console.log('INPUT_CAST_AXIS_LIST_LENGTH', inputCastListLength);
    // if(inputCastList?.length === 1 && inputCastList?.[0]?.optoClass === "point") {
    //   return 0;
    // }
    // if (inputCastList?.length === 2 && inputCastList?.[1]?.optoClass === "axis") {
    //   return 1;
    // }
    let state = inputCastListLength;
    /*
    let state = 0;
    switch(inputCastListLength) {
      // X Axis
      case 1:
        state = 1;
        break;
      // Y Axis
      case 2:
        state = 2;
        break;
      // Z Axis
      case 3:
        state = 3;
        break;
      // ?? Axis
      case 4:
        state = 4;
        break;
      // Color
      case 5:
        state = 5;
        break;
      default:
        state = 0;
        break;
    }*/
    return state;
  }

  const setMarkType = (inputCastListLength: any) => {
    console.log('INPUT_CAST_MARKTYPE_LIST_LENGTH', inputCastListLength)
    let marksCast = props.castSpells.filter((o:any)=>{return ['point', 'bar', 'column', 'line'].includes(o.optoClass)});
    let state = marksCast[inputCastListLength-1];
    return state;
  }
  //probably want to change this to random
  const setMarkColorVar = (inputCastListLength: any) => {
    console.log('INPUT_CAST_COLOR_LIST_LENGTH', inputCastListLength)
    let state = null;
    if (inputCastListLength > 0) {
      state = 'species'
    }
    return state;
  }


  const axisCount = setAxisCount(props.castSpells.filter((o:any)=>{return o.optoClass === 'axis'}).length);
  const markColorVar = setMarkColorVar(props.castSpells.filter((o:any)=>{return o.optoClass === 'color'}).length);
  const markType = setMarkType(props.castSpells.filter((o:any)=>{return ['point', 'bar', 'column', 'line'].includes(o.optoClass)}).length);
  
  // const demoState = setDemoState(5);

  return <mesh ref={optoRef} position={[-1, 1, -1]}>
              <Workspace />
              <mesh position={[-0.25, 0, -0.25]}>
                {axisCount > 0 ? <PlotArea 
                  data={data} 
                  scales={scales} 
                  xVariableName={'petalWidth'} 
                  yVariableName={axisCount > 1 ? 'petalLength' : null} 
                  zVariableName={axisCount > 2 ? 'sepalWidth' : null}
                  markType={markType}
                  color={markColorVar} /> : null }
                {/* Z */}
                {axisCount > 2 ? <Axis
                  position={[0, 0, 0.25]}
                  rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
                /> : null
                }
                {/* Y */}
                {axisCount > 1 ? <Axis
                  position={[0, 0.25, 0]}
                  rotation={[0, THREE.MathUtils.degToRad(90), 0]}
                /> : null}
                {/* X */}
                {axisCount > 0 ? 
                <Axis
                  position={[0.25, 0, 0]}
                  rotation={[0, 0, THREE.MathUtils.degToRad(90)]}
                /> : null
                }
              </mesh>
              {((axisCount < 1) && (markType != null)) ? <MarkIcon markType={markType} /> : null}
            </mesh>
}
  
  export {Interpreter};
  