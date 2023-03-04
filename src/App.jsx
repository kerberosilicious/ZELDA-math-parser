import { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import './App.css';

import 'regenerator-runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

// * Module Imports * //
import 'axios';
import stream from 'stream-browserify';

// * OpenAI configurations * //

require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


function App() {
  //USER VARIABLES
  const [name, setName] = useState("Ghegi"); // name of the user
  //INTERFACE VARIABLES
  const [transcription, setTranscription] = useState(""); // transcription of the user's voice
  
  // SPEECH RECOGNITION VARIABLES
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // **************** //
  // *RENDER FUNCTION //
  // **************** //

  return (
    <div className="App">

      

      <div className="MicrophoneContainer">
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button onClick={SpeechRecognition.startListening}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>

      {/* <motion.div
        className="NamePrompt"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <h1>What's your name?</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </motion.div> */}

      <div className = "Conversations">
        asdasdasd
      </div>

      <div className="ZeldaContainer">
        <motion.img 
          className="Zelda"
          src="./src/assets/img/idle_loop.gif"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          />
      </div>

      <div className = "Conversations">
        asdasdasdasdfasdfasdfasdfasdf
      </div>
  

    </div>
  )
}

export default App
