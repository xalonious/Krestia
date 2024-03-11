const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "sendinmessage",
    description: "Send the in message",

    run: async(client, interaction) => {

        const inEmbed = new EmbedBuilder()
        .setTitle("Submit an inactivity request")
        .setDescription("Press the button below to submit an inactivity request. Please note that you can only go on inactivity for a maximum of 2 weeks per month!")
        .setColor("Blurple")
        .setThumbnail(interaction.guild.iconURL())

        const submitButton = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId(`in_${interaction.member.id}`).setLabel("Submit an IN request").setStyle(ButtonStyle.Primary).setEmoji("📝")
        )


        const inChannel = interaction.guild.channels.cache.get("1216016917358313603")

        await inChannel.send({ embeds: [inEmbed], components: [submitButton] })

        await interaction.reply({ content: "IN message sent!", ephemeral: true })


    }
}