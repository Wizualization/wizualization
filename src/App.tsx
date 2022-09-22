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
  useRef
} from "react";
import { VRCanvas, Hands, DefaultXRControllers } from "@react-three/xr";
import { OptomancyR3F } from "optomancy-r3f";
import { Dictaphone } from "./Components/Verbal/SpeechToText.js";
import "./App.css";
import { reducer, initialState, DispatchContext } from "./utils/Reducer";
import { socket, setupSocketEvents } from "./utils/Socket";
import { GesturePrimitives } from "./SpellBook/GesturePrimitives";
import { SpellPages } from "./SpellBook/SpellPages";
import { ConfigType } from 'optomancy/dist/types';
import MageHand from "./Components/Somatic/MageHand";
import ConfigGen from "./SpellCasting/ConfigGen";
import ConfigStepTrace from "./SpellCasting/ConfigStepTrace";
import { nhanes, iris, populations } from './examples/datasets';
//import { Workspace } from "optomancy";
//import { Interpreter } from "./SpellCasting/Interpreter";
//const spellbook = require('spellbook');
//import client from './utils/socketConfig';



const WorkspaceContext = React.createContext('workspace_0');
const ViewContext = React.createContext('view_0');
// Hololens user agent is going to be a version of edge above the latest release
let ua = navigator.userAgent.toLowerCase();
//console.log(ua);
let isHL = ua.replace("edg", "").length < ua.length;
let primitives: any = [];
for (let prim of GesturePrimitives()) {
  //console.log(prim);
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

  const grimoire = Object.keys(state.spells).map((key) => {
    //let fn_arr = state.spells[key]?.spellname.split('.')
    return {
      key: key,
      gesture: state.spells[key]?.gesture,
      //words:'.'+fn_arr[(fn_arr.length-1)]
      words: state.spells[key]?.words,
    };
  });

  const config : ConfigType = ConfigGen({
    datasets: [
        {values: nhanes, name: 'NHANES'}, 
        {values: iris, name: 'Iris'}, 
        {values: populations, name: 'Populations'}
    ], 
    matchedSpells: state.matchedSpells, 
    workspaces:  [...new Set(state.matchedSpells.map((spell: any) => spell.workspace))]
  });

  const spellbookBlocks = ConfigStepTrace({
    datasets: [
    {values: nhanes, name: 'NHANES'}, 
    {values: iris, name: 'Iris'}, 
      {values: populations, name: 'Populations'}
    ], 
    matchedSpells: state.matchedSpells
  });


    //Simple demo room
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const roomName = urlParams.get('room')
    const demo_check = roomName === 'solodemo' || roomName === 'collabdemo';
    let demo_cast_order : string[] = [];

    if(roomName === 'solodemo'){
      demo_cast_order = ['axis', 'axis', 'color', 'axis', 'view', 'axis', 'axis', 'color'];
    }

    if(roomName === 'collabdemo'){
      //demo_cast_order = ['column', 'axis', 'axis', 'view', 'point', 'axis', 'axis', 'axis', 'color', 'view', 'point', 'axis', 'axis', 'color'];
      demo_cast_order = ['point', 'axis', 'axis', 'axis', 'color', 'view', 'point', 'axis', 'axis', 'color'];
    }
    let demo_primitives = {
      "line": "a07ff089-2ca2-1341-cc58-74509f1d8577",
      "point": "1f1459f2-688e-5d2a-2366-5cb00328eb2c",
      "bar": "9458d9af-68e1-e137-d7c8-546055a92cdd",
      "column": "75e76e72-acb2-350c-3a95-a86ab5255c66",
      "color": "2818b295-2a1a-c14e-1259-da58eb3fe09e",
      "axis": "f15012d8-a09f-c3b7-90a7-66f796e29fa6",
      "view": "4a08f949-57a7-7604-33d2-dfdc4315d0b1"
    }
  

  /*
  //initialize with real config
  let [demo_config, setDemoConfig] = useState<ConfigType>(config);
  let [demo_matchedSpells, setDemoMatchedSpells] = useState<any[]>([]);
  let [demo_spellbookBlocks, setDemoSpellbookBlocks] = useState<any[]>([]);
  useEffect(() => {
    //demo for video just to avoid wasting time with gesture screw-ups
      if(demo_check){
        let demo_cast_len = state.matchedSpells.length % demo_cast_order.length;
  
        setDemoMatchedSpells(Array.apply(null, Array(demo_cast_len)).map(function (x, i) { 
          return {"key":demo_primitives[demo_cast_order[i]], "optoClass": demo_cast_order[i]}; 
        }));
  
        setDemoConfig(ConfigGen({
          datasets: [
              {values: nhanes, name: 'NHANES'}, 
              {values: iris, name: 'Iris'}, 
              {values: populations, name: 'Populations'}
          ], 
          matchedSpells: demo_matchedSpells, 
          workspaces:  [...new Set(demo_matchedSpells.map((spell: any) => spell.workspace))]
        }));

        setDemoSpellbookBlocks(ConfigStepTrace({
          datasets: [
          {values: nhanes, name: 'NHANES'}, 
          {values: iris, name: 'Iris'}, 
            {values: populations, name: 'Populations'}
          ], 
          matchedSpells: demo_matchedSpells
        }))
      }
    });
  

  */
  let demo_cast_len = demo_check ? state.matchedSpells.length % demo_cast_order.length : 0;
  let demo_matchedSpells : any[] = demo_check ? Array.apply(null, Array(demo_cast_len)).map(function (x, i) { 
    return {"key":demo_primitives[demo_cast_order[i]], "optoClass": demo_cast_order[i]}; 
  }) : [];

  let demo_config : ConfigType = ConfigGen({
    datasets: [
        {values: nhanes, name: 'NHANES'}, 
        {values: iris, name: 'Iris'}, 
        {values: populations, name: 'Populations'}
    ], 
    matchedSpells: demo_matchedSpells, 
    workspaces:  [...new Set(demo_matchedSpells.map((spell: any) => spell.workspace))]
  });

  let demo_spellbookBlocks : any[] = ConfigStepTrace({
    datasets: [
    {values: nhanes, name: 'NHANES'}, 
    {values: iris, name: 'Iris'}, 
      {values: populations, name: 'Populations'}
    ], 
    matchedSpells: demo_matchedSpells
  });

 
   // cdm
   useEffect(() => {
    // Set up socketio here
    setupSocketEvents(dispatch);
  }, []);

  useEffect(() => {
    console.log("STATE", state);
    console.log("GRIMOIRE", grimoire);
    console.log("CONFIG", config);
    console.log("SPELLBOOK_PAGES", spellbookBlocks);
    if(demo_check){
      console.log("DEMO_MATCHED_SPELLS", demo_matchedSpells);
      console.log("DEMO_CONFIG", demo_config);
      console.log("DEMO_SPELLBOOK_PAGES", demo_spellbookBlocks);
    }
  })
  
   

  
  return (
    <DispatchContext.Provider value={dispatch}>
      <WorkspaceContext.Provider value={'workspace_0'}>
      <ViewContext.Provider value={'view_0'}>
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
              <SpellPages spells={demo_check ? demo_spellbookBlocks : spellbookBlocks} />
              <MageHand grimoire={[...primitives, ...grimoire]} context={state.workview.workspace}/>

              <OrbitControls />
              <ambientLight />
              <pointLight position={[1, 1, 1]} />
              <color args={["black"]} attach="background" />
              {Object.keys(config).includes('workspaces') ? (
                  config['workspaces'].length > 0 ? 
                    <Suspense fallback={null}>
                    <OptomancyR3F position = {[0, 2, -1]} config = {demo_check ? demo_config : config}/> 
                    </Suspense>
                    : null
                ) : null
              }
            </VRCanvas>
            </div>
          ) : (
            <div className="DemoMain">
            <Dictaphone grimoire={[...primitives, ...grimoire]} context={state.workview.workspace}/>
            </div>
          )}
          </div>
        </div>
        </ViewContext.Provider>
      </WorkspaceContext.Provider>
    </DispatchContext.Provider>
  );
  //}
}

//export default App;
