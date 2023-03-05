import { useState, useEffect, useRef } from 'react'
import { motion } from "framer-motion";
import './App.css';

import 'regenerator-runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Polly from './tools/Polly';

// ? ICON IMPORTS * //
import { FaMicrophone, FaStop, FaCalculator, FaComment } from 'react-icons/fa';

// ? Module Imports * //
import 'axios';
import {v4 as uuid} from 'uuid'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

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
  const [answer, setAnswer] = useState(null);
  const [answerTitle, setAnswerTitle] = useState(null);
  const [solutionText, setSolutionText] = useState(null);
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
      setGeneratingResponse(true);
      // addToConversation("Zelda", "Hello, I'm Zelda. What can I do for you today?");
      // zeldaTalk("Hello, I'm Zelda. What can I do for you today?");
      getZeldaResponse("You've just booted. Make a short greeting to the user (me).");
    }
  }

    if (isInitialized && !listening) {
      // Call your function here
      console.log("stopping speech");
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

          console.log(response);
  
          setCurrentResponse(response.response);
          zeldaTalk(response.response);
          addToConversation("Zelda", response.response);
          setGeneratingResponse(false);
  
          setPromptMemory(promptMemory + "\nHuman: " + prompt + "\nZelda:" + JSON.stringify(response));
        
          if(response.latex !== undefined) {
            setAnswer(response.latex);
          }

          if(response.title !== undefined) {
            setAnswerTitle(response.title);
          }
        
          if(response.solution !== undefined) {
            setSolutionText(response.solution);
          }

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
    SpeechRecognition.startListening({ continuous: true });
    console.log("listening...");
  }

  const stopSpeech = async() => {
    // stop recording the user's speech
    if(!generatingResponse)
    {
      SpeechRecognition.stopListening();
      setZeldaState(1);
      let message = transcript;
      if(transcript === "") {
        message = "...";
      }
      addToConversation("User", message);
      setGeneratingResponse(true);
      getZeldaResponse(message);
    }
  }

  const saveAnswer = () => {
    // save the answer to the database
    setAnswer(null);
  }

  const respond = () => {
    saveAnswer();
    recordSpeech();
  }

  const explain = () => {
    saveAnswer();
    setZeldaState(1);
    addToConversation("User", "Can you explain?");
    setGeneratingResponse(true);
    getZeldaResponse("Can you explain?");
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

      {/* <motion.div
        className="NamePrompt"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <h1>What's your name?</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </motion.div> */}


      <motion.div 
        className="ZeldaContainer"
        animate={
          {
            x: answer !== null ? -50 : 0,
            scale: answer !== null ? 0.8 : 1,
          }
        }
        >
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
      </motion.div>

      <motion.div className = "DialogContainer"
        animate = {
          {
            x: answer === null ? 0 : 700,
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
            x: answer === null ? 700 : 0,
            scale: 0.95,
          }
        }>
        <div className="Solution">
          <motion.div
            className="SolutionHeader"
            animate={
              {
                x: answer === null ? 50 : 0,
                opacity: answer === null ? 0 : 1,
              }
            }
            transition={{ delay: 0.5, duration: 0.5 }}
            >
            <FaCalculator color='#00eeff'/>{answerTitle === null ? "" : <p style={{marginLeft:'1rem'}}>{answerTitle}</p>}
          </motion.div>

          <div className="SolutionDescription">
            
            <motion.p
            className="Problem"
            animate={
              {
                x: answer === null ? 100 : 0,
                opacity: answer === null ? 0 : 1,
              }
            }
            transition={{ delay: 0.75, duration: 0.5 }}
            >
              <b>Problem:</b> {transcript}
            </motion.p>

            <motion.p
            className="Answer"
            animate={
              {
                x: answer === null ? 150 : 0,
                opacity: answer === null ? 0 : 1,
              }
            }
            transition={{ delay: 1, duration: 0.5 }}
            >
              <b>Solution:</b> {solutionText === null ? "" : solutionText}
            </motion.p>

          </div>
          <motion.div
          className="LatexContainer"
          animate={
            {
              scale: answer === null ? 0 : 1,
            }
          }
          transition={{ delay: 1.5 }}
          >
            {answer === null ? "" : <Latex>{answer}</Latex>}
          </motion.div>

          <div className="SolutionButtons">
            <motion.button
              className="ExplainButton"
              style = {
                {
                  background: "linear-gradient(90deg, #FF33B8 0%, #FD778C 100%)",
                  boxShadow: "0 0 0.5rem #FF33B8",
                }
              }
              animate = {
                {
                  
                  y: answer === null ? 50 : 0,
                  opacity: answer === null ? 0 : 1,

                }
              }
              transition={{ delay: 1.8, duration: 0.5 }}
              whileTap={{scale: 0.9}}
              onClick={() => {
                explain();
                }
              }
              >
              <FaComment /><p style={{marginLeft: '1rem'}}>Explain</p>
            </motion.button>
            <motion.button
              className="RespondButton"
              style = {
                {
                  background: "linear-gradient(90deg, #704CFE 0%, #9074FE 100%)",
                  boxShadow: "0 0 0.5rem #9074FE",
                }
              }
              animate = {
                {
                  
                  y: answer === null ? 50 : 0,
                  opacity: answer === null ? 0 : 1,
                }
              }
              transition={{ delay: 2, duration: 0.5 }}
              whileTap={{scale: 0.9}}
              onClick={() => {
                respond();
                }
              }
              >
              <FaMicrophone /><p style={{marginLeft: '1rem'}}>Respond</p>
            </motion.button>
          </div>
          
        </div>
      </motion.div>

    </div>
  )
}

export default App



////ghfgfhjhgdrhfgfhjkgrfgdghfhjkdfghdfghghjffghjghjf