const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'sendreactionroles',
    description: 'Send the reaction roles message',

    run: async(client, interaction) => {

        const rrEmbed1 = new EmbedBuilder()
        .setTitle("Pronoun Roles")
        .setDescription("Press the buttons below to get your pronoun roles! You may press again to remove the role.")

        const rrEmbed2 = new EmbedBuilder()
        .setTitle("Notification Roles")
        .setDescription("Press the buttons below to get your notification roles! You may press again to remove the role.")

        const rrButtons1 = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("he/him").setLabel("He/Him").setStyle(ButtonStyle.Primary).setEmoji("👨"),
            new ButtonBuilder().setCustomId("she/her").setLabel("She/Her").setStyle(ButtonStyle.Danger).setEmoji("👩"),
            new ButtonBuilder().setCustomId("they/them").setLabel("They/Them").setStyle(ButtonStyle.Success).setEmoji("🫂"),
            new ButtonBuilder().setCustomId("other").setLabel("Other").setStyle(ButtonStyle.Secondary).setEmoji("❓")
        )
        
        const rrButtons2 = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId("announcements").setLabel("Announcements").setStyle(ButtonStyle.Primary).setEmoji("📢"),
            new ButtonBuilder().setCustomId("alliances").setLabel("Alliances").setStyle(ButtonStyle.Danger).setEmoji("🤝"),
            new ButtonBuilder().setCustomId("events").setLabel("Events").setStyle(ButtonStyle.Success).setEmoji("🎮"),
            new ButtonBuilder().setCustomId("sessions").setLabel("Sessions").setStyle(ButtonStyle.Secondary).setEmoji("📲")
        )

        const rrChannel = interaction.guild.channels.cache.get("1074169242804555777")

        await rrChannel.send({ embeds: [rrEmbed1], components: [rrButtons1] })
        await rrChannel.send({ embeds: [rrEmbed2], components: [rrButtons2] })

        await interaction.reply({ content: "Reaction roles sent!", ephemeral: true })
    }
}