import { useState, useEffect, Fragment, useRef, useMemo, createRef, useLayoutEffect, Suspense } from 'react'
import { Mesh } from 'three';
import { useThree, useFrame, ThreeEvent } from '@react-three/fiber'
import { CurveModifier } from '@react-three/drei'
import { SpellBlock } from './SpellBlock'
import * as THREE from 'three';
import { Nodes, Node } from './Nodes'

export const joints = [
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
  
//this one is not used; the Node class is where the grabbing happens.
function Page({ position = [0.06, 0.06, 0.06], code, language }) { //: any
  const blockRef = useRef();
  const { gl } = useThree()
  const hand0 = (gl.xr).getHand(0);
  const hand1 = (gl.xr).getHand(1);

  useFrame(() => {
    if (!blockRef.current) return
    const index0 = hand0.joints['index-finger-tip']
    const index1 = hand1.joints['index-finger-tip']
    const thumb0 = hand0.joints['thumb-tip']
    const thumb1 = hand1.joints['thumb-tip']
    if(index0 && index1){
      const left_isNear = Math.max(0, 1 - index0.position.distanceTo(blockRef.current?.position) / 0.1) > 0.8
      const right_isNear = Math.max(0, 1 - index1.position.distanceTo(blockRef.current?.position) / 0.1) > 0.8
      if(left_isNear){
        const grabPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1) > 0.6
        if(grabPinch_left){
          blockRef.current.position.x = index0.position.x;
          blockRef.current.position.y = index0.position.y;
          blockRef.current.position.z = index0.position.z;
          blockRef.current.rotation.x = index0.rotation.x;
          blockRef.current.rotation.y = index0.rotation.y;
          blockRef.current.rotation.z = index0.rotation.z;
        }
      } else {
        //lefty dominance if trying to grab with both hands, which the user should never do bc it will craft a spell lol
        if(right_isNear){
          const grabPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1) > 0.6
          if(grabPinch_right){
            blockRef.current.position.x = index1.position.x;
            blockRef.current.position.y = index1.position.y;
            blockRef.current.position.z = index1.position.z;
            blockRef.current.rotation.x = index1.rotation.x;
            blockRef.current.rotation.y = index1.rotation.y;
            blockRef.current.rotation.z = index1.rotation.z;
              }
            
        }
    
      }
    }
  });
  //wrap in a mesh that will get the ref in the parent function
  return (
      <mesh ref={blockRef} position={position} >
        <SpellBlock code={code} language={language} />
      </mesh>
  )
}

function SpellPages(props ) { //: any
  //This may have offered better performance, but it doesn't actually work. 
  //const [[...pageRefs]] = useState(() => [...Array(props.spells)].map(createRef))
  //this works.
  let pageRefs = [...props.spells].map(createRef);
  useEffect(() => {
    if(pageRefs.length < props.spells.length){
      //This may have offered better performance, but it doesn't actually work. 
      /*
      for(let i = pageRefs.length-1; i < props.spells.length; i++){
        pageRefs.push(createRef);
      }
      */
      //this works.
      pageRefs = [...props.spells].map(createRef);
    }
 }, [props.spells]);
 /*
  return (
    <Suspense fallback={<></>}> 
    <Nodes dashed color="#ff1050" lineWidth={1}>
      {[...Array(props.spells.length)].map((_, i) => (
        <Node key={"node_"+i.toString()}  
          ref={pageRefs[i]} 
          name={"node_"+i.toString()} 
          position={[Math.PI*0.1*i, 1.5, Math.PI*0.1*i]}  
          code={props.spells[i]['code']} 
          language={props.spells[i]['language']} 
        /> 
      ))}
      </Nodes>
    </Suspense>
  )
  */
 //don't need the rotation to change
  //          rotation={[Math.PI*0.1*i, 0, 0]}  
  return (
    <Suspense fallback={<></>}> 
    <Nodes dashed color="#ff1050" lineWidth={1}>
      {[...Array(props.spells.length)].map((_, i) => (i > 0 ? 
        <Node key={"node_"+i.toString()}  
          ref={pageRefs[i]} 
          name={"node_"+i.toString()} 
          position={[Math.PI*0.1*i, 1.5, Math.PI*0.1*i]}  
          code={props.spells[i]['code']} 
          language={props.spells[i]['language']} 
          connectedTo={[pageRefs[(i-1)]]}
        /> : 
        <Node key={"node_"+i.toString()}  
          ref={pageRefs[i]} 
          name={"node_"+i.toString()} 
          position={[Math.PI*0.1*i, 1.5, Math.PI*0.1*i]}  
          code={props.spells[i]['code']} 
          language={props.spells[i]['language']} 
        /> 
      ))}
      </Nodes>
    </Suspense>
  )
}

export { SpellPages };