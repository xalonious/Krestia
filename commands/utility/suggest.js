const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
module.exports = {
    name: "suggest",
    description: "suggest something for the server",
    options: [
        {
            name: "suggestion",
            description: "what you want to suggest",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

        run: async(client, interaction) => {
        const sugChannel = interaction.guild.channels.cache.get("1074776372532236318")
        if(!sugChannel) return interaction.reply("Failed to find channel with name 'suggestions'")

        const suggestion = interaction.options.getString("suggestion")
        
        const author = interaction.member;
        const sugEmbed =  new EmbedBuilder()
        .setAuthor({name: author.user.tag, iconURL: author.user.displayAvatarURL({ dynamic: true})})
        .setDescription(`**Suggestion:** ${suggestion}`)
        .addFields(
            {name: "Status", value: "PENDING"},
        )
        .setColor([0, 0, 255])
        .setTimestamp()

         sugChannel.send({ embeds: [sugEmbed]}).then((embed) => {
            embed.react("👍")
            embed.react("👎")
        })

        interaction.reply("Succesfully submitted suggestion")



    }
}