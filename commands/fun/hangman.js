const { Hangman } = require('discord-gamecord');

module.exports = {
    name: "hangman",
    description: "play hangman!",      
    

    run: async(client, interaction) => {
      const Game = new Hangman({
  message: interaction,
  isSlashGame: true,
  embed: {
    title: 'Hangman',
    color: '#5865F2'
  },
  hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
  timeoutTime: 60000,
  winMessage: 'You won! The word was **{word}**.',
  loseMessage: 'You lost! The word was **{word}**.',
  playerOnlyMessage: 'Only {player} can use these buttons.'
});

          Game.startGame();
Game.on('gameOver', result => {
  return;
});
    }
}