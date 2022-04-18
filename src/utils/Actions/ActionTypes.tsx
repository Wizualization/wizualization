// actionTypes.ts
enum ActionTypes {
    // Socket.io actions
    IO_CONNECTED = 'IO_CONNECTED', // A socket.io connection is established
    SPELL_UPDATE = 'SPELL_UPDATE', // Workspace is updated in VSCode
    SPELL_MATCHED = 'SPELL_MATCHED' // Spell is matched 
  }
  
  export default ActionTypes;