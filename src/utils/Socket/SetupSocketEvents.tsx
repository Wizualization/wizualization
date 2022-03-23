// setupSocketEvents.ts

import { socket } from './';
import { eventTypes } from './';

function setupSocketEvents(dispatch: any) {
  // eventTypes must map to actionTypes
  for (const event in eventTypes) {
    socket.on(event, (payload: any) => dispatch({ type: event, payload }));
  }

  socket.on('yes-room', (arg: any) => {
    console.log(arg);
    console.log('yes-room');
  });

}

export default setupSocketEvents;