const { TicTacToe } = require('discord-gamecord');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "tictactoe",
    description: "play tictactoe with someone!",
    options: [
        {
            name: "opponent",
            description: "who you want to play against",
            type: ApplicationCommandOptionType.User,
            required: true
        }


        
    ],

    run: async(client, interaction) => {
       const opponent = interaction.options.getUser("opponent")
       const Game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
            opponent: opponent,
            embed: {
              title: 'Tic Tac Toe',
              color: '#5865F2',
              statusTitle: 'Status',
              overTitle: 'Game Over'
            },
            emojis: {
              xButton: '❌',
              oButton: '🔵',
              blankButton: '➖'
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '{emoji} | Its the turn of player **{player}**.',
            winMessage: '{emoji} | **{player}** won the game!',
            tieMessage: 'The Game tied! No one won the game!',
            timeoutMessage: 'The Game went unfinished! No one won the game!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });

          Game.startGame();
Game.on('gameOver', result => {
  return;
});
    }
}