const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: "ticket",
    description: "sends the ticket message",

    run: async (client, interaction) => {
        const ticketEmbed = new EmbedBuilder()
            .setDescription("To create a ticket, select an option from the drop-down menu!");

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket")
            .setPlaceholder("Select an option")
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
