// types/index.ts
import ioConnected from './ioConnected';
import { spellUpdate, spellMatched, spellUncast, switchContext } from './WorkspaceUpdate';

export { default as actionTypes } from './ActionTypes';

const actions = {
  // Socket.io events
  ioConnected, // IO_CONNECTED
  spellUpdate, // SPELL_UPDATE
  spellMatched,// SPELL_MATCHED
  spellUncast, // SPELL_UPDATE
  switchContext,// SWITCH_CONTEXT

};

export default actions;