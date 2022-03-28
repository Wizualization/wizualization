import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
//import * as SpeechRecognitionDefault from 'react-speech-recognition';
//import { useSpeechRecognition } from 'react-speech-recognition';
import {socket} from '../../utils/Socket';
//import client from '../../utils/socketConfig';

//const SpeechRecognition = SpeechRecognitionDefault.default;
//const useSpeechRecognition = SpeechRecognitionDefault.useSpeechRecognition;

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }


  const listenContinuously = () => SpeechRecognition.startListening({
    continuous: true, 
    language: "en-US"
  })

  const endListener = () => {
    //client.send(transcript)
    socket.emit('spellcast', JSON.stringify({'gesture': [], 'words': transcript}));
    // replace this with socketio listener
    SpeechRecognition.stopListening();
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={listenContinuously}>Start</button>
      <button onClick={endListener}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>      
    </div>
  );


/*
//let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
//let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
let SpeechRecognition = new window.webkitSpeechRecognition()
let Grammar = new window.webkitSpeechGrammarList();

SpeechRecognition.grammars = Grammar;

console.log(SpeechRecognition)
SpeechRecognition.onresult = function(event) {
  console.log('click')
  for(var word in event.results[0].transcript){
    console.log('Word: ' + word);
  }
}
SpeechRecognition.onerror = function(error){
  console.log(error)
}

SpeechRecognition.onstart = function(){
  console.log('starting')
}

return (
  <div>
    <button onClick={SpeechRecognition.start}>Start</button>
    <button onClick={SpeechRecognition.stop}>Stop</button>
  </div>
);*/
};
export { Dictaphone };