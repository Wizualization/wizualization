/**TODO: 
 * Instead of the box interactions, we want to trigger this when the user
 * is trying to craft an event and log their gestures as a command.
 * Also, remove the box now that we've confirmed it works with our config.
 * See https://immersive-web.github.io/webxr-hand-input/#skeleton-joints for joint refs
 */

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { RoundedBox, Sphere, Text, CurveModifier } from '@react-three/drei';
import { extend, reconciler, useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, CatmullRomCurve3, Line, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, SplineCurve, Vector3 } from 'three';
import { useSpring, config } from 'react-spring';
import {socket} from '../../utils/Socket';
import ComputeDTW from './GestureRecognition';
import Swarm from '../../SpellCasting/Swarm'

const start = new Vector3(-0.25, 1.0, -0.3)
const end = new Vector3(0.25, 1.0, -0.3)
const startEnd = new Vector3().copy(end).sub(start)


function getTargetPos(handle: Vector3) {
  return new Vector3().copy(handle).sub(start).projectOnVector(startEnd).add(start)
}
//relative importance of each finger
const finger_weights = {
  'thumb': 2, 
  'index': 2, 
  'middle': 1, 
  'ring': 0.5, 
  'pinky': 1
}

//for now we will just store these for a given session but we NEED TO CONNECT TO SERVER DB
let last_craft:any[] = [];

const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)

const offset = new Vector3()

let crafting = false;
let crafting_startTime = Date.now();
let prev_craftPinching = false

let casting = false;
let casting_startTime = Date.now();
let prev_castPinching = false

let last_cast:any[] = []

let velocity = new Vector3(0, 0, 0)
let targetPos = getTargetPos(new Vector3(0, 0, 0))

let frame = 0
let prev_frame = 0

