/** TODO
 *    * Wiz needs to create a config (SCHEMA DONE uses ./models/config) 
 *      when a spell is cast that gets sent to optomancy,
 *      and which will become what our spellbook code blocks
 *      display. Refer to 
 *      https://docs.google.com/spreadsheets/d/1WdzG45G8_wPnhOeLuEgZEYGCOWJqBhzJeYFBL7Pbdf0/edit#gid=0 
 *      for contents of spec.
 */

//We know this demo from https://codesandbox.io/s/react-xr-hands-demo-gczkp?file=/src/index.tsx works;
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
//import { Sky } from "@react-three/drei/core/Sky";
//import ReactDOM from "react-dom";
import React, {
  Component,
  Suspense,
  useEffect,
  useReducer,
  useState,
} from "react";
import { VRCanvas, Hands, DefaultXRControllers } from "@react-three/xr";
import { OptomancyR3F } from "optomancy-r3f";
import { Dictaphone } from "./Components/Verbal/SpeechToText.js";
import "./App.css";
import { reducer, initialState, DispatchContext } from "./utils/Reducer";
import { socket, setupSocketEvents } from "./utils/Socket";
import { GesturePrimitives } from "./SpellBook/GesturePrimitives";
import { SpellPages } from "./SpellBook/SpellPages";
import MageHand from "./Components/Somatic/MageHand";
import ConfigGen from "./SpellCasting/ConfigGen";
import { iris, populations } from './examples/datasets';
import { Workspace } from "optomancy";
//import { Interpreter } from "./SpellCasting/Interpreter";
//const spellbook = require('spellbook');
//import client from './utils/socketConfig';

const WorkspaceContext = React.createContext('workspace_0');
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

const S4 = function() {
  //return (((1+Math.random())*0x10000)|0).toString(8).substring(1);
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 4)
};

function joinNewRoom(){
  const { protocol, pathname, host } = window.location;
  const newUrl = `${protocol}//${host}${pathname}?room=${S4()+S4()}`;
  window.location.href = newUrl;
}

if(new URLSearchParams(window.location.search).get("room") == null){
  joinNewRoom();
}

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


  const config = ConfigGen({
    datasets: [
      {values: iris, name: 'Iris'}, 
      {values: populations, name: 'Populations'}
    ], 
    matchedSpells: state.matchedSpells, 
    workspaces:  [...new Set(state.matchedSpells.map((spell: any) => spell.workspace))]
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
    console.log("CONFIG", config);
    //console.log("CHECK LEN", config.workspace)

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

/*
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
*/
//<Hands />
//goes under magehand
//<Interpreter castSpells={state.matchedSpells}/>

  return (
    <DispatchContext.Provider value={dispatch}>
      <WorkspaceContext.Provider value={'workspace_0'}>
        <div>
          <div className="DemoGrid">
            <div className="DemoVideo">
              <video  controls>
                <source src="./WizDemoSequence.mp4" type="video/mp4"></source>
              </video>
            </div>
            <div className="DemoDocs">
            <p>You are currently in room {new URLSearchParams(window.location.search).get("room")}.</p>
            <button onClick={joinNewRoom}>Join new room</button>
            <p>Please review the brief demo video on the left of a sequence of interactions: Solo gesture, collaborative gesture, and solo spoken word inputs.</p>
            <p>This demo currently implements a subset of the Optomancy grammar rules that can be called with American Sign Language (ASL) words using midair gestures on the HoloLens 2 (HL2), or spoken English words from your mobile device while your mobile device is in the same room as your HL2.</p>
            <p>These rules are associated with the following words:</p>
            <p>• Point mark types, which can be called using <a href="https://www.handspeak.com/word/search/index.php?id=10048">the word "Dot" in ASL</a> or the spoken English word "Point" from mobile;</p>
            <p>• Axis creation for three variables from the Iris dataset, which can be called using <a href="https://www.handspeak.com/word/search/index.php?id=8843">the word "X-Axis" in ASL</a> or the spoken English word "Axis" from mobile; and</p>
            <p>• Mark coloring using the species name from the Iris dataset, which can be called using <a href="https://www.handspeak.com/word/search/index.php?id=1591">the word "Paint" in ASL</a> or the spoken English word "Color" from mobile.</p>
            <p>These commands can be called in any order.</p>
            </div>
          {isHL || new URLSearchParams(window.location.search).get("dev") ? (
            <div className="DemoMain">
            <VRCanvas>
              <DefaultXRControllers />
              <SpellPages spells={exampleSpells} />
              <MageHand grimoire={[...primitives, ...grimoire]} context={WorkspaceContext}/>

              <OrbitControls />
              <ambientLight />
              <pointLight position={[1, 1, 1]} />
              <color args={["black"]} attach="background" />

            </VRCanvas>
            </div>
          ) : (
            <div className="DemoMain">
            <Dictaphone grimoire={[...primitives, ...grimoire]}/>
            </div>
          )}
          </div>
        </div>
        <VRCanvas >
          { Object.keys(config).includes('workspaces') ? (
          <OptomancyR3F config = {config}/>
          ) : null
          }
        </VRCanvas>
      </WorkspaceContext.Provider>
    </DispatchContext.Provider>
  );
  //}
}

//export default App;
