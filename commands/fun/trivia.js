const { Trivia } = require("discord-gamecord")

module.exports = {
    name: "trivia",
    description: "play trivia",

    run: async(client, interaction) => {
        const Game = new Trivia({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Trivia',
              color: '#5865F2',
              description: 'You have 60 seconds to guess the answer.'
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            trueButtonStyle: 'SUCCESS',
            falseButtonStyle: 'DANGER',
            mode: 'multiple',  
            difficulty: 'medium', 
            winMessage: 'You won! The correct answer is {answer}.',
            loseMessage: 'You lost! The correct answer is {answer}.',
            errMessage: 'Unable to fetch question data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            return;
          });
    }
}