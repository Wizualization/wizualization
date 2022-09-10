import * as THREE from 'three';
import React, { createContext, useMemo, useRef, useState, useContext, useLayoutEffect, forwardRef, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { QuadraticBezierLine, Line, Text } from '@react-three/drei';
import without from 'lodash-es/without';
import { SpellBlock } from './SpellBlock';

/*
const context = createContext()
const Circle = forwardRef(({ children, opacity = 1, radius = 0.05, segments = 32, color = '#ff1050', ...props }, ref) => (
  <mesh ref={ref} {...props}>
    <circleGeometry args={[radius, segments]} />
    <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color} />
    {children}
  </mesh>
))

export function Nodes({ children }) {
  const group = useRef()
  const [nodes, set] = useState([])
  const lines = useMemo(() => {
    const lines = []
    for (let node of nodes)
      node.connectedTo
        .map((ref) => [node.position, ref.current.position])
        .forEach(([start, end]) => lines.push({ start: start.clone().add({ x: 0.35, y: 0, z: 0 }), end: end.clone().add({ x: -0.35, y: 0, z: 0 }) }))
    return lines
  }, [nodes])
  useFrame((_, delta) => group.current.children.forEach((group) => (group.children[0].material.uniforms.dashOffset.value -= delta * 10)))
  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map((line, index) => (
          <group>
            <QuadraticBezierLine key={index} {...line} color="white" dashed dashScale={50} gapSize={20} />
            <QuadraticBezierLine key={index} {...line} color="white" lineWidth={0.5} transparent opacity={0.1} />
          </group>
        ))}
      </group>
      {children}
      {lines.map(({ start, end }, index) => (
        <group key={index} position-z={1}>
          <Circle position={start} />
          <Circle position={end} />
        </group>
      ))}
    </context.Provider>
  )
}

export const Node = forwardRef(({ color = 'black', name, connectedTo = [], position = [0, 0, 0], ...props }, ref) => {
  const set = useContext(context)
  const { size, camera } = useThree()
  const [pos, setPos] = useState(() => new THREE.Vector3(...position))
  const state = useMemo(() => ({ position: pos, connectedTo }), [pos, connectedTo])
  // Register this node on mount, unregister on unmount
  useLayoutEffect(() => {
    set((nodes) => [...nodes, state])
    return () => void set((nodes) => nodes.filter((n) => n !== state))
  }, [state, pos])
  // Drag n drop, hover
  const [hovered, setHovered] = useState(false)
  useEffect(() => void (document.body.style.cursor = hovered ? 'grab' : 'auto'), [hovered])
  
  const bind = useDrag(({ down, xy: [x, y] }) => {
    document.body.style.cursor = down ? 'grabbing' : 'grab'
    setPos(new THREE.Vector3((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0).unproject(camera).multiply({ x: 1, y: 1, z: 0 }).clone())
  })

  return (
    <Circle ref={ref} opacity={0.2} radius={0.5} color={color} position={pos} {...props}>
      <Circle
        radius={0.25}
        position={[0, 0, 0.1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        color={hovered ? '#ff1050' : color}>
        <SpellBlock code={props.code} language={props.language} />
      </Circle>
    </Circle>
  )
})
*/

const temp = new THREE.Vector3()
const context = createContext()

function Dot(props) {
  //decided i dont actually want these circles for now, removed
  //      <circleGeometry args={[0.05, 16]} />
  //      <meshBasicMaterial color="#ff1050" />

  return (
    <mesh {...props}>
    </mesh>
  )
}

function Nodes({ children, ...props }) {

  const [nodes, set] = useState([])
  //Create the lines with useMemo();
  // the problem is that useMemo is not getting called after drag.
  const lines = useMemo(() => {
    console.log('CALLING MEMO')
    const lines = []
    for (let node of nodes) {
      if (node.connectedTo.length) {
        const connections = node.connectedTo?.map((ref) => {
          if(ref){
            return [node.position, ref.current?.position]
          } else {
            return [node.position, new THREE.Vector3(0,0,0)]
          }
        })
        connections.forEach(([start, end]) => {
          start = start?.clone().add(temp.set(0, 0, 0))
          end = end?.clone().add(temp.set(0, 0, 0))
          let mid = new THREE.Vector3(0,0,0);
          if(typeof start != 'undefined' && typeof end != 'undefined'){
            mid = start?.clone().add(end?.clone().sub(start)).add(new THREE.Vector3((start?.x - end?.x), start?.y + 0.1, (start?.z - end?.z))) // prettier-ignore
          } 
          lines.push(new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(30))
        })
      }
    }
    return lines
  }, [nodes])


  const group = useRef()
  //-= delta was original direction but we want the lines to flow backward because that's our forward
  useFrame((_, delta) => group.current.children.forEach((line) => (line.material.uniforms.dashOffset.value += delta)))

  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map((points, index) => (
          <Line key={index} points={points} color="white" dashed dashScale={10} />
        ))}
      </group>
      {children}
      {lines.map((points, i) => (
        <group key={i} position-z={0.25}>
          <Dot position={points[0]} />
          <Dot position={points[points.length - 0.25]} />
        </group>
      ))}
    </context.Provider>
  )
}

