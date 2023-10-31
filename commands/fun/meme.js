const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "meme",
    description: "shows a random meme",

    run: async (client, interaction) => {
        await interaction.deferReply();
        
        try {
           const response = await axios.get('https://www.reddit.com/r/memes/random.json')
     

            const responsedata = response.data;
            const imageUrl = responsedata[0].data.children[0].data.url;
            const memeTitle = responsedata[0].data.children[0].data.title;
            const memeAuthor = responsedata[0].data.children[0].data.author;
           const post = responsedata[0].data.children[0].data;
            const postHint = post.post_hint;
            const memePermalink = `https://www.reddit.com${responsedata[0].data.children[0].data.permalink}`;
            
            if(postHint !== "image") return interaction.editReply("API did not return an image, please try again")
           
           
            
            const memeEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(memeTitle)
                .setURL(memePermalink)
                .setImage(imageUrl)
                .setFooter({ text: `Posted by u/${memeAuthor}` });

            interaction.editReply({ embeds: [memeEmbed] });
        } catch (error) {
            console.error("An error occurred:", error);
            interaction.editReply("An error occurred while fetching the meme.");
        }
    }
};
