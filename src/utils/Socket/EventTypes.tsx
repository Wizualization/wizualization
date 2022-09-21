enum EventTypes {
    // Socket.io events
    IO_CONNECTED = 'IO_CONNECTED', // A socket.io connection is established
    SPELL_UPDATE = 'SPELL_UPDATE', // an update from the VSCode spell
    SPELL_UNCAST = 'SPELL_UNCAST', // an update from the VSCode spell
    SPELL_MATCHED = 'SPELL_MATCHED' // a matched spell 
  }
  
  export default EventTypes;