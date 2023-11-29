const ticketSchema = require("../../schemas/Ticket")
const { PermissionsBitField, EmbedBuilder } = require("discord.js")
const { createTranscript } = require("discord-html-transcripts")


module.exports = async (client, interaction) => {
    const { guild, member, customId, channel } = interaction;

    if (!interaction.isButton()) return;

    const permissions = member.roles.cache.get("1089639862841381025")


    if (!["close", "open", "delete", "transcript"].includes(customId)) return;

    try {
        const data = await ticketSchema.findOne({ ChannelID: channel.id });

        if (!data) return;

       const fetchedMember = await guild.members.cache.get(data.MemberID);

        switch (customId) {
            case "delete":
                if(!permissions) return await interaction.reply({content: "You do not have permission to delete tickets.", ephemeral: true});
                await interaction.reply("Ticket will be deleted in 5 seconds...");
                setTimeout(async () => {
                    await channel.delete();
                }, 5000);

                await data.deleteOne();
                break;
            case "close":
                if (!permissions) return await interaction.reply({ content: "You do not have permission to close tickets.", ephemeral: true });
                if (data.Closed) return await interaction.reply({ content: "Ticket is already closed.", ephemeral: true });



                await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

                channel.permissionOverwrites.edit(fetchedMember, { [PermissionsBitField.Flags.ViewChannel]: false });

                await channel.setName(`closed-${fetchedMember.user.username}`);

                interaction.reply(`Ticket closed by ${interaction.member}`)
            break;
            case "open":
                if (!permissions) return await interaction.reply({ content: "You do not have permission to open tickets.", ephemeral: true });
                if (!data.Closed) return await interaction.reply({ content: "Ticket is already open.", ephemeral: true });

                await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: false });

                channel.permissionOverwrites.edit(fetchedMember, { [PermissionsBitField.Flags.ViewChannel]: true });

                await channel.setName(`ticket-${fetchedMember.user.username}`);

                interaction.reply(`Ticket reopened by ${interaction.member}`)
            break;
            case "transcript":
                const transcriptChannel = guild.channels.cache.get("1081320013836865616");
                if (!permissions) return await interaction.reply({ content: "You do not have permission to create transcripts.", ephemeral: true });
                await interaction.reply("Creating transcript...");

                const transcript = await createTranscript(channel, {
                    filename: `ticket-${data.TicketID} (${fetchedMember.user.username}).html`,
                });

                const transcriptEmbed = new EmbedBuilder()
                    .setTitle(`Transcript for ticket #${data.TicketID}`)

                    .setColor("Blue")
                    .setTimestamp()
                    .setAuthor({name: fetchedMember.user.username, iconURL: fetchedMember.displayAvatarURL({ dynamic: true })})
                    .addFields(
                        { name: "Ticket Owner", value: `${fetchedMember}`, inline: true },
                        { name: "Ticket Name", value: channel.name, inline: true },
                        { name: "Ticket ID", value: data.TicketID, inline: true},
                        { name: "Type", value: data.Type.toUpperCase(), inline: true}
                    )
                    .setThumbnail("https://cdn3.iconfinder.com/data/icons/block/32/ticket-512.png")

                await transcriptChannel.send({
                    embeds: [transcriptEmbed],
                    files: [transcript]
                });

                interaction.editReply("Transcript successfully saved!");

        }
    } catch (err) {
        throw err;
    }
};