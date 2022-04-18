// ioConnected.ts
import { Action, State } from '../Types';

const spellUpdate = (state: State, action: Action) => {
  console.log(state)
  console.log(action)
  console.log('action.spellUpdate: Updated spell in VSCode');
  return {...JSON.parse(action.payload), matchedSpells: state.matchedSpells};
  /*{
    ...state, 
    spells: {
      ...state.spells,
      [action.payload.spellname]: JSON.parse(action.payload)
    }
  };*/
};

const spellMatched = (state: State, action: Action) => {
  console.log(state)
  console.log(action)
  console.log('action.spellMatched: A spell has been cast and identified');
  //return JSON.parse(action.payload);
  return {
    spells: {
      ...state.spells
    },
    matchedSpells:[...state.matchedSpells, action.payload]
  };
};


export { spellUpdate, spellMatched };