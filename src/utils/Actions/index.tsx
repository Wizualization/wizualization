// types/index.ts
import ioConnected from './ioConnected';
import spellUpdate from './WorkspaceUpdate';

export { default as actionTypes } from './ActionTypes';

const actions = {
  // Socket.io events
  ioConnected, // IO_CONNECTED
  spellUpdate, // SPELL_UPDATE
};

export default actions;