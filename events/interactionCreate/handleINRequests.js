 const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
 const staffSchema = require("../../schemas/staffMember");
 const noblox = require("noblox.js");
 const getUserAvatar = require("../../utils/getUserAvatar");

    module.exports = async (client, interaction) => {

        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("in_")) return;

        const inactivityModal = new ModalBuilder()
            .setTitle("Submit an inactivity request")
            .setCustomId(`inactivity_${interaction.member.id}`);

        const robloxuserInput = new TextInputBuilder().setCustomId("robloxuser").setPlaceholder("Enter your roblox username here").setStyle(TextInputStyle.Short).setLabel("Whats is your roblox username?");
        const reasonInput = new TextInputBuilder().setCustomId("reason").setPlaceholder("Enter your reason here").setStyle(TextInputStyle.Paragraph).setLabel("Whats the reason for this IN request?");
        const startDateInput = new TextInputBuilder().setCustomId("startdate").setPlaceholder("Enter the start date here (DD/MM/YYYY)").setStyle(TextInputStyle.Short).setLabel("When will you be going on IN?");
        const endDateInput = new TextInputBuilder().setCustomId("enddate").setPlaceholder("Enter the end date here (DD/MM/YYYY)").setStyle(TextInputStyle.Short).setLabel("When will you be coming back from IN?");

        const actionRow1 = new ActionRowBuilder().setComponents(robloxuserInput);
        const actionRow2 = new ActionRowBuilder().setComponents(reasonInput);
        const actionRow3 = new ActionRowBuilder().setComponents(startDateInput);
        const actionRow4 = new ActionRowBuilder().setComponents(endDateInput);

        inactivityModal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4);

        await interaction.showModal(inactivityModal)

        const filter = (i) => i.customId.startsWith("inactivity_") && i.user.id === interaction.user.id;

        const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 120000 }).catch(() => {});

        if (!modalInteraction) return;

        await modalInteraction.deferReply({ ephemeral: true });

        const reviewChannel = interaction.guild.channels.cache.get("1216012914235015288");

        const staffMember = await staffSchema.findOne({ userid: interaction.user.id });
        const robloxuser = staffMember.robloxuser;
        const userId = await noblox.getIdFromUsername(robloxuser);
        const avatar = await getUserAvatar(userId);

        const inEmbed = new EmbedBuilder()
            .setTitle("Inactivity Request")
            .addFields(
            { name: "User", value: `${interaction.member}` },
            { name: "Roblox Username", value: modalInteraction.fields.getTextInputValue("robloxuser")},
            { name: "Reason", value: modalInteraction.fields.getTextInputValue("reason") },
            { name: "Start Date", value: modalInteraction.fields.getTextInputValue("startdate") },
            { name: "End Date", value: modalInteraction.fields.getTextInputValue("enddate") },
            { name: "Status", value: "⌛ Pending"}
            )
            .setThumbnail(avatar)
            .setColor("Blurple");


        const reviewButtons = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setCustomId(`accept_${interaction.user.id}`).setLabel("Accept").setStyle(ButtonStyle.Success).setEmoji("✅"),
            new ButtonBuilder().setCustomId(`deny_${interaction.user.id}`).setLabel("Deny").setStyle(ButtonStyle.Danger).setEmoji("🗑️")
        )


        await reviewChannel.send({ embeds: [inEmbed], components: [reviewButtons] });

        await modalInteraction.editReply({ content: "Your IN request has been submitted for review! You will be notified soon.", ephemeral: true });
    };
