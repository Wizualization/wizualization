// types/index.ts
import ioConnected from './ioConnected';
import { spellUpdate, spellMatched, switchContext } from './WorkspaceUpdate';

export { default as actionTypes } from './ActionTypes';

const actions = {
  // Socket.io events
  ioConnected, // IO_CONNECTED
  spellUpdate, // SPELL_UPDATE
  spellMatched,// SPELL_MATCHED
  switchContext,// SWITCH_CONTEXT

};

export default actions;