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
import { OptomancyR3F } from "./Interpreter";
import { Dictaphone } from "./Components/Verbal/SpeechToText.js";
import "./App.css";
import { reducer, initialState, DispatchContext } from "./utils/Reducer";
import { socket, setupSocketEvents } from "./utils/Socket";
import { GesturePrimitives } from "./SpellBook/GesturePrimitives";
import { SpellPages } from "./SpellBook/SpellPages";
import MageHand from "./Components/Somatic/MageHand";
import ConfigGen from "./SpellCasting/ConfigGen";
import ConfigStepTrace from "./SpellCasting/ConfigStepTrace";
import { iris, populations } from './examples/datasets';
//import { Workspace } from "optomancy";
//import { Interpreter } from "./SpellCasting/Interpreter";
//const spellbook = require('spellbook');
//import client from './utils/socketConfig';

//text test
import { Text } from "@react-three/drei";


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
const example_config = {
  "datasets": [
    {
      "values": [
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.5,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.9,
          "sepalWidth": 3,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.7,
          "sepalWidth": 3.2,
          "petalLength": 1.3,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.6,
          "sepalWidth": 3.1,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.6,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.4,
          "sepalWidth": 3.9,
          "petalLength": 1.7,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 4.6,
          "sepalWidth": 3.4,
          "petalLength": 1.4,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.4,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.4,
          "sepalWidth": 2.9,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.9,
          "sepalWidth": 3.1,
          "petalLength": 1.5,
          "petalWidth": 0.1,
          "species": "setosa"
        },
        {
          "sepalLength": 5.4,
          "sepalWidth": 3.7,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.8,
          "sepalWidth": 3.4,
          "petalLength": 1.6,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.8,
          "sepalWidth": 3,
          "petalLength": 1.4,
          "petalWidth": 0.1,
          "species": "setosa"
        },
        {
          "sepalLength": 4.3,
          "sepalWidth": 3,
          "petalLength": 1.1,
          "petalWidth": 0.1,
          "species": "setosa"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 4,
          "petalLength": 1.2,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 4.4,
          "petalLength": 1.5,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 5.4,
          "sepalWidth": 3.9,
          "petalLength": 1.3,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.5,
          "petalLength": 1.4,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 3.8,
          "petalLength": 1.7,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.8,
          "petalLength": 1.5,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 5.4,
          "sepalWidth": 3.4,
          "petalLength": 1.7,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.7,
          "petalLength": 1.5,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 4.6,
          "sepalWidth": 3.6,
          "petalLength": 1,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.3,
          "petalLength": 1.7,
          "petalWidth": 0.5,
          "species": "setosa"
        },
        {
          "sepalLength": 4.8,
          "sepalWidth": 3.4,
          "petalLength": 1.9,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3,
          "petalLength": 1.6,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.4,
          "petalLength": 1.6,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 5.2,
          "sepalWidth": 3.5,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.2,
          "sepalWidth": 3.4,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.7,
          "sepalWidth": 3.2,
          "petalLength": 1.6,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.8,
          "sepalWidth": 3.1,
          "petalLength": 1.6,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.4,
          "sepalWidth": 3.4,
          "petalLength": 1.5,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 5.2,
          "sepalWidth": 4.1,
          "petalLength": 1.5,
          "petalWidth": 0.1,
          "species": "setosa"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 4.2,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.9,
          "sepalWidth": 3.1,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.2,
          "petalLength": 1.2,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 3.5,
          "petalLength": 1.3,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.9,
          "sepalWidth": 3.6,
          "petalLength": 1.4,
          "petalWidth": 0.1,
          "species": "setosa"
        },
        {
          "sepalLength": 4.4,
          "sepalWidth": 3,
          "petalLength": 1.3,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.4,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.5,
          "petalLength": 1.3,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 4.5,
          "sepalWidth": 2.3,
          "petalLength": 1.3,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 4.4,
          "sepalWidth": 3.2,
          "petalLength": 1.3,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.5,
          "petalLength": 1.6,
          "petalWidth": 0.6,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.8,
          "petalLength": 1.9,
          "petalWidth": 0.4,
          "species": "setosa"
        },
        {
          "sepalLength": 4.8,
          "sepalWidth": 3,
          "petalLength": 1.4,
          "petalWidth": 0.3,
          "species": "setosa"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 3.8,
          "petalLength": 1.6,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 4.6,
          "sepalWidth": 3.2,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5.3,
          "sepalWidth": 3.7,
          "petalLength": 1.5,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 3.3,
          "petalLength": 1.4,
          "petalWidth": 0.2,
          "species": "setosa"
        },
        {
          "sepalLength": 7,
          "sepalWidth": 3.2,
          "petalLength": 4.7,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 3.2,
          "petalLength": 4.5,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.9,
          "sepalWidth": 3.1,
          "petalLength": 4.9,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 2.3,
          "petalLength": 4,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.5,
          "sepalWidth": 2.8,
          "petalLength": 4.6,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 2.8,
          "petalLength": 4.5,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 3.3,
          "petalLength": 4.7,
          "petalWidth": 1.6,
          "species": "versicolor"
        },
        {
          "sepalLength": 4.9,
          "sepalWidth": 2.4,
          "petalLength": 3.3,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.6,
          "sepalWidth": 2.9,
          "petalLength": 4.6,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.2,
          "sepalWidth": 2.7,
          "petalLength": 3.9,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 2,
          "petalLength": 3.5,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.9,
          "sepalWidth": 3,
          "petalLength": 4.2,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 6,
          "sepalWidth": 2.2,
          "petalLength": 4,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.1,
          "sepalWidth": 2.9,
          "petalLength": 4.7,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.6,
          "sepalWidth": 2.9,
          "petalLength": 3.6,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3.1,
          "petalLength": 4.4,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.6,
          "sepalWidth": 3,
          "petalLength": 4.5,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 2.7,
          "petalLength": 4.1,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.2,
          "sepalWidth": 2.2,
          "petalLength": 4.5,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.6,
          "sepalWidth": 2.5,
          "petalLength": 3.9,
          "petalWidth": 1.1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.9,
          "sepalWidth": 3.2,
          "petalLength": 4.8,
          "petalWidth": 1.8,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.1,
          "sepalWidth": 2.8,
          "petalLength": 4,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 2.5,
          "petalLength": 4.9,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.1,
          "sepalWidth": 2.8,
          "petalLength": 4.7,
          "petalWidth": 1.2,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 2.9,
          "petalLength": 4.3,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.6,
          "sepalWidth": 3,
          "petalLength": 4.4,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.8,
          "sepalWidth": 2.8,
          "petalLength": 4.8,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3,
          "petalLength": 5,
          "petalWidth": 1.7,
          "species": "versicolor"
        },
        {
          "sepalLength": 6,
          "sepalWidth": 2.9,
          "petalLength": 4.5,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 2.6,
          "petalLength": 3.5,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 2.4,
          "petalLength": 3.8,
          "petalWidth": 1.1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 2.4,
          "petalLength": 3.7,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 2.7,
          "petalLength": 3.9,
          "petalWidth": 1.2,
          "species": "versicolor"
        },
        {
          "sepalLength": 6,
          "sepalWidth": 2.7,
          "petalLength": 5.1,
          "petalWidth": 1.6,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.4,
          "sepalWidth": 3,
          "petalLength": 4.5,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 6,
          "sepalWidth": 3.4,
          "petalLength": 4.5,
          "petalWidth": 1.6,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3.1,
          "petalLength": 4.7,
          "petalWidth": 1.5,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 2.3,
          "petalLength": 4.4,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.6,
          "sepalWidth": 3,
          "petalLength": 4.1,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 2.5,
          "petalLength": 4,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.5,
          "sepalWidth": 2.6,
          "petalLength": 4.4,
          "petalWidth": 1.2,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.1,
          "sepalWidth": 3,
          "petalLength": 4.6,
          "petalWidth": 1.4,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 2.6,
          "petalLength": 4,
          "petalWidth": 1.2,
          "species": "versicolor"
        },
        {
          "sepalLength": 5,
          "sepalWidth": 2.3,
          "petalLength": 3.3,
          "petalWidth": 1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.6,
          "sepalWidth": 2.7,
          "petalLength": 4.2,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 3,
          "petalLength": 4.2,
          "petalWidth": 1.2,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 2.9,
          "petalLength": 4.2,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.2,
          "sepalWidth": 2.9,
          "petalLength": 4.3,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.1,
          "sepalWidth": 2.5,
          "petalLength": 3,
          "petalWidth": 1.1,
          "species": "versicolor"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 2.8,
          "petalLength": 4.1,
          "petalWidth": 1.3,
          "species": "versicolor"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 3.3,
          "petalLength": 6,
          "petalWidth": 2.5,
          "species": "virginica"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 2.7,
          "petalLength": 5.1,
          "petalWidth": 1.9,
          "species": "virginica"
        },
        {
          "sepalLength": 7.1,
          "sepalWidth": 3,
          "petalLength": 5.9,
          "petalWidth": 2.1,
          "species": "virginica"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 2.9,
          "petalLength": 5.6,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.5,
          "sepalWidth": 3,
          "petalLength": 5.8,
          "petalWidth": 2.2,
          "species": "virginica"
        },
        {
          "sepalLength": 7.6,
          "sepalWidth": 3,
          "petalLength": 6.6,
          "petalWidth": 2.1,
          "species": "virginica"
        },
        {
          "sepalLength": 4.9,
          "sepalWidth": 2.5,
          "petalLength": 4.5,
          "petalWidth": 1.7,
          "species": "virginica"
        },
        {
          "sepalLength": 7.3,
          "sepalWidth": 2.9,
          "petalLength": 6.3,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 2.5,
          "petalLength": 5.8,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 7.2,
          "sepalWidth": 3.6,
          "petalLength": 6.1,
          "petalWidth": 2.5,
          "species": "virginica"
        },
        {
          "sepalLength": 6.5,
          "sepalWidth": 3.2,
          "petalLength": 5.1,
          "petalWidth": 2,
          "species": "virginica"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 2.7,
          "petalLength": 5.3,
          "petalWidth": 1.9,
          "species": "virginica"
        },
        {
          "sepalLength": 6.8,
          "sepalWidth": 3,
          "petalLength": 5.5,
          "petalWidth": 2.1,
          "species": "virginica"
        },
        {
          "sepalLength": 5.7,
          "sepalWidth": 2.5,
          "petalLength": 5,
          "petalWidth": 2,
          "species": "virginica"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 2.8,
          "petalLength": 5.1,
          "petalWidth": 2.4,
          "species": "virginica"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 3.2,
          "petalLength": 5.3,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 6.5,
          "sepalWidth": 3,
          "petalLength": 5.5,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 7.7,
          "sepalWidth": 3.8,
          "petalLength": 6.7,
          "petalWidth": 2.2,
          "species": "virginica"
        },
        {
          "sepalLength": 7.7,
          "sepalWidth": 2.6,
          "petalLength": 6.9,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 6,
          "sepalWidth": 2.2,
          "petalLength": 5,
          "petalWidth": 1.5,
          "species": "virginica"
        },
        {
          "sepalLength": 6.9,
          "sepalWidth": 3.2,
          "petalLength": 5.7,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 5.6,
          "sepalWidth": 2.8,
          "petalLength": 4.9,
          "petalWidth": 2,
          "species": "virginica"
        },
        {
          "sepalLength": 7.7,
          "sepalWidth": 2.8,
          "petalLength": 6.7,
          "petalWidth": 2,
          "species": "virginica"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 2.7,
          "petalLength": 4.9,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3.3,
          "petalLength": 5.7,
          "petalWidth": 2.1,
          "species": "virginica"
        },
        {
          "sepalLength": 7.2,
          "sepalWidth": 3.2,
          "petalLength": 6,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.2,
          "sepalWidth": 2.8,
          "petalLength": 4.8,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.1,
          "sepalWidth": 3,
          "petalLength": 4.9,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 2.8,
          "petalLength": 5.6,
          "petalWidth": 2.1,
          "species": "virginica"
        },
        {
          "sepalLength": 7.2,
          "sepalWidth": 3,
          "petalLength": 5.8,
          "petalWidth": 1.6,
          "species": "virginica"
        },
        {
          "sepalLength": 7.4,
          "sepalWidth": 2.8,
          "petalLength": 6.1,
          "petalWidth": 1.9,
          "species": "virginica"
        },
        {
          "sepalLength": 7.9,
          "sepalWidth": 3.8,
          "petalLength": 6.4,
          "petalWidth": 2,
          "species": "virginica"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 2.8,
          "petalLength": 5.6,
          "petalWidth": 2.2,
          "species": "virginica"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 2.8,
          "petalLength": 5.1,
          "petalWidth": 1.5,
          "species": "virginica"
        },
        {
          "sepalLength": 6.1,
          "sepalWidth": 2.6,
          "petalLength": 5.6,
          "petalWidth": 1.4,
          "species": "virginica"
        },
        {
          "sepalLength": 7.7,
          "sepalWidth": 3,
          "petalLength": 6.1,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 3.4,
          "petalLength": 5.6,
          "petalWidth": 2.4,
          "species": "virginica"
        },
        {
          "sepalLength": 6.4,
          "sepalWidth": 3.1,
          "petalLength": 5.5,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6,
          "sepalWidth": 3,
          "petalLength": 4.8,
          "petalWidth": 1.8,
          "species": "virginica"
        },
        {
          "sepalLength": 6.9,
          "sepalWidth": 3.1,
          "petalLength": 5.4,
          "petalWidth": 2.1,
          "species": "virginica"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3.1,
          "petalLength": 5.6,
          "petalWidth": 2.4,
          "species": "virginica"
        },
        {
          "sepalLength": 6.9,
          "sepalWidth": 3.1,
          "petalLength": 5.1,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 5.8,
          "sepalWidth": 2.7,
          "petalLength": 5.1,
          "petalWidth": 1.9,
          "species": "virginica"
        },
        {
          "sepalLength": 6.8,
          "sepalWidth": 3.2,
          "petalLength": 5.9,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3.3,
          "petalLength": 5.7,
          "petalWidth": 2.5,
          "species": "virginica"
        },
        {
          "sepalLength": 6.7,
          "sepalWidth": 3,
          "petalLength": 5.2,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 6.3,
          "sepalWidth": 2.5,
          "petalLength": 5,
          "petalWidth": 1.9,
          "species": "virginica"
        },
        {
          "sepalLength": 6.5,
          "sepalWidth": 3,
          "petalLength": 5.2,
          "petalWidth": 2,
          "species": "virginica"
        },
        {
          "sepalLength": 6.2,
          "sepalWidth": 3.4,
          "petalLength": 5.4,
          "petalWidth": 2.3,
          "species": "virginica"
        },
        {
          "sepalLength": 5.9,
          "sepalWidth": 3,
          "petalLength": 5.1,
          "petalWidth": 1.8,
          "species": "virginica"
        }
      ],
      "name": "Iris"
    },
    {
      "values": [
        {
          "Country": "China",
          "Year": 1950,
          "Population (Thousands)": 562580
        },
        {
          "Country": "China",
          "Year": 1955,
          "Population (Thousands)": 607047
        },
        {
          "Country": "China",
          "Year": 1960,
          "Population (Thousands)": 651340
        },
        {
          "Country": "China",
          "Year": 1965,
          "Population (Thousands)": 731120
        },
        {
          "Country": "China",
          "Year": 1970,
          "Population (Thousands)": 822116
        },
        {
          "Country": "China",
          "Year": 1975,
          "Population (Thousands)": 920295
        },
        {
          "Country": "China",
          "Year": 1980,
          "Population (Thousands)": 987822
        },
        {
          "Country": "China",
          "Year": 1985,
          "Population (Thousands)": 1061876
        },
        {
          "Country": "China",
          "Year": 1990,
          "Population (Thousands)": 1153164
        },
        {
          "Country": "China",
          "Year": 1995,
          "Population (Thousands)": 1221056
        },
        {
          "Country": "China",
          "Year": 2000,
          "Population (Thousands)": 1268302
        },
        {
          "Country": "China",
          "Year": 2005,
          "Population (Thousands)": 1302285
        },
        {
          "Country": "China",
          "Year": 2010,
          "Population (Thousands)": 1336681
        },
        {
          "Country": "China",
          "Year": 2015,
          "Population (Thousands)": 1367486
        },
        {
          "Country": "India",
          "Year": 1950,
          "Population (Thousands)": 369881
        },
        {
          "Country": "India",
          "Year": 1955,
          "Population (Thousands)": 404268
        },
        {
          "Country": "India",
          "Year": 1960,
          "Population (Thousands)": 445394
        },
        {
          "Country": "India",
          "Year": 1965,
          "Population (Thousands)": 494964
        },
        {
          "Country": "India",
          "Year": 1970,
          "Population (Thousands)": 553889
        },
        {
          "Country": "India",
          "Year": 1975,
          "Population (Thousands)": 618923
        },
        {
          "Country": "India",
          "Year": 1980,
          "Population (Thousands)": 684888
        },
        {
          "Country": "India",
          "Year": 1985,
          "Population (Thousands)": 759613
        },
        {
          "Country": "India",
          "Year": 1990,
          "Population (Thousands)": 838159
        },
        {
          "Country": "India",
          "Year": 1995,
          "Population (Thousands)": 920585
        },
        {
          "Country": "India",
          "Year": 2000,
          "Population (Thousands)": 1006301
        },
        {
          "Country": "India",
          "Year": 2005,
          "Population (Thousands)": 1090974
        },
        {
          "Country": "India",
          "Year": 2010,
          "Population (Thousands)": 1173109
        },
        {
          "Country": "India",
          "Year": 2015,
          "Population (Thousands)": 1251696
        },
        {
          "Country": "US",
          "Year": 1950,
          "Population (Thousands)": 151869
        },
        {
          "Country": "US",
          "Year": 1955,
          "Population (Thousands)": 165070
        },
        {
          "Country": "US",
          "Year": 1960,
          "Population (Thousands)": 179980
        },
        {
          "Country": "US",
          "Year": 1965,
          "Population (Thousands)": 193527
        },
        {
          "Country": "US",
          "Year": 1970,
          "Population (Thousands)": 203985
        },
        {
          "Country": "US",
          "Year": 1975,
          "Population (Thousands)": 215466
        },
        {
          "Country": "US",
          "Year": 1980,
          "Population (Thousands)": 227225
        },
        {
          "Country": "US",
          "Year": 1985,
          "Population (Thousands)": 237924
        },
        {
          "Country": "US",
          "Year": 1990,
          "Population (Thousands)": 249623
        },
        {
          "Country": "US",
          "Year": 1995,
          "Population (Thousands)": 266279
        },
        {
          "Country": "US",
          "Year": 2000,
          "Population (Thousands)": 266279
        },
        {
          "Country": "US",
          "Year": 2005,
          "Population (Thousands)": 295517
        },
        {
          "Country": "US",
          "Year": 2010,
          "Population (Thousands)": 295517
        },
        {
          "Country": "US",
          "Year": 2015,
          "Population (Thousands)": 321369
        },
        {
          "Country": "Russia",
          "Year": 1950,
          "Population (Thousands)": 101937
        },
        {
          "Country": "Russia",
          "Year": 1955,
          "Population (Thousands)": 111126
        },
        {
          "Country": "Russia",
          "Year": 1960,
          "Population (Thousands)": 119632
        },
        {
          "Country": "Russia",
          "Year": 1965,
          "Population (Thousands)": 126542
        },
        {
          "Country": "Russia",
          "Year": 1970,
          "Population (Thousands)": 130246
        },
        {
          "Country": "Russia",
          "Year": 1975,
          "Population (Thousands)": 134294
        },
        {
          "Country": "Russia",
          "Year": 1980,
          "Population (Thousands)": 139039
        },
        {
          "Country": "Russia",
          "Year": 1985,
          "Population (Thousands)": 143938
        },
        {
          "Country": "Russia",
          "Year": 1990,
          "Population (Thousands)": 147973
        },
        {
          "Country": "Russia",
          "Year": 1995,
          "Population (Thousands)": 148759
        },
        {
          "Country": "Russia",
          "Year": 2000,
          "Population (Thousands)": 147054
        },
        {
          "Country": "Russia",
          "Year": 2005,
          "Population (Thousands)": 143320
        },
        {
          "Country": "Russia",
          "Year": 2010,
          "Population (Thousands)": 142527
        },
        {
          "Country": "Russia",
          "Year": 2015,
          "Population (Thousands)": 142424
        },
        {
          "Country": "Japan",
          "Year": 1950,
          "Population (Thousands)": 83806
        },
        {
          "Country": "Japan",
          "Year": 1955,
          "Population (Thousands)": 89816
        },
        {
          "Country": "Japan",
          "Year": 1960,
          "Population (Thousands)": 94092
        },
        {
          "Country": "Japan",
          "Year": 1965,
          "Population (Thousands)": 98883
        },
        {
          "Country": "Japan",
          "Year": 1970,
          "Population (Thousands)": 104345
        },
        {
          "Country": "Japan",
          "Year": 1975,
          "Population (Thousands)": 111574
        },
        {
          "Country": "Japan",
          "Year": 1980,
          "Population (Thousands)": 116808
        },
        {
          "Country": "Japan",
          "Year": 1985,
          "Population (Thousands)": 120755
        },
        {
          "Country": "Japan",
          "Year": 1990,
          "Population (Thousands)": 123538
        },
        {
          "Country": "Japan",
          "Year": 1995,
          "Population (Thousands)": 125328
        },
        {
          "Country": "Japan",
          "Year": 2000,
          "Population (Thousands)": 126776
        },
        {
          "Country": "Japan",
          "Year": 2005,
          "Population (Thousands)": 127716
        },
        {
          "Country": "Japan",
          "Year": 2010,
          "Population (Thousands)": 127580
        },
        {
          "Country": "Japan",
          "Year": 2015,
          "Population (Thousands)": 126920
        },
        {
          "Country": "Indonesia",
          "Year": 1950,
          "Population (Thousands)": 82979
        },
        {
          "Country": "Indonesia",
          "Year": 1955,
          "Population (Thousands)": 90255
        },
        {
          "Country": "Indonesia",
          "Year": 1960,
          "Population (Thousands)": 100146
        },
        {
          "Country": "Indonesia",
          "Year": 1965,
          "Population (Thousands)": 100146
        },
        {
          "Country": "Indonesia",
          "Year": 1970,
          "Population (Thousands)": 122292
        },
        {
          "Country": "Indonesia",
          "Year": 1975,
          "Population (Thousands)": 135214
        },
        {
          "Country": "Indonesia",
          "Year": 1980,
          "Population (Thousands)": 150322
        },
        {
          "Country": "Indonesia",
          "Year": 1985,
          "Population (Thousands)": 166070
        },
        {
          "Country": "Indonesia",
          "Year": 1990,
          "Population (Thousands)": 181600
        },
        {
          "Country": "Indonesia",
          "Year": 1995,
          "Population (Thousands)": 197604
        },
        {
          "Country": "Indonesia",
          "Year": 2000,
          "Population (Thousands)": 214091
        },
        {
          "Country": "Indonesia",
          "Year": 2005,
          "Population (Thousands)": 229245
        },
        {
          "Country": "Indonesia",
          "Year": 2010,
          "Population (Thousands)": 243423
        },
        {
          "Country": "Indonesia",
          "Year": 2015,
          "Population (Thousands)": 255994
        },
        {
          "Country": "Germany",
          "Year": 1950,
          "Population (Thousands)": 68375
        },
        {
          "Country": "Germany",
          "Year": 1955,
          "Population (Thousands)": 70196
        },
        {
          "Country": "Germany",
          "Year": 1960,
          "Population (Thousands)": 72481
        },
        {
          "Country": "Germany",
          "Year": 1965,
          "Population (Thousands)": 75639
        },
        {
          "Country": "Germany",
          "Year": 1970,
          "Population (Thousands)": 77784
        },
        {
          "Country": "Germany",
          "Year": 1975,
          "Population (Thousands)": 78683
        },
        {
          "Country": "Germany",
          "Year": 1980,
          "Population (Thousands)": 78298
        },
        {
          "Country": "Germany",
          "Year": 1985,
          "Population (Thousands)": 77685
        },
        {
          "Country": "Germany",
          "Year": 1990,
          "Population (Thousands)": 79381
        },
        {
          "Country": "Germany",
          "Year": 1995,
          "Population (Thousands)": 81654
        },
        {
          "Country": "Germany",
          "Year": 2000,
          "Population (Thousands)": 82184
        },
        {
          "Country": "Germany",
          "Year": 2005,
          "Population (Thousands)": 82440
        },
        {
          "Country": "Germany",
          "Year": 2010,
          "Population (Thousands)": 81645
        },
        {
          "Country": "Germany",
          "Year": 2015,
          "Population (Thousands)": 80855
        },
        {
          "Country": "Brazil",
          "Year": 1950,
          "Population (Thousands)": 53444
        },
        {
          "Country": "Brazil",
          "Year": 1955,
          "Population (Thousands)": 61652
        },
        {
          "Country": "Brazil",
          "Year": 1960,
          "Population (Thousands)": 71412
        },
        {
          "Country": "Brazil",
          "Year": 1965,
          "Population (Thousands)": 82602
        },
        {
          "Country": "Brazil",
          "Year": 1970,
          "Population (Thousands)": 94931
        },
        {
          "Country": "Brazil",
          "Year": 1975,
          "Population (Thousands)": 107328
        },
        {
          "Country": "Brazil",
          "Year": 1980,
          "Population (Thousands)": 121064
        },
        {
          "Country": "Brazil",
          "Year": 1985,
          "Population (Thousands)": 135734
        },
        {
          "Country": "Brazil",
          "Year": 1990,
          "Population (Thousands)": 149410
        },
        {
          "Country": "Brazil",
          "Year": 1995,
          "Population (Thousands)": 161912
        },
        {
          "Country": "Brazil",
          "Year": 2000,
          "Population (Thousands)": 174316
        },
        {
          "Country": "Brazil",
          "Year": 2005,
          "Population (Thousands)": 186021
        },
        {
          "Country": "Brazil",
          "Year": 2010,
          "Population (Thousands)": 195835
        },
        {
          "Country": "Brazil",
          "Year": 2015,
          "Population (Thousands)": 204260
        },
        {
          "Country": "UK",
          "Year": 1950,
          "Population (Thousands)": 50128
        },
        {
          "Country": "UK",
          "Year": 1955,
          "Population (Thousands)": 50947
        },
        {
          "Country": "UK",
          "Year": 1960,
          "Population (Thousands)": 52373
        },
        {
          "Country": "UK",
          "Year": 1965,
          "Population (Thousands)": 54351
        },
        {
          "Country": "UK",
          "Year": 1970,
          "Population (Thousands)": 55633
        },
        {
          "Country": "UK",
          "Year": 1975,
          "Population (Thousands)": 56216
        },
        {
          "Country": "UK",
          "Year": 1980,
          "Population (Thousands)": 56315
        },
        {
          "Country": "UK",
          "Year": 1985,
          "Population (Thousands)": 56585
        },
        {
          "Country": "UK",
          "Year": 1990,
          "Population (Thousands)": 57411
        },
        {
          "Country": "UK",
          "Year": 1995,
          "Population (Thousands)": 58187
        },
        {
          "Country": "UK",
          "Year": 2000,
          "Population (Thousands)": 59140
        },
        {
          "Country": "UK",
          "Year": 2005,
          "Population (Thousands)": 60488
        },
        {
          "Country": "UK",
          "Year": 2010,
          "Population (Thousands)": 62349
        },
        {
          "Country": "UK",
          "Year": 2015,
          "Population (Thousands)": 64089
        },
        {
          "Country": "Italy",
          "Year": 1950,
          "Population (Thousands)": 47106
        },
        {
          "Country": "Italy",
          "Year": 1955,
          "Population (Thousands)": 48634
        },
        {
          "Country": "Italy",
          "Year": 1960,
          "Population (Thousands)": 50198
        },
        {
          "Country": "Italy",
          "Year": 1965,
          "Population (Thousands)": 51988
        },
        {
          "Country": "Italy",
          "Year": 1970,
          "Population (Thousands)": 53662
        },
        {
          "Country": "Italy",
          "Year": 1975,
          "Population (Thousands)": 55572
        },
        {
          "Country": "Italy",
          "Year": 1980,
          "Population (Thousands)": 56452
        },
        {
          "Country": "Italy",
          "Year": 1985,
          "Population (Thousands)": 56719
        },
        {
          "Country": "Italy",
          "Year": 1990,
          "Population (Thousands)": 56714
        },
        {
          "Country": "Italy",
          "Year": 1995,
          "Population (Thousands)": 57295
        },
        {
          "Country": "Italy",
          "Year": 2000,
          "Population (Thousands)": 57785
        },
        {
          "Country": "Italy",
          "Year": 2005,
          "Population (Thousands)": 59038
        },
        {
          "Country": "Italy",
          "Year": 2010,
          "Population (Thousands)": 60749
        },
        {
          "Country": "Italy",
          "Year": 2015,
          "Population (Thousands)": 61856
        }
      ],
      "name": "Populations"
    }
  ],
  "workspaces": [
    {
      "title": "workspace_0",
      "data": "Iris",
      "views": [
        {
          "title": "The Iris Flower Dataset",
          "mark": "point",
          "encoding": {
            "x": {
              "field": "petalWidth",
              "type": "quantitative"
            },
            "y": {
              "field": "petalLength",
              "type": "quantitative"
            }
          }
        }
      ]
    }
  ]
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


  const config = ConfigGen({
    datasets: [
      {values: iris, name: 'Iris'}, 
      {values: populations, name: 'Populations'}
    ], 
    matchedSpells: state.matchedSpells, 
    workspaces:  [...new Set(state.matchedSpells.map((spell: any) => spell.workspace))]
  });

  const spellbookBlocks = ConfigStepTrace({matchedSpells: state.matchedSpells});


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
    console.log("SPELLBOOK_PAGES", spellbookBlocks);
    //test dispatch--works! don't want to do it this way though bc it will probably eventually exceed call stack 
    //dispatch({type: 'WORKVIEW_CONTEXT', payload: {workspace: 'workspace_1', view: 'view_1'}})
    //console.log("STATE", state);

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
              <SpellPages spells={spellbookBlocks} />
              <MageHand grimoire={[...primitives, ...grimoire]} context={state.workview.workspace}/>

              <OrbitControls />
              <ambientLight />
              <pointLight position={[1, 1, 1]} />
              <color args={["black"]} attach="background" />
              {Object.keys(config).includes('workspaces') ? (
                <OptomancyR3F config = {config}/>
              ) : null
              }
            </VRCanvas>
            </div>
          ) : (
            <div className="DemoMain">
            <Dictaphone grimoire={[...primitives, ...grimoire]}/>
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