const Node = forwardRef(({ name, connectedTo = [], position = [0, 0, 0], ...props }, ref) => {
  const set = useContext(context)
  const { size, camera } = useThree()
  const [pos, setPos] = useState(() => new THREE.Vector3(...position))
  const state = useMemo(() => ({ position: pos, connectedTo }), [pos, connectedTo])

  useLayoutEffect(() => {
    // Register this node on mount
    set((nodes) => [...nodes, state])
    // Unregister on unmount
    return () => set((nodes) => without(nodes, state))
  }, [state, pos])

    const { gl } = useThree()
    const hand0 = (gl.xr).getHand(0);
    const hand1 = (gl.xr).getHand(1);
    useFrame(() => {
      if (!ref) return
      if (!ref.current) return
      const index0 = hand0.joints['index-finger-tip']
      const index1 = hand1.joints['index-finger-tip']
      const thumb0 = hand0.joints['thumb-tip']
      const thumb1 = hand1.joints['thumb-tip']
        if(index0 && index1){
          const left_isNear = Math.max(0, 1 - index0.position.distanceTo(ref.current.position) / 1) > 0.8
        const right_isNear = Math.max(0, 1 - index1.position.distanceTo(ref.current.position) / 1) > 0.8
        if(left_isNear){
          const grabPinch_left = Math.max(0, 1 - index0.position.distanceTo(thumb0.position) / 0.1) > 0.6
          if(grabPinch_left){
            //ref.current?.position.set(index0.position.x, index0.position.y, index0.position.z);
            ref.current.position.x = index0.position.x;
            ref.current.position.y = index0.position.y;
            ref.current.position.z = index0.position.z;
            ref.current.rotation.x = index0?.rotation.x;
            ref.current.rotation.y = index0?.rotation.y;
            ref.current.rotation.z = index0?.rotation.z;
            setPos(ref.current.position);
            //do we need to re-register to get the lines to work?
            set((nodes) => [...nodes, state]) //yes!! that did the trick

          }
        } else {
          //lefty dominance if trying to grab with both hands, which the user should never do bc it will craft a spell lol
          if(right_isNear){
            const grabPinch_right = Math.max(0, 1 - index1.position.distanceTo(thumb1.position) / 0.1) > 0.6
            if(grabPinch_right){
              ref.current.position.x = index1.position.x;
              ref.current.position.y = index1.position.y;
              ref.current.position.z = index1.position.z;
              ref.current.rotation.x = index1?.rotation.x;
              ref.current.rotation.y = index1?.rotation.y;
              ref.current.rotation.z = index1?.rotation.z;
              setPos(ref.current.position);
              set((nodes) => [...nodes, state])

            }
              
          }
      
        }
      }
    });
  
  return (
    <mesh ref={ref} position={position} {...props}>
      <Suspense fallback={<></>}>
        <mesh>
        <SpellBlock code={props.code} language={props.language} />
        </mesh>
      </Suspense>
    </mesh>
  )
})

export { Nodes, Node }
