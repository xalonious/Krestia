const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: "ticket",
    description: "sends the ticket message",

    run: async (client, interaction) => {
        const ticketEmbed = new EmbedBuilder()
            .setTitle("Krestia Support System")
            .setDescription("Select an option from the menu below to open a ticket.")
            .setColor("Blurple")
            .setThumbnail(interaction.guild.iconURL())

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket")
            .setPlaceholder("Select an option...")
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel("General Support")
                    .setValue("general")
                    .setDescription("For general enquiries please open this ticket.")
                    .setEmoji("📩"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Human Resources")
                    .setValue("hrd")
                    .setDescription("Please open this ticket if you have any administration enquiries. (eg: staff)")
                    .setEmoji("📩"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Public Relations")
                    .setValue("prd")
                    .setDescription("Please open this ticket if you have any alliance enquiries.")
                    .setEmoji("📩")
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.guild.channels.cache.get("1074175937744207882").send({
            embeds: [ticketEmbed],
            components: [row]
        });

        interaction.reply("sent the ticket message!");
    }
};
