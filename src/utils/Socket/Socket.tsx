import io from 'socket.io-client';
const protocol = window.location.protocol;

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
//console.log(protocol+'//'+endpoint)
//const socket = io(`http://${host}:8080`, { query: { view, room }});
// use port for testing
/// this is what we were using before 
/*const socket = io(`https://optomancy.com`,  {
  query: { view, room },
  path: '/ws/'  
});*/
const socket = io(`https://optomancy.io`,  {
  query: { view, room }
});
//console.log(endpoint)
//const socket = io(`https://${endpoint}`, { query: { view, room }});

//const socket = io(`${protocol}//${endpoint}` , { query: { view, room }});
//const socket = io('/' , {path: '/ws', query: { view, room }});
//const socket = io('http://172.25.133.24:3454' , { query: { view, room }});

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
//const socket = io({ path: '/socket-io', query: { view, room }});

//const socket = io('http://localhost:8080')
export default socket;
