const { PermissionsBitField, ApplicationCommandOptionType, parseEmoji } = require("discord.js")

module.exports = {
    name: "stealemoji",
    description: "steals an emoji from another server",
    permissionsRequired: [PermissionsBitField.Flags.ManageGuildExpressions],

    options: [
        {
            name: "emoji",
            description: "the emoji to steal",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "name",
            description: "the name to give to the emoji",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async(client, interaction) => {

        await interaction.deferReply()

        const emoji = interaction.options.getString("emoji")
        const name = interaction.options.getString("name").replace(/[^A-Za-z0-9_]/g, "_")

        const parsedEmoji = parseEmoji(emoji)

        if(!parsedEmoji.id) return interaction.editReply("Failed to parse emoji, please ensure you are entering a valid non standard emoji")
        


            const extension = parsedEmoji.animated ? "gif" : "png"
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}.${extension}`
        
            await interaction.guild.emojis.create({ attachment: url, name }).then((emoji) => {
                interaction.editReply(`Succesfully created emoji ${emoji.toString()} with name ${emoji.name}`)
            })

        



       
    }
}