import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {socket} from '../../utils/Socket';
const levenshtein = require('js-levenshtein');

const Dictaphone = (props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition or WebXR. Please use a HoloLens/HL2 for WebXR view, or use a browser that supports the Web Speech API for speech recognition.</span>;
  }


  const listenContinuously = () => SpeechRecognition.startListening({
    continuous: true, 
    language: "en-US"
  })

  const endListenerCraft = () => {
    //client.send(transcript)
    socket.emit('spellcast', JSON.stringify({'gesture': [], 'words': transcript}));
    // replace this with socketio listener
    SpeechRecognition.stopListening();
  }

  const endListenerCast = () => {
    //client.send(transcript)
    let minDist = 1000;
    let matchedSpell = {};
    for(let spell of props.grimoire){
      let dist = levenshtein(transcript, spell.words)
      if(dist < minDist){
        matchedSpell = structuredClone(spell);
        minDist = 1*dist;
      }
    }
    socket.emit('spellmatched', JSON.stringify(matchedSpell.key));
    // replace this with socketio listener
    SpeechRecognition.stopListening();
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={listenContinuously}>Start Recording</button>
      <button onClick={endListenerCraft}>Use Rec. to Craft</button>
      <button onClick={endListenerCast}>Use Rec. to Cast</button>
      <button onClick={resetTranscript}>Reset Transcript</button>
      <p>{transcript}</p>      
    </div>
  );

};
export { Dictaphone };