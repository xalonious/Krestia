const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const staffSchema = require("../../schemas/staffMember");

module.exports = async (client, interaction) => {

    if(!interaction.isButton()) return;
    if (!interaction.customId.startsWith("accept_") && !interaction.customId.startsWith("deny_")) return;

    if (interaction.customId.startsWith("accept_")) {
        const userId = interaction.customId.split("_")[1];

        const reviewEmbed = interaction.message.embeds[0];
        const startDate = reviewEmbed.fields[3].value;
        const endDate = reviewEmbed.fields[4].value;

        const [startDay, startMonth, startYear] = startDate.split("/");
        const formattedStartDate = `${startMonth}/${startDay}/${startYear}`;

        const [endDay, endMonth, endYear] = endDate.split("/");
        const formattedEndDate = `${endMonth}/${endDay}/${endYear}`;

        const currentDate = new Date();
        const startOfWeek = currentDate.getDate() - currentDate.getDay();
        const startOfInactivity = new Date(formattedStartDate);

        let isOnInactivity;
        const startOfWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), startOfWeek);

        if (startOfInactivity >= startOfWeekDate && startOfInactivity < new Date(startOfWeekDate.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            isOnInactivity = true;
            const inRole = interaction.guild.roles.cache.get("1100853944353300500");
            const member = await interaction.guild.members.fetch(userId);
            await member.roles.add(inRole);

        } else {
            isOnInactivity = false;
        }

        await staffSchema.findOneAndUpdate({ userid: userId }, {
            'inactivity.isOnInactivity': isOnInactivity,
            'inactivity.startDate': new Date(formattedStartDate),
            'inactivity.endDate': new Date(formattedEndDate),
        });

        await interaction.reply({ content: "Inactivity request accepted!", ephemeral: true });
        reviewEmbed.fields[5].value = "✅ Accepted";
        reviewEmbed.data.color = 0x00FF00;
        reviewEmbed.fields[6] = { name: "Accepted by", value: `${interaction.user}` }
        await interaction.message.edit({ embeds: [reviewEmbed], components: [] });
        const user = await client.users.fetch(userId);
        try {
            await user.send(`Your inactivity request has been accepted! You will be on inactivity from ${startDate} to ${endDate}.`);
        } catch (error) {
            return;
        }
    } else if (interaction.customId.startsWith("deny_")) {
        const userId = interaction.customId.split("_")[1];
        const denyModal = new ModalBuilder()
            .setTitle("Deny an inactivity request")
            .setCustomId(`denyin_${userId}`);

        const reasonInput = new TextInputBuilder().setCustomId("reason").setPlaceholder("Enter your reason here").setStyle(TextInputStyle.Paragraph).setLabel("Reason for denying this IN request?");
        const actionRow = new ActionRowBuilder().setComponents(reasonInput);
        denyModal.addComponents(actionRow);

        await interaction.showModal(denyModal);

        const filter = (i) => i.customId.startsWith("denyin_") && i.user.id === interaction.user.id;

        const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 60000 }).catch(() => {});

        if (!modalInteraction) return;

        await modalInteraction.deferReply({ ephemeral: true });

        const reviewEmbed = interaction.message.embeds[0];
        const reason = modalInteraction.fields.getTextInputValue("reason");

        reviewEmbed.fields[5].value = "🗑️ Denied"
        reviewEmbed.data.color = 0xFF0000;
        reviewEmbed.fields[6] = { name: "Denied by", value: `${interaction.user}` }
        reviewEmbed.fields[7] = { name: "Reason", value: reason }
        await interaction.message.edit({ embeds: [reviewEmbed], components: [] });
        await modalInteraction.editReply({ content: "Inactivity request denied!", ephemeral: true });
        const user = await client.users.fetch(userId);
        try {
            await user.send(`Your inactivity request has been denied. Reason: ${reason}`);
        } catch (error) {
            return;
        }
    }
}