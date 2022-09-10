// ioConnected.ts
import { Action, State } from '../Types';

const spellUpdate = (state: State, action: Action) => {
  console.log(state)
  console.log(action)
  console.log('action.spellUpdate: Updated spell in VSCode');
  return {
    ...JSON.parse(action.payload), 
    matchedSpells: state.matchedSpells,
    workview: state.workview
  };
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
    matchedSpells:[...state.matchedSpells, action.payload],
    workview: state.workview
  };
};

const switchContext = (state: State, action: Action) => {
  console.log(state)
  console.log(action)
  console.log('action.switchContext: The user has switched to a new context or workspace');
  //return JSON.parse(action.payload);
  return {
    spells: {
      ...state.spells
    },
    matchedSpells: state.matchedSpells,
    workview: action.payload
  };
};

export { spellUpdate, spellMatched, switchContext };