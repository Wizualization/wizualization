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
              <SpellPages spells={ spellbookBlocks } />
              <MageHand grimoire={[...primitives, ...grimoire]} context={state.workview.workspace}/>

              <OrbitControls />
              <ambientLight />
              <pointLight position={[1, 1, 1]} />
              <color args={["black"]} attach="background" />
              {Object.keys(config).includes('workspaces') ? (
                  config['workspaces'].length > 0 ? 
                    <Suspense fallback={null}>
                    <OptomancyR3F position = {[0, 2, -1]} config = { config }/> 
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
