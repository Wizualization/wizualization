// reducer.ts
import { State, Action } from '../Types';
import actions, { actionTypes } from '../Actions';

const reducer = (state: State, action: Action) => {
  console.log(action.type);

  switch (action.type) {
    // ** Socket.io actions **
    case actionTypes.IO_CONNECTED:
      return actions.ioConnected(state);

    case actionTypes.SPELL_UPDATE:
      return actions.spellUpdate(state, action);
      // case socketEventTypes.IO_CONNECT_ERROR:
    //   return actions.ioConnectError(state);
    // case socketEventTypes.IO_CLOSE:
    //   return actions.ioClosed(state);
    default:
      console.error(`Unknown action type: ${action.type}`);
      throw new Error();
  }
};

export default reducer;