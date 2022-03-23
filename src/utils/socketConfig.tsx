/*
import { w3cwebsocket as WebSocketClient } from "websocket";
//import { client as WebSocketClient } from "websocket";
const host = window.location.hostname;
//const host = '94.9.121.39';
//const host = 'api.simbroadcasts.tv'

//check if port 
const port = window.location.port;
//let port = "3000";

console.log(process.env.NODE_ENV)

const view = window.location.pathname;
const room = new URLSearchParams(window.location.search).get('room') ||'default';
const endpoint = port === "" ? `${host}/ws` : `${host}:${port}/ws`

//let SOCKET_ADDRESS = 'wss://optomancy.com/ws'
let SOCKET_ADDRESS = 'wss://'+endpoint;
const socket = new WebSocketClient(SOCKET_ADDRESS, 'echo-protocol');

//const socket = new WebSocketClient();

//socket.connect('wss://127.0.0.1:8000', 'echo-protocol');
*/
const socket = {}
export default socket;

/*
import openSocket from 'socket.io-client';

const socket = openSocket("ws://127.0.0.1:8000");

export default socket;
*/