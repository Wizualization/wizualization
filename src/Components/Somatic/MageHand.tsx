/**TODO: 
 * Instead of the box interactions, we want to trigger this when the user
 * is trying to craft an event and log their gestures as a command.
 * Also, remove the box now that we've confirmed it works with our config.
 * See https://immersive-web.github.io/webxr-hand-input/#skeleton-joints for joint refs
 */

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
//import { RoundedBox, Sphere, Text, CurveModifier } from '@react-three/drei';
import { extend, reconciler, useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { Mesh, Vector3 } from 'three';
//import { useSpring, config } from 'react-spring';
import {socket} from '../../utils/Socket';
import ComputeDTW from './GestureRecognition';
import Swarm from '../../SpellCasting/Swarm';

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

//for now we will just store these for a given server session 
let last_craft:any[] = [];
let abstract_casts:any[] = [];
let abstraction_casting = false;
let uncraft_bufferStart = Date.now()
/*
const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)

const offset = new Vector3()
*/
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

function MageHand(props: any) {
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

  const [dustColor, setDustColor] = useState('lightblue');
  
  /*
  const fingstart = new THREE.Vector3(0, 0, 0)
  const [curveThum, setCurveThum] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveIndx, setCurveIndx] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveMidl, setCurveMidl] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curveRing, setCurveRing] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  const [curvePink, setCurvePink] = useState(new CatmullRomCurve3([fingstart, fingstart], false, 'catmullrom', 0.25));
  
  const curveRefThum = useRef()
  const curveRefIndx = useRef()
  const curveRefMidl = useRef()
  const curveRefRing = useRef()
  const curveRefPink = useRef()
  const [magicDustCount, setMagicDustCount] = useState(0);
  const v = new Vector3()
  const curve = new CatmullRomCurve3([start, new Vector3().lerpVectors(start, end, 0.5), end], false, 'catmullrom', 0.25)
  const [label, setLabel] = useState(0)
  */
  const dustRef = useRef<Mesh | null>(null);
  const ref = useRef<Mesh | null>(null)

  
  const { gl } = useThree();
  const { player } = useXR();

  const hand0 = gl.xr.getHand(0) as any
  const hand1 = gl.xr.getHand(1) as any

  const WorkspaceContext = React.useContext(props.context);

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

      //if(head && hand0 && hand1){

        //console.log(head)
        //console.log(hand0)
        //console.log(hand1)
      
        //actually need to do it this way
        const index0 = hand0.joints['index-finger-tip'] as any;
        if(index0 === undefined) return
        const index1 = hand1.joints['index-finger-tip'] as any;
        if(index1 === undefined) return
      if(index0 && index1){
        //console.log(hand0)
        //crafting a new spell
        //console.log(player.children[0].position.y-hand0.position.y)
        //console.log(player.children[0].position)
        //console.log(hand0.position)
        //console.log(hand1.position)
        if(player.children[0].position.y - 0.225 < hand0.children[0].position.y && player.children[0].position.y - 0.225 < hand1.children[0].position.y && player.children[0].position.y + 0.225 > hand0.children[0].position.y && player.children[0].position.y + 0.225 > hand1.children[0].position.y ){
          
          const thumb0 = hand0.joints['thumb-tip'] as any;
          if(thumb0 === undefined) return
          const middle0 = hand0.joints['middle-finger-tip'] as any;
          //if(middle0 === undefined) return
          const ring0 = hand0.joints['ring-finger-tip'] as any;
          //if(ring0 === undefined) return
          const pinky0 = hand0.joints['pinky-finger-tip'] as any;
          //if(pinky0 === undefined) return
  
          const thumb1 = hand1.joints['thumb-tip'] as any;
          //if(thumb1 === undefined) return
          const middle1 = hand1.joints['middle-finger-tip'] as any;
          //if(middle1 === undefined) return
          const ring1 = hand1.joints['ring-finger-tip'] as any;
          //if(ring1 === undefined) return
          const pinky1 = hand1.joints['pinky-finger-tip'] as any;
          //if(pinky1 === undefined) return


          const handle = ref.current as any
          
          let craftPinching = false
          let castPinching = false

          //for now we substitute this empty vector... why bc why not
          let dummyVec = new THREE.Vector3(1,1,1);
          if(prev_frame < frame - 5 && casting && abstraction_casting){
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
                casting = false;
            
                if(crafted_spells.length > 0){
                  let spell_dtws:any = []
                  let min_dist = 10000;
                  let best_match_idx = -1;
                  for (var i = 0; i < crafted_spells.length; i++) {
                    const dtw = ComputeDTW(last_cast, crafted_spells[i].gesture);
                    spell_dtws.push(dtw)
                    let dthumb = finger_weights['thumb'] * (dtw['dist']['thumb0'] + dtw['dist']['thumb1'])
                      dthumb = isNaN(dthumb) ? 0 : dthumb
                    let dindex = finger_weights['index'] * (dtw['dist']['index0'] + dtw['dist']['index1'])
                      dindex = isNaN(dindex) ? 0 : dindex
                    let dmiddle = finger_weights['middle'] * (dtw['dist']['middle0'] + dtw['dist']['middle1'])
                      dmiddle = isNaN(dmiddle) ? 0 : dmiddle
                    let dring = finger_weights['ring'] * (dtw['dist']['ring0'] + dtw['dist']['ring1'])
                      dring = isNaN(dring) ? 0 : dring
                    let dpinky = finger_weights['pinky'] * (dtw['dist']['pinky0'] + dtw['dist']['pinky1'])
                      dpinky = isNaN(dpinky) ? 0 : dpinky
                    let weighted_dist = dthumb + dindex + dmiddle + dring + dpinky;
                    if(min_dist > weighted_dist){
                      best_match_idx = 1*i;
                      min_dist = 1*weighted_dist;
                    }
                  }
                  abstract_casts.push({'key': crafted_spells[best_match_idx].key, 'workspace': WorkspaceContext})
                }

              }
            }
          }
          
          if(prev_frame < frame - 5 && crafting && !casting && !abstraction_casting && Date.now() + 5000 > uncraft_bufferStart ){
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
                //socket.emit('spellcast', JSON.stringify({'gesture':last_craft, 'words':'', 'casts':[]}))
                crafting = false;
                abstraction_casting = true;
              }
            }
          }

          if(prev_frame < frame - 5 && casting && !crafting && !abstraction_casting){
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
                casting = false;
            
                if(crafted_spells.length > 0){
                  let spell_dtws:any = []
                  let min_dist = 10000;
                  let best_match_idx = -1;
                  for (var i = 0; i < crafted_spells.length; i++) {
                    const dtw = ComputeDTW(last_cast, crafted_spells[i].gesture);
                    spell_dtws.push(dtw)
                    let dthumb = finger_weights['thumb'] * (dtw['dist']['thumb0'] + dtw['dist']['thumb1'])
                      dthumb = isNaN(dthumb) ? 0 : dthumb
                    let dindex = finger_weights['index'] * (dtw['dist']['index0'] + dtw['dist']['index1'])
                      dindex = isNaN(dindex) ? 0 : dindex
                    let dmiddle = finger_weights['middle'] * (dtw['dist']['middle0'] + dtw['dist']['middle1'])
                      dmiddle = isNaN(dmiddle) ? 0 : dmiddle
                    let dring = finger_weights['ring'] * (dtw['dist']['ring0'] + dtw['dist']['ring1'])
                      dring = isNaN(dring) ? 0 : dring
                    let dpinky = finger_weights['pinky'] * (dtw['dist']['pinky0'] + dtw['dist']['pinky1'])
                      dpinky = isNaN(dpinky) ? 0 : dpinky
                    let weighted_dist = dthumb + dindex + dmiddle + dring + dpinky;
                    if(min_dist > weighted_dist){
                      best_match_idx = 1*i;
                      min_dist = 1*weighted_dist;
                    }
                  }
                  socket.emit('spellmatched', JSON.stringify({'key': crafted_spells[best_match_idx].key, 'workspace': WorkspaceContext}));
              }

              }
            }
          }

          frame++
          //Update: I switched from left & right pinch for craft vs cast, to using both hands to pinch for craft vs putting hands together to cast
          //if (index0 && thumb0 && index1 && thumb1) {
            const craftPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1)
            craftPinching = craftPinch_left > 0.52
            const craftPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1)
            craftPinching = craftPinching && (craftPinch_right > 0.52)

          //THIS MUST COME FIRST
          //end the craft abstraction phase if the user pinches during abstraction casting after craft phase 1 (recording abstraction gesture) has ended.
          if(craftPinching && !casting && !crafting && abstraction_casting){
            //end casting if it has been more than 1 second and the user pinches.
            //Want to give it some extra time here; dont want to go into endless craft loop.
            prev_frame = frame;
            uncraft_bufferStart = Date.now()
            /*if(dustRef.current){
              dustRef.current.visible = false;
            }*/
            dustRef.current.visible = true;

            setDustColor('purple');            
            setTimeout(()=>{
              if(dustRef.current){
                dustRef.current.visible = false;
              }
            }, 4000)
            
            socket.emit('spellcast', JSON.stringify({'gesture':last_craft, 'words':'', 'casts':abstract_casts}))
            abstract_casts = [];
            abstraction_casting = false;
            crafting = false;
            uncraft_bufferStart = Date.now()
          }


           //we set crafting to true, but we do not require pinch to continue crafting
            if(craftPinching && !crafting && !casting && !abstraction_casting && (Date.now() - 5000) > uncraft_bufferStart){
              console.log('crafting spell...')
              setDustColor('red');
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
          if(castPinching && !abstraction_casting && !casting && !crafting){
            console.log('casting spell...')
            setDustColor('lightblue');
            last_cast = [];
            casting = true;
            casting_startTime = Date.now();
          }

          //cast abstraction
          if(castPinching && abstraction_casting && !casting && !crafting){
            console.log('casting spell as part of macro...')
            setDustColor('green');
            last_cast = [];
            casting = true;
            casting_startTime = Date.now();
          }

        //}



        // Update line--not actually needed
        /*
        curve.points[1].copy(handle.position)

        // get current position -- we do not do this anymore
        let value = Math.floor((getTargetPos(handle.position).sub(start).length() / startEnd.length()) * 100)
        if (frame % 5 === 0) {
          setLabel(value)
        }
        */
        prev_craftPinching = craftPinching
        } 
    }
  })


  return (
    <>
    <mesh ref={ref}>
      <mesh ref={dustRef}>
        <Swarm count={5000} color={dustColor} />
      </mesh>
    </mesh>
    </>
  )
}

export default MageHand;