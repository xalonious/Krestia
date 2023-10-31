const axios = require("axios")
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "urban",
    description: "Search the definition of something in the urban",
    options: [
        {
            name: "query",
            description: "What to search for",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async(client, interaction) => {
        
        await interaction.deferReply()

        const query = interaction.options.getString("query")

        const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${query}`)
        const responseData = response.data


        const definitionData = responseData.list[0]
        if(!definitionData) return interaction.editReply(`No definition found for ${query}`)
        
        if (definitionData.definition.length + definitionData.example.length > 4096) return interaction.editReply("Returned data exceeds maximum embed character length, please try a different term")

        const dataEmbed = new EmbedBuilder()
        .setTitle(`Definition of ${definitionData.word}`)
        .setDescription(`**Definition:** ${definitionData.definition} \n \n **Example:** ${definitionData.example}`)
        .setFooter({text: `${definitionData.author} | 👍 ${definitionData.thumbs_up} | 👎 ${definitionData.thumbs_down}`})
        .setColor("Random")

        await interaction.editReply({embeds: [dataEmbed]})

    }
}