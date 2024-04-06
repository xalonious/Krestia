const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "wikipedia",
    description: "Search something on wikipedia",
  options: [
    {
      name: "query",
      description: "what you want to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {

   await interaction.deferReply();

    const query = interaction.options.getString("query");

    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );


      const body = response.data;


      const embed = new EmbedBuilder()
        .setTitle(`🌐 ${body.title}`)
        .addFields({
          name: "More Info:",
          value: `**[Click Here](${body.content_urls.desktop.page})**`,
          inline: true,
        })
        .setDescription(`** ${body.extract} **`)
        .setColor("Random");

      if (body.thumbnail) {
        embed.setThumbnail(body.thumbnail.source);
      }

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (error.response.status === 404) {
    return interaction.editReply({
        content: "No results found for that query, try something else",
    });
} else {
    interaction.editReply({
        content: "An error occurred while fetching the data",
    });
    console.log(error)
}


    }
  },
};