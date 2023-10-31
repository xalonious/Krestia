const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "say",
    description: "makes the bot say something",
    options: [
        {
            name: "message",
            description: "the message you want the bot to say",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run : async(client, interaction) => {
        const message = interaction.options.getString("message")

        if(message.includes("@everyone") || message.includes("@here")) return interaction.reply({
            content: "nice try",
            ephemeral: true
        })

        const regex = /<@[!&]?\d+>/g;

        if(regex.test(message)) {
            return interaction.reply({
                content: "You cannot use pings in this command.",
                ephemeral: true
            })
        }

        interaction.channel.send(message)

        interaction.reply({
            content: "Sent message!",
            ephemeral: true
        })
    }
}