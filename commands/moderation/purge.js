const { ApplicationCommandOptionType, PermissionsBitField } = require("discord.js")

module.exports = {
    name: "purge",
    description: "clears chat messages",
    permissionsRequired: [PermissionsBitField.Flags.ManageMessages],
    options: [
        {
            name: "amount",
            description: "the amount of messages to purge",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async (client, interaction) => {
        const amount = interaction.options.getInteger("amount")

        if (parseInt(amount) > 99) {
            return interaction.reply({
                content: "I can only delete 99 messages at a time.",
                ephemeral: true,
            })
        }

        await interaction.channel.bulkDelete(parseInt(amount))

        interaction.reply(`Successfully cleared ${amount} messages`)
            setTimeout(() => {
                interaction.deleteReply();
            }, 3000);
        
    }
}