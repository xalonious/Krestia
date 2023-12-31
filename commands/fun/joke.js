const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "joke",
    description: "tells you a joke",

    run: async(client, interaction) => {
        try {

            await interaction.deferReply();

            const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
            const joke = response.data;
            

            let description = '';
            if (joke.setup && joke.delivery) {
                description = `${joke.setup}\n\n${joke.delivery}`;
            } else if (joke.joke) {
                description = joke.joke;
            }

            const embed = new EmbedBuilder()
                .setTitle(`Funny as f jokes by the best bot in town!! | Category: ${joke.category}`)
                .setDescription(description)
                .setColor('#0099ff');

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while fetching the joke, try again later.');
        }
    }
}