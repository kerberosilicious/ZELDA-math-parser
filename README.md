# Zelda: A GPT-3 Powered Natural Language Mathematical Expression Parser

Zelda is a natural language mathematical expression parser powered by OpenAI's GPT-3 language model. It is designed to work on a touch screen display used in Raspberry Pi. The application is built in JavaScript and ReactJS.

## Features

Zelda can:

- Explain primary school mathematical word problems by converting and parsing them into mathematical expressions.
- Show the step by step process.
- Zelda is not accurate at solving mathematics, so she will never answer the equations. Only show how the operations were parsed from the word problem.

## Installation

To install and run Zelda, you will need:

- Node.js and npm installed on your Raspberry Pi.
- An OpenAI API key for GPT-3.
- A Raspberry Pi with a touch screen display. (OPTIONAL)

To install Zelda, follow these steps:

1. Clone the repository: `git clone https://github.com/gisketch/thesis-final-zelda`
2. Navigate to the project directory: `cd thesis-final-zelda`
3. Install the dependencies: `npm install`
4. Set up your OpenAI API key as an environment variable: `export OPENAI_API_KEY=your_key_here`
5. Start the application: `npm run dev`
