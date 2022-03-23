// ioConnected.ts
import { State } from '../Types';

const ioConnected = (state: State) => {
  console.log('action.ioConnected: Connected to socket server');
  return state;
};

export default ioConnected;