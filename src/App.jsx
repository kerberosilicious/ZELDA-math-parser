import { useState } from 'react'
import { motion } from "framer-motion";
import './App.css'

function App() {
  const [name, setName] = useState("Link");

  return (
    <div className="App">

      <motion.div
        className="NamePrompt"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <h1>What's your name?</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </motion.div>

    </div>
  )
}

export default App
