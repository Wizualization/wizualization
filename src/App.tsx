/**
 *    * Wiz creates a specification config (user can refer to ./models/config, but 
 *      it is also contained in optomancy).
 *      When a spell is cast that gets sent to optomancy,
 *      and which will become what our spellbook code blocks
 *      display. 
 */

import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import React, {
  Suspense,
  useEffect,
  useReducer,
} from "react";
import { VRCanvas, DefaultXRControllers } from "@react-three/xr";
import { OptomancyR3F } from "optomancy-r3f";
import { Dictaphone } from "./Components/Verbal/SpeechToText.js";
import "./App.css";
import { reducer, initialState, DispatchContext } from "./utils/Reducer";
import { setupSocketEvents } from "./utils/Socket";
import { GesturePrimitives } from "./SpellBook/GesturePrimitives";
import { SpellPages } from "./SpellBook/SpellPages";
import { ConfigType } from 'optomancy/dist/types';
import MageHand from "./Components/Somatic/MageHand";
import ConfigGen from "./SpellCasting/ConfigGen";
import ConfigStepTrace from "./SpellCasting/ConfigStepTrace";
import { nhanes, iris, populations } from './examples/datasets';

const WorkspaceContext = React.createContext('workspace_0');
const ViewContext = React.createContext('view_0');
// Hololens user agent is going to be a version of edge above the latest release
let ua = navigator.userAgent.toLowerCase();
let isHL = ua.replace("edg", "").length < ua.length;
let primitives: any = [];
for (let prim of GesturePrimitives()) {
  primitives.push(prim);
}
const S4 = function() {
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

/** A special little demo just for Pete setup */
    //Simple demo room
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomName = urlParams.get('room')
  const demo_check = roomName === 'petesolodemo' || roomName === 'petecollabdemo' /*|| roomName === 'petedemobars'*/; //demobars does not work due to OptomancyR3F being picky lol

  const rainfall =  [
    {
      month: "January",
      rainfall: 188.9,
      meanTempC: 4.9,
      meanTempF: 2.9,
      meanTempS: "4.9C",
      month2: "January",
    },
    {
      month: "February",
      rainfall: 79.9,
      meanTempC: 2.7,
      meanTempF: 2.9,
      meanTempS: "2.7C",
      month2: "February",
    },
    {
      month: "March",
      rainfall: 151.4,
      meanTempC: 4.1,
      meanTempF: 4.9,
      meanTempS: "4.1C",
      month2: "March",
    },
    {
      month: "April",
      rainfall: 120.2,
      meanTempC: 8.7,
      meanTempF: 8.9,
      meanTempS: "8.7C",
      month2: "April",
    },
    {
      month: "May",
      rainfall: 64.3,
      meanTempC: 11.8,
      meanTempF: 11.9,
      meanTempS: "11.8C",
      month2: "May",
    },
    {
      month: "June",
      rainfall: 19,
      meanTempC: 15.4,
      meanTempF: 15.9,
      meanTempS: "15.4C",
      month2: "June",
    },
    {
      month: "July",
      rainfall: 16.4,
      meanTempC: 17.2,
      meanTempF: 17.9,
      meanTempS: "17.2C",
      month2: "July",
    },
    {
      month: "August",
      rainfall: 101.5,
      meanTempC: 15.2,
      meanTempF: 15.9,
      meanTempS: "15.2C",
      month2: "August",
    },
    {
      month: "September",
      rainfall: 144.6,
      meanTempC: 12.5,
      meanTempF: 12.9,
      meanTempS: "12.5C",
      month2: "September",
    },
    {
      month: "October",
      rainfall: 135.8,
      meanTempC: 9.6,
      meanTempF: 9.9,
      meanTempS: "9.6C",
      month2: "October",
    },
    {
      month: "November",
      rainfall: 169.8,
      meanTempC: 7.5,
      meanTempF: 7.9,
      meanTempS: "7.5C",
      month2: "November",
    },
    {
      month: "December",
      rainfall: 201.4,
      meanTempC: 7.0,
      meanTempF: 7,
      meanTempS: "7.0C",
      month2: "December",
    },
  ]

  let demo_cast_order : string[] = [];

  if(roomName === 'petesolodemo'){
    demo_cast_order = ['axis', 'axis', 'color', 'axis', 'view', 'axis', 'axis', 'color'];
  }

  if(roomName === 'petedemobars'){
    demo_cast_order = ['axis', 'point', 'axis', 'color', 'bar', 'bar'];
  }



  if(roomName === 'petecollabdemo'){
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
  /** end block of special little demo just for Pete, to be continued in-app */



export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const grimoire = Object.keys(state.spells).map((key) => {
    return {
      key: key,
      gesture: state.spells[key]?.gesture,
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

  /**Continue the special little demo just for Pete in-app */
  let demo_cast_len = demo_check ? state.matchedSpells.length % demo_cast_order.length : 0;
  let demo_matchedSpells : any[] = demo_check ? Array.apply(null, Array(demo_cast_len)).map(function (x, i) { 
    return {"key":demo_primitives[demo_cast_order[i]], "optoClass": demo_cast_order[i]}; 
  }) : [];

  let demo_config : ConfigType = ConfigGen({
    datasets: [
        {values: rainfall, name: 'cy_weather'}, 
        {values: nhanes, name: 'NHANES'}, 
        {values: iris, name: 'Iris'}, 
        {values: populations, name: 'Populations'}
    ], 
    matchedSpells: demo_matchedSpells, 
    workspaces:  [...new Set(demo_matchedSpells.map((spell: any) => spell.workspace))]
  });

  let demo_spellbookBlocks : any[] = ConfigStepTrace({
    datasets: [
      {values: rainfall, name: 'cy_weather'}, 
      {values: nhanes, name: 'NHANES'}, 
      {values: iris, name: 'Iris'}, 
      {values: populations, name: 'Populations'}
    ], 
    matchedSpells: demo_matchedSpells
  });    
  /** end block of special little demo just for Pete */


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
  })
    
  return (
    <DispatchContext.Provider value={dispatch}>
      <WorkspaceContext.Provider value={'workspace_0'}>
      <ViewContext.Provider value={'view_0'}>
        <div>
          <div className="DemoGrid">
            <div className="DemoVideo">
              <video style={{width:'50vw'}} controls>
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
              <SpellPages spells={ demo_check ? demo_spellbookBlocks : spellbookBlocks } />
              <MageHand grimoire={[...primitives, ...grimoire]} context={state.workview.workspace}/>

              <OrbitControls />
              <ambientLight />
              <pointLight position={[1, 1, 1]} />
              <color args={["black"]} attach="background" />
              {Object.keys(config).includes('workspaces') ? (
                  config['workspaces'].length > 0 ? 
                    <Suspense fallback={null}>
                    <OptomancyR3F position = {[0, 2, -1]}  config = {demo_check ? demo_config : config}/> 
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
