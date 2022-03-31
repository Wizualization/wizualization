//We know this demo from https://codesandbox.io/s/react-xr-hands-demo-gczkp?file=/src/index.tsx works;
import { OrbitControls } from '@react-three/drei/core/OrbitControls'
import { Sky } from '@react-three/drei/core/Sky';
import ReactDOM from 'react-dom';
import React, { Component, Suspense, useEffect, useReducer, useState } from 'react';
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr';
import { Dictaphone } from './Components/Verbal/SpeechToText.js';
import './App.css';
import { reducer, initialState, DispatchContext } from './utils/Reducer';
import { socket, setupSocketEvents } from './utils/Socket';
import { GesturePrimitives, SpellPages } from 'spellbook'; 
import MageHand from './Components/Somatic/MageHand';
import Interpreter from './SpellCasting/Interpreter';
//const spellbook = require('spellbook');
//import client from './utils/socketConfig';


// Hololens user agent is going to be a version of edge above the latest release
let ua = navigator.userAgent.toLowerCase();
console.log(ua)
let isHL = ua.replace('edg', '').length < ua.length;
let primitives : any = []
for(let prim in GesturePrimitives()){
  primitives.push(prim)
}
//const primitives: any = [];
//console.log(primitives);
 

// Not sure why other joint pos demo breaks, but https://codesandbox.io/s/47vqp?file=/src/App.tsx works.
/*
class App extends Component {

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
*/
  export default function App(){
    const [state, dispatch] = useReducer(reducer, initialState);
    //const [errState, setErrState] = useState({ error: false })
    const exampleSpells = [
      {
        'code': `var hello = "hello World";
        console.log(hello);`,
        'language': 'javascript'
      },
      {
        'code': `  componentWillMount() {
          client.onopen = () => {
            console.log('WebSocket Client Connected');
          };
          client.onmessage = (message) => {
            console.log(message);
          };
        }`,
        'language': 'javascript'
      },
      {
        'code': `const grimoire = Object.keys(state.spells).map(key=>{
          return {
            key: key,
            gesture:state.spells[key]?.gesture, 
            words:state.spells[key]?.words
          };
        });`,
        'language': 'javascript'
      },

      /*
      {
        'code': `PROGRAM HELLO
    WRITE (*,100)
    STOP
100 FORMAT (' Hello World! ' /)
    END`,
    'language': 'fortran'},
    {
      'code': `print("Hello World")`,
      'language': 'python'
    },
    {
      'code': `main = putStrLn "Hello World"`,
      'language': 'haskell'
    }
    */
    ]
    const grimoire = Object.keys(state.spells).map(key=>{
      //let fn_arr = state.spells[key]?.spellname.split('.')
      return {
        key: key,
        gesture:state.spells[key]?.gesture, 
        //words:'.'+fn_arr[(fn_arr.length-1)]
        words:state.spells[key]?.words
      };
    })

    // cdm
    useEffect(() => {
      // Set up socketio here
      setupSocketEvents(dispatch);
    }, []);

    //why am i getting max call stack exceeded errors from this?
    // suspense doesnt really help in this case bc wont error out until it actually hits the max call stack 
    // is this a new problem from my latest version of the @react-three/xr package?
    //<Suspense fallback={<></>}></Suspense>
    
  //render() {
    //before magehands
//          
 
    return (
      <DispatchContext.Provider value={dispatch}>
      <div>
      {isHL ? 
        <VRCanvas>
          <Hands /> 
          <SpellPages spells={exampleSpells} />
          <MageHand grimoire={[...primitives, ...grimoire]} /> 
          <OrbitControls />
          <ambientLight />
          <pointLight position={[1, 1, 1]} />
          <color args={['black']} attach="background" />
        </VRCanvas>
        : <Dictaphone />
      }
        {
          grimoire.map((spell, index) => {
              console.log(spell);
              return (
                <Interpreter key={spell.key} gesture={spell.gesture} words={spell.words}/>
                )})
        }

      </div>
      </DispatchContext.Provider>
    );
  //}
}

//export default App;
