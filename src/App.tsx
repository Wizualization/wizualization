//We know this demo from https://codesandbox.io/s/react-xr-hands-demo-gczkp?file=/src/index.tsx works;
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { Sky } from "@react-three/drei/core/Sky";
import ReactDOM from "react-dom";
import React, {
  Component,
  Suspense,
  useEffect,
  useReducer,
  useState,
} from "react";
import { VRCanvas, Hands, DefaultXRControllers } from "@react-three/xr";
import { Dictaphone } from "./Components/Verbal/SpeechToText.js";
import "./App.css";
import { reducer, initialState, DispatchContext } from "./utils/Reducer";
import { socket, setupSocketEvents } from "./utils/Socket";
import { GesturePrimitives, SpellPages } from "spellbook";
import MageHand from "./Components/Somatic/MageHand";
import { Interpreter } from "./SpellCasting/Interpreter";
//const spellbook = require('spellbook');
//import client from './utils/socketConfig';


// Hololens user agent is going to be a version of edge above the latest release
let ua = navigator.userAgent.toLowerCase();
console.log(ua);
let isHL = ua.replace("edg", "").length < ua.length;
let primitives: any = [];
for (let prim of GesturePrimitives()) {
  console.log(prim);
  primitives.push(prim);
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
export default function App() {
  //Suppress/unsuppress during dev sprints

  const [state, dispatch] = useReducer(reducer, initialState);
  //const [errState, setErrState] = useState({ error: false })

  //todo: change this into sequence of cast spells
  let exampleSpells : any = [
    {
      code: `var hello = "hello World";
        console.log(hello);`,
      language: "javascript",
    },
    {
      code: `  componentWillMount() {
          client.onopen = () => {
            console.log('WebSocket Client Connected');
          };
          client.onmessage = (message) => {
            console.log(message);
          };
        }`,
      language: "javascript",
    },
    {
      code: `const grimoire = Object.keys(state.spells).map(key=>{
          return {
            key: key,
            gesture:state.spells[key]?.gesture, 
            words:state.spells[key]?.words
          };
        });`,
      language: "javascript",
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
  ];
  //unsuppress if we want to drop our example spells;
  exampleSpells = []
  const grimoire = Object.keys(state.spells).map((key) => {
    //let fn_arr = state.spells[key]?.spellname.split('.')
    return {
      key: key,
      gesture: state.spells[key]?.gesture,
      //words:'.'+fn_arr[(fn_arr.length-1)]
      words: state.spells[key]?.words,
    };
  });
  
  // cdm
  useEffect(() => {
    // Set up socketio here
    setupSocketEvents(dispatch);
  }, []);

  useEffect(() => {
    // Set up socketio here
    console.log("STATE", state);
    console.log("GRIMOIRE", grimoire);
  })
  //why am i getting max call stack exceeded errors from this?
  // suspense doesnt really help in this case bc wont error out until it actually hits the max call stack
  // is this a new problem from my latest version of the @react-three/xr package?
  //<Suspense fallback={<></>}></Suspense>

  //render() {
  //Suppress/unsuppress during build for pre-release
  //{(typeof state.matchedSpells == 'string') ? <div>Cast spell: {state.matchedSpells}</div> : <></>}

function interpreterMap(el : any, i : number, arr: any) {
  console.log('spell', el, typeof el.key);
  console.log('state.matchedSpells', state.matchedSpells);
  return state.matchedSpells.includes(el.key) ?  el : null
}

const urlRoom = new URLSearchParams(window.location.search).get("room");
if(urlRoom != 'test'){
  return (<div>Updated release date: This site will now be available beginning April 25, 2022.
      <br />
      <br />
      In the meantime, please enjoy this brief demo of a sequence of interactions: Solo gesture, collaborative gesture, and solo spoken word inputs.
      <video width="768" height="452" controls>
        <source src="./WizDemoSequence.mp4" type="video/mp4"></source>
      </video>
  </div>)
}
//<Hands />

  return (
    <DispatchContext.Provider value={dispatch}>
      <div>
        {isHL || new URLSearchParams(window.location.search).get("dev") ? (
          <VRCanvas>
            <DefaultXRControllers />
            <SpellPages spells={exampleSpells} />
            <MageHand grimoire={[...primitives, ...grimoire]} />
            <Interpreter castSpells={state.matchedSpells}/>
            <OrbitControls />
            <ambientLight />
            <pointLight position={[1, 1, 1]} />
            <color args={["black"]} attach="background" />

          </VRCanvas>
        ) : (
          <Dictaphone grimoire={[...primitives, ...grimoire]}/>
        )}
        <video width="768" height="452" controls>
          <source src="./WizDemoSequence.mp4" type="video/mp4"></source>
        </video>
      </div>
    </DispatchContext.Provider>
  );
  //}
}

//export default App;
