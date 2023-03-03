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

// async function sendAudioToWhisper(audioBlob) {

//   const file = new File([audioBlob], 'recording.mp3', { type: 'audio/mpeg' }); // create new File object

//   console.log(file);

//   const formData = new FormData();
//   formData.append('file', URL.createObjectURL(file));
//   formData.append('model', 'whisper-1');

//   console.log(URL.createObjectURL(file));

//   fetch('https://api.openai.com/v1/audio/transcriptions', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'Bearer ' + configuration.apiKey,
//     },
//     body: formData
//   })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

//   // const resp = await openai.createTranscription(
//   //   file, "whisper-1"
//   // );

//   // console.log(resp);

// }

function App() {
  //USER VARIABLES
  const [name, setName] = useState("Ghegi"); // name of the user
  //INTERFACE VARIABLES
  const [transcription, setTranscription] = useState(""); // transcription of the user's voice
  // //RECORDER VARIABLES
  // const [audioStream, setAudioStream] = useState(null);
  // const [recorder, setRecorder] = useState(null);
  // const [isRecording, setIsRecording] = useState(false);
  // const [audioObject, setAudioObject] = useState(null);

  // const handleStartRecording = () => {
  //   navigator.mediaDevices.getUserMedia({ audio: true })
  //     .then(stream => {
  //       setAudioStream(stream);
  //       const mediaRecorder = new MediaRecorder(stream);
  //       setRecorder(mediaRecorder);

  //       mediaRecorder.start();
  //       setIsRecording(true);

  //       const chunks = [];
  //       mediaRecorder.addEventListener("dataavailable", event => {
  //         chunks.push(event.data);
  //       });

  //       mediaRecorder.addEventListener("stop", () => {
  //         const blob = new Blob(chunks, { type: "audio/mpeg" });
  //         sendAudioToWhisper(blob);
  //         const file = new File([blob], 'recording.mp3', { type: 'audio/mpeg' });
  //         setAudioObject(URL.createObjectURL(file));
  //       });


  //     });
  // };

  // const handleStopRecording = () => {
  //   recorder.stop();
  //   setIsRecording(false);
  //   setAudioStream(null);
  // };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">

      {/* <motion.div
        className="NamePrompt"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <h1>What's your name?</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </motion.div> */}

      

    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  

    </div>
  )
}

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}

export default App
