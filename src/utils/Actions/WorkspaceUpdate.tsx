// ioConnected.ts
import { Action, State } from '../Types';

const spellUpdate = (state: State, action: Action) => {
  console.log(state)
  console.log(action)
  console.log('action.spellUpdate: Updated spell in VSCode');
  return JSON.parse(action.payload);
  /*{
    ...state, 
    spells: {
      ...state.spells,
      [action.payload.spellname]: JSON.parse(action.payload)
    }
  };*/
};

export default spellUpdate;