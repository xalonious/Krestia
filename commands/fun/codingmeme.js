const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
        name: "codingmeme",
        description: "shows a random programming meme",

    run: async(client, interaction) => {
        await interaction.deferReply();

        try {
            const subreddit = "ProgrammerHumor";
            const url = `https://www.reddit.com/r/${subreddit}/random.json`;

            const response = await axios.get(url, {
                timeout: 10000
            });

            const responsedata = response.data;
            const imageUrl = responsedata[0].data.children[0].data.url;
            const memeTitle = responsedata[0].data.children[0].data.title;
            const memeAuthor = responsedata[0].data.children[0].data.author;
            const memePermalink = `https://www.reddit.com${responsedata[0].data.children[0].data.permalink}`;
            const memeEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(memeTitle)
                .setURL(memePermalink)
                .setImage(imageUrl)
                .setFooter({ text: `Posted by u/${memeAuthor}` });

            interaction.editReply({ embeds: [memeEmbed] });

        } catch (error) {
            if (error.message === "timeout of 10000ms exceeded") {
                return interaction.editReply({
                    content: "The request took too long to complete, please try again later.",
                });
            } else {
                return interaction.editReply({
                    content: "An error occurred while fetching the meme.",
                });
            }
        }
    }
};
