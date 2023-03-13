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
- A microphone and a speaker

To install Zelda, follow these steps:

1. Clone the repository: `git clone https://github.com/gisketch/thesis-final-zelda`
2. Navigate to the project directory: `cd thesis-final-zelda`
3. Install the dependencies: `npm install`
4. Set up your OpenAI API key as an environment variable: `export OPENAI_API_KEY=your_key_here`
5. Start the application: `npm run dev`

## Usage

1. Enter your name so that Zelda will know who she's talking to!
![image](https://user-images.githubusercontent.com/78424395/224638510-438fda13-5082-42ce-aa18-05c7c7436726.png)

2. Press the record button to ask Zelda any math problems!
![image](https://user-images.githubusercontent.com/78424395/224638748-3edd0056-d813-4fb0-90ca-3434fc8271b5.png)

3. Voila!
![image](https://user-images.githubusercontent.com/78424395/224638821-437a5f6b-69c0-409b-88c3-26ec2bf964f2.png)

## Contributing

Contributions to Zelda are welcome! If you want to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-branch-name`
3. Make your changes and commit them: `git commit -m "My commit message"`
4. Push your changes to your fork: `git push origin my-branch-name`
5. Create a pull request.

## License

Zelda is released under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for more details.

## Acknowledgements

Zelda was created by Ghegi Jimenez as part of his thesis project with the help of OpenAI's GPT-3 language model. Special thanks to my friends who supported me throughout all the hardships I've faced creating this project. You know who you are.
