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

                interaction.reply(`${interaction.member} | Succesfully closed ticket.`)
            break;
            case "open":
                if (!permissions) return await interaction.reply({ content: "You do not have permission to open tickets.", ephemeral: true });
                if (!data.Closed) return await interaction.reply({ content: "Ticket is already open.", ephemeral: true });

                await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: false });

                channel.permissionOverwrites.edit(fetchedMember, { [PermissionsBitField.Flags.ViewChannel]: true });

                await channel.setName(`ticket-${fetchedMember.user.username}`);

                interaction.reply(`${interaction.member} | Succesfully reopened ticket.`)
            break;
            case "transcript":
                const transcriptChannel = guild.channels.cache.get("1081320013836865616");
                if (!permissions) return await interaction.reply({ content: "You do not have permission to create transcripts.", ephemeral: true });
                await interaction.reply("Creating transcript...");

                const transcript = await createTranscript(channel, {
                    filename: `ticket-${data.TicketID} (${fetchedMember.user.username}).html`,
                })

                const transcriptEmbed = new EmbedBuilder()
                    .setTitle(`Transcript for ticket #${data.TicketID}`)
                    .setDescription(`Ticket type: ${data.Type.toUpperCase()}`)
                    .setColor("Blue")
                    .setTimestamp()
                    .setFooter({ text: fetchedMember.user.username, iconURL: fetchedMember.user.displayAvatarURL({ dynamic: true }) });


                await transcriptChannel.send({
                    embeds: [transcriptEmbed],
                    files: [transcript]
                })

                interaction.editReply("Transcript succesfully saved!")

        }
    } catch (err) {
        throw err;
    }
};