function Pinchable(props: any) {
  let crafted_spells:any[] = [...props.grimoire];

  const jointNames = [
    "wrist",
  
    "thumb-metacarpal",
    "thumb-phalanx-proximal",
    "thumb-phalanx-distal",
    "thumb-tip",
  
    "index-finger-metacarpal",
    "index-finger-phalanx-proximal",
    "index-finger-phalanx-intermediate",
    "index-finger-phalanx-distal",
    "index-finger-tip",
  
    "middle-finger-metacarpal",
    "middle-finger-phalanx-proximal",
    "middle-finger-phalanx-intermediate",
    "middle-finger-phalanx-distal",
    "middle-finger-tip",
  
    "ring-finger-metacarpal",
    "ring-finger-phalanx-proximal",
    "ring-finger-phalanx-intermediate",
    "ring-finger-phalanx-distal",
    "ring-finger-tip",
  
    "pinky-finger-metacarpal",
    "pinky-finger-phalanx-proximal",
    "pinky-finger-phalanx-intermediate",
    "pinky-finger-phalanx-distal",
    "pinky-finger-tip"
  ];

  const justTheTips = [
    "thumb-tip",
    "index-finger-tip",
    "middle-finger-tip",
    "ring-finger-tip",
    "pinky-finger-tip"
  ]


  const fingstart = new THREE.Vector3(0, 0, 0)
  const [curveThum, setCurveThum] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveIndx, setCurveIndx] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveMidl, setCurveMidl] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveRing, setCurveRing] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curvePink, setCurvePink] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [magicDustCount, setMagicDustCount] = useState(0);
  
  const curveRefThum = useRef()
  const curveRefIndx = useRef()
  const curveRefMidl = useRef()
  const curveRefRing = useRef()
  const curveRefPink = useRef()
  
  const dustRef = useRef<Mesh | null>(null);


  const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)
  
  const { gl } = useThree()
  const hand0 = gl.xr.getHand(0) as any
  const hand1 = gl.xr.getHand(1) as any
  const ref = useRef<Mesh | null>(null)
  const v = new Vector3()
  const [label, setLabel] = useState(0)

  useEffect(() => {
    if (!ref.current ) return
    if (!dustRef.current ) return
    if(dustRef.current){
      dustRef.current.visible = false;
    }

  }, [])

  useFrame(() => {
    if (!ref.current) return
    if (!dustRef.current ) return

    const handle = ref.current as any
    //actually need to do it this way
    const thumb0 = hand0.joints['thumb-tip']
    const index0 = hand0.joints['index-finger-tip']
    const middle0 = hand0.joints['middle-finger-tip']
    const ring0 = hand0.joints['ring-finger-tip']
    const pinky0 = hand0.joints['pinky-finger-tip']

    const thumb1 = hand1.joints['thumb-tip']
    const index1 = hand1.joints['index-finger-tip']
    const middle1 = hand1.joints['middle-finger-tip']
    const ring1 = hand1.joints['ring-finger-tip']
    const pinky1 = hand1.joints['pinky-finger-tip']



    let craftPinching = false
    let castPinching = false

    //for now we substitute this empty vector... why bc why not
    let dummyVec = new THREE.Vector3(1,1,1);
    if(prev_frame < frame - 5 && crafting){
      //start crafting if it has been more than 1 seconds
      if(Date.now() > (crafting_startTime + 1000)){
        //setMagicDustCount(5000);
        if(dustRef.current){
          dustRef.current.visible = true;
        }
    
        last_craft.push({
          thumb0: thumb0 ? {...thumb0.position} : dummyVec, 
          index0: index0 ? {...index0.position} : dummyVec, 
          middle0: middle0 ? {...middle0.position} : dummyVec, 
          ring0: ring0 ? {...ring0.position} : dummyVec, 
          pinky0: pinky0 ? {...pinky0.position} : dummyVec,
          thumb1: thumb1 ? {...thumb1.position} : dummyVec, 
          index1: index1 ? {...index1.position} : dummyVec, 
          middle1: middle1 ? {...middle1.position} : dummyVec, 
          ring1: ring1 ? {...ring1.position} : dummyVec, 
          pinky1: pinky1 ? {...pinky1.position} : dummyVec
        })

        prev_frame = frame;

        //stop crafting if it has been more than 5 seconds
        if(Date.now() > (crafting_startTime + 5000)){
          //crafted_spells 
          /* we only need the emit because our props will update, not the push*/
          //crafted_spells.push(last_craft);
          if(dustRef.current){
            dustRef.current.visible = false;
          }
          socket.emit('spellcast', JSON.stringify({'gesture':last_craft, 'words':''}))
          crafting = false;
        }
      }
    }

    if(prev_frame < frame - 5 && casting){
      //start casting if it has been more than 1 second
      if(Date.now() > (casting_startTime + 1000)){
        if(dustRef.current){
          dustRef.current.visible = true;
        }
    
        last_cast.push({
          thumb0: thumb0 ? {...thumb0.position} : dummyVec, 
          index0: index0 ? {...index0.position} : dummyVec, 
          middle0: middle0 ? {...middle0.position} : dummyVec, 
          ring0: ring0 ? {...ring0.position} : dummyVec, 
          pinky0: pinky0 ? {...pinky0.position} : dummyVec,
          thumb1: thumb1 ? {...thumb1.position} : dummyVec, 
          index1: index1 ? {...index1.position} : dummyVec, 
          middle1: middle1 ? {...middle1.position} : dummyVec, 
          ring1: ring1 ? {...ring1.position} : dummyVec, 
          pinky1: pinky1 ? {...pinky1.position} : dummyVec
        })

        prev_frame = frame;

        //stop casting if it has been more than 5 seconds
        if(Date.now() > (casting_startTime + 5000)){
          if(dustRef.current){
            dustRef.current.visible = false;
          }
      
          if(crafted_spells.length > 0){
            let spell_dtws:any = []
            let min_dist = 10000;
            let best_match_idx = -1;
            for (var i = 0; i < crafted_spells.length; i++) {
              const dtw = ComputeDTW(last_cast, crafted_spells[i]);
              spell_dtws.push(dtw)
              let dthumb = finger_weights['thumb'] * (dtw['dist']['thumb0'] + dtw['dist']['thumb1'])
              let dindex = finger_weights['index'] * (dtw['dist']['index0'] + dtw['dist']['index1'])
              let dmiddle = finger_weights['middle'] * (dtw['dist']['middle0'] + dtw['dist']['middle1'])
              let dring = finger_weights['ring'] * (dtw['dist']['ring0'] + dtw['dist']['ring1'])
              let dpinky = finger_weights['pinky'] * (dtw['dist']['pinky0'] + dtw['dist']['pinky1'])
              let weighted_dist = dthumb + dindex + dmiddle + dring + dpinky;
              if(min_dist > weighted_dist){
                best_match_idx = 1*i;
                min_dist = weighted_dist;
              }
            }
            socket.emit('spellmatched', JSON.stringify(crafted_spells[best_match_idx]));
         }

          casting = false;
        }
      }
    }

    frame++

    //Update: I switched from left & right pinch for craft vs cast, to using both hands to pinch for craft vs putting hands together to cast
    if (index0 && thumb0 && index1 && thumb1) {
      const craftPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1)
      craftPinching = craftPinch_left > 0.52
      const craftPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1)
      craftPinching = craftPinching && (craftPinch_right > 0.52)
      //we set crafting to true, but we do not require pinch to continue crafting
      if(craftPinching && !crafting && !casting){
        console.log('crafting spell...')
        crafting = true;
        last_craft = [];
        crafting_startTime = Date.now();
      }

    // Released
    if (prev_craftPinching && !craftPinching) {
      velocity.set(0, 0, 0)
      targetPos.copy(getTargetPos(handle.position))
    }

    // return to the position
    if (!craftPinching) {
      const direction = new Vector3().copy(targetPos).sub(handle.position)
      velocity.add(direction.multiplyScalar(0.05))
      velocity.multiplyScalar(0.92)
      handle.position.add(velocity)
    }

  //spell casting commands
    const castThumbtips = Math.max(0, 1 - thumb0.position.distanceTo(thumb1.position) / 0.1)
    castPinching = castThumbtips > 0.52
    const castIndextips = Math.max(0, 1 - index0.position.distanceTo(index1.position) / 0.1)
    castPinching = castPinching && (castIndextips > 0.52)
    //we set casting to true, but we do not require pinch to continue casting
    if(castPinching && !casting && !crafting){
      console.log('casting spell...')
      last_cast = [];
      casting = true;
      casting_startTime = Date.now();
    }
  }



    // Update line
    curve.points[1].copy(handle.position)

    // get current position
    let value = Math.floor((getTargetPos(handle.position).sub(start).length() / startEnd.length()) * 100)
    if (frame % 5 === 0) {
      setLabel(value)
    }

    prev_craftPinching = craftPinching
  })

  return (
    <>
    <mesh ref={ref}>
      <mesh ref={dustRef}>
        <Swarm count={5000} />
      </mesh>
    </mesh>
    </>
  )
}

export default Pinchable;