const ticketSchema = require("../../schemas/Ticket");
const { PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client, interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    await interaction.deferReply({ ephemeral: true });

    const { guild, member, values } = interaction;
    const value = values[0];

    const existingTicket = await ticketSchema.findOne({ MemberID: member.id, Closed: false });
    if (existingTicket) {
        return interaction.editReply({ content: "You already have an open ticket.", ephemeral: true });
    }

    const ticketId = Math.floor(Math.random() * 1000000);

    if (!["general", "hrd", "prd"].includes(value)) return;

    await interaction.editReply({ content: "Creating ticket...", ephemeral: true });

    await guild.channels
        .create({
            name: `ticket-${member.user.username}`,
            type: ChannelType.GuildText,
            parent: "1081320016156299264",
            permissionOverwrites: [
                { id: "1074154728545583174", deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: member.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.EmbedLinks] },
                { id: "1089491380503588864", allow: [PermissionsBitField.Flags.ViewChannel]}
            ],
        })
        .then(async (channel) => {
               await ticketSchema.create({
                MemberID: member.id,
                TicketID: ticketId,
                ChannelID: channel.id,
                Closed: false,
                Type: value,
            });

            await interaction.editReply(`Ticket created successfully! [Click here to access the ticket channel](https://discord.com/channels/${guild.id}/${channel.id})`);

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Ticket Opened | type: ${value.toUpperCase()}`)
                .setDescription(`Thank you for creating a ticket, support will be with you shortly. While you wait, please describe your issue.`)
                .setColor("Blue")
                .setFooter({ text: `Ticket ID: ${ticketId}`, iconURL: member.displayAvatarURL({ dynamic: true }) });

            const ticketButtons1 = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId("close").setLabel("Close Ticket").setStyle(ButtonStyle.Primary).setEmoji("🔒"),
                new ButtonBuilder().setCustomId("open").setLabel("Open Ticket").setStyle(ButtonStyle.Success).setEmoji("🔓")
            );

            const ticketButtons2 = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId("delete").setLabel("Delete Ticket").setStyle(ButtonStyle.Danger).setEmoji("🗑️"),
                new ButtonBuilder().setCustomId("transcript").setLabel("Save Transcript").setStyle(ButtonStyle.Secondary).setEmoji("📑")
            );

            channel.send({
                content: "<@&1089491380503588864>",
                embeds: [ticketEmbed],
                components: [ticketButtons1, ticketButtons2],
            });
        });
};
