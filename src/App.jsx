import { useState, useEffect, useRef } from 'react'
import { motion } from "framer-motion";
import './App.css';

import 'regenerator-runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Polly from './tools/Polly';

// ? ICON IMPORTS * //
import { FaMicrophone, FaStop } from 'react-icons/fa';

// ? Module Imports * //
import 'axios';
import {v4 as uuid} from 'uuid'

// ? Prompt * //

import corePrompt from './CorePrompt';

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [zeldaState, setZeldaState] = useState(0);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  //PROMPT VARIABLES
  const [promptMemory, setPromptMemory] = useState(``);
  const [currentResponse, setCurrentResponse] = useState('');
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

  // * First time Launch * //

  const isFirstMount = useRef(true);

  useEffect(() => {
     
    if (isFirstMount.current) {
    isFirstMount.current = false;
    if(isFirstTime) {
      setIsFirstTime(false);
      addToConversation("Zelda", "Hello, I'm Zelda. What can I do for you today?");
      zeldaTalk("Hello, I'm Zelda. What can I do for you today?");
    }
  }

    if (isInitialized && !listening) {
      // Call your function here
      stopSpeech();
      setIsInitialized(false);
    }
  }, [listening, isFirstTime]);

  // **************** //
  // *FUNCTIONS BLOCK //
  // **************** //

  const getZeldaResponse = async(prompt) => {

    await openai.createCompletion({
      model: "text-davinci-003",
      max_tokens: 1000,
      prompt: corePrompt + promptMemory + "\nHuman: " + prompt + "\nZelda:",
      })
      .then((data) => {
        try {
          const response = JSON.parse(data.data.choices[0].text);
  
          setCurrentResponse(response.response);
          zeldaTalk(response.response);
          addToConversation("Zelda", response.response);
          setGeneratingResponse(false);
  
          setPromptMemory(promptMemory + "\nHuman: " + prompt + "\nZelda:" + JSON.stringify(response));
        } catch (error) {
            console.log(error);
            addToConversation(prompt, "I'm sorry, I didn't understand that. Can you try again?");
            setCurrentResponse("I'm sorry, I didn't understand that. Can you try again?");
            zeldaTalk("I'm sorry, I didn't understand that. Can you try again?");
            setGeneratingResponse(false);
          }
      });
    
    }

  const zeldaTalk = (zeldaText) => {
    // add Zelda to conversation
    // speak the text
    setZeldaState(2);
    Polly(zeldaText, () => {setZeldaState(0)});
  }


  const addToConversation = (speaker, text) => {
    // add Zelda to conversation
    const dialog = {
      id: uuid(),
      speaker: speaker,
      text: text
    }
    setConversation(prevConversation => [...prevConversation, dialog]);

    //if conversation is more than 4, remove the first one
    if (conversation.length > 7) {
      setConversation(prevConversation => prevConversation.slice(1));
    }
  }

  const recordSpeech = () => {
    // record the user's speech
    setIsInitialized(true);
    setZeldaState(3);
    SpeechRecognition.startListening();
  }

  const stopSpeech = async() => {
    // stop recording the user's speech
    SpeechRecognition.stopListening();
    setZeldaState(1);
    addToConversation("User", transcript);
    setGeneratingResponse(true);
    getZeldaResponse(transcript);
  }


 


  // **************** //
  // *RENDER FUNCTION //
  // **************** //

  return (

    <div className="App">
      
      <div className="Background">
      </div>

      <div className="TopShadow">
      </div>

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
            src={(() => {
              switch(zeldaState) {
                case 0: return Math.random() < 0.5 ? "./src/assets/img/idle_loop.gif" : "./src/assets/img/idle_loop2.gif";
                case 1: return "./src/assets/img/thinking_loop.gif";
 
                break;
                case 2: return "./src/assets/img/talking_loop.gif";
                case 3: return "./src/assets/img/listen_loop.gif";
                default: return "./src/assets/img/idle_loop.gif";
              }
              })()}
            initial={{ scale: 0 }}
            animate={{ scale: 1}}
            />
        </motion.div>
      </div>

      <motion.div className = "DialogContainer"
        animate = {
          {
            x: 0,
          }
        }>

        <div className="Dialogs">
          {
            // userConversation.map((userText, index) => {
            //   return (
            //     <div>
            //       <div className="UserDialog" key={`user-${index}`}>
            //         {userText}
            //       </div>
            //       <div className="ZeldaDialog" key={`zelda-${index}`}>
            //         {zeldaConversation[index]}
            //       </div>
            //     </div>
            //   )
            // }
            // )
            conversation.map((text) => {
              return (
                <motion.div
                  className={text.speaker === "User" ? "UserDialog" : "ZeldaDialog"}
                  key={`${text.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0}}
                  >
                  {text.text}
                </motion.div>
              )
            })
          }
          <motion.div
            className="ResponseAnimationContainer"
            animate={
              {
                scale: generatingResponse ? 1 : 0,
              }
            }>
            <img
              className="ResponseAnimation"
              src="./src/assets/img/response-generating.gif"
            />
          </motion.div>
        </div>

        {/* User Record Button */}
        <div className="RecordButtonContainer">

          <motion.div
            className="Transcript"
            animate={
              {
                width: listening ? "100%" : "0%",
              }
            }
          >
            <motion.img 
              src="./src/assets/img/recordingAnim.gif" 
              animate={
                {
                  scale: listening ? 1 : 0,
                }
              }
              transition={{ delay: 0.5 }}
            />
              {listening ? transcript : ""}
          </motion.div>

          <motion.button

            className="RecordButton"

            animate = {
              {
                background: 
                listening 
                ? "linear-gradient(90deg, #FF33B8 0%, #FD778C 100%)"
                : "linear-gradient(90deg, #704CFE 0%, #9074FE 100%)"
                ,
                boxShadow:
                listening
                ? "0 0 1.5rem #FD778C"
                : "0 0 0.5rem #9074FE"
              }
            }

            whileTap={{ scale: 0.9, rotate: 360}}
            onClick={() => {
              if (!listening) {
                recordSpeech();
              } else
              {
                stopSpeech();
              }
            }}

          >
            {listening ? <FaStop /> : <FaMicrophone />}
          </motion.button>

        </div>

      </motion.div>

      <motion.div className="SolutionContainer"
        animate = {
          {
            x: 700,
          }
        }>
        <h1>Solution</h1>
      </motion.div>

    </div>
  )
}

export default App
