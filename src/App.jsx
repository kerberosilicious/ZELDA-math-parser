import { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import './App.css';

import 'regenerator-runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Polly from './tools/polly';

// ? ICON IMPORTS * //
import { FaMicrophone, FaStop } from 'react-icons/fa';

// ? Module Imports * //
import 'axios';
import stream from 'stream-browserify';

// ? OpenAI configurations * //

require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function App() {
  //USER VARIABLES
  const [name, setName] = useState(""); // name of the user
  //INTERFACE VARIABLES
  const [conversation, setConversation] = useState([]); // conversation between the user and zelda
  const [isFirstTime, setIsFirstTime] = useState(true); // is it the first time the user is using the app?
  const [isRecording, setIsRecording] = useState(false);
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
  // *FUNCTIONS BLOCK //
  // **************** //

  const getZeldaResponse = async(prompt) => {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Hello world"}],
    });
    return completion.data.choices[0].message.content;
  }

  const zeldaTalk = (zeldaText) => {
    // add Zelda to conversation
    setConversation([...conversation, {name: "Zelda", text: zeldaText}]);
    // speak the text
    Polly(zeldaText, () => {console.log("Zelda finished speaking")});
  }

  const userTalk = (userText) => {
    // add user to conversation
    setConversation([...conversation, {name: "User", text: userText}]);
  }

  const recordSpeech = () => {
    // record the user's speech
    SpeechRecognition.startListening();
  }

  const stopSpeech = () => {
    // stop recording the user's speech
    SpeechRecognition.stopListening();
    userTalk("hello");
    zeldaTalk("hi");
  }


  // * First time Launch * //

  if (isFirstTime) {
    zeldaTalk("Hello, I'm Zelda. What can I do for you today?");
    setIsFirstTime(false);
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


      <div className="ZeldaContainer">
        <motion.div
          className="Zelda"
          >
          <motion.img
            className="ZeldaImage"
            src="./src/assets/img/idle_loop.gif"
            initial={{ scale: 0 }}
            animate={{ scale: 1}}
            />
        </motion.div>
      </div>

      <div className = "DialogContainer">

        <div className="Dialogs">
          {
            conversation.map((item, index) => {
              return (
                  <div className = "Dialog" key = {index}>
                    <div className = {item.name == "Zelda" ? "dialogZelda" : "dialogUser"}>
                      {item.text}
                    </div>
                  </div>
                )
              }
            )
          }
        </div>

        {/* User Record Button */}
        <div className="RecordButtonContainer">
          <motion.div
            className="Transcript"
            animate={
              {
                width: isRecording ? "100%" : "0%",
              }
            }
          >
            {isRecording ? transcript : ""}
          </motion.div>
          <motion.button

            className="RecordButton"

            animate = {
              {
                background: 
                isRecording 
                ? "linear-gradient(90deg, #FF33B8 0%, #FD778C 100%)"
                : "linear-gradient(90deg, #704CFE 0%, #9074FE 100%)"
                ,
                boxShadow:
                isRecording
                ? "0 0 1.5rem #FD778C"
                : "0 0 0.5rem #9074FE"
              }
            }

            whileTap={{ scale: 0.9, rotate: 360}}
            onClick={() => {
              if (!isRecording) {
                setIsRecording(true);
                recordSpeech();
              } else
              {
                setIsRecording(false);
                stopSpeech();
              }
            }}

          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </motion.button>

        </div>

      </div>
  

    </div>
  )
}

export default App
