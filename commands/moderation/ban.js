const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
require("dotenv").config();

module.exports = {
    name: "ban",
    description: "Bans a user from the server",
    permissionsRequired: [PermissionsBitField.Flags.BanMembers],
    options: [
        {
            name: "user",
            description: "The user who you want to ban",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "The reason for the ban",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();

        const targetOption = interaction.options.get("user");
        let targetId;
        let target;

        if (targetOption.type === ApplicationCommandOptionType.User) {
            targetId = targetOption.user.id;
            target = interaction.guild.members.cache.get(targetId);
        } else if (targetOption.type === ApplicationCommandOptionType.String) {
            targetId = targetOption.value;
            target = interaction.guild.members.cache.get(targetId) || { user: { tag: "Unknown User" } };
        }

        let reason = interaction.options.getString("reason") || "No reason given";

        if (targetId) {
            try {
                await interaction.guild.bans.create(targetId, { reason: reason });
                const logEmbed = new EmbedBuilder()
                    .setTitle("User banned")
                    .setDescription("Someone was banned from the server")
                    .addFields(
                        { name: "User ID", value: `${targetId}` },
                        { name: "Reason", value: reason },
                        { name: "Responsible moderator", value: `${interaction.member}` }
                    )
                    .setColor("Red")

                const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN);

                logschan.send({ embeds: [logEmbed] });

                return interaction.editReply(`Successfully banned user with ID ${targetId}`);
            } catch (error) {
                console.log(error)
                return interaction.editReply(`Failed to ban user with ID ${targetId}`);
            }
        }

        if (interaction.member.roles.highest.position <= target.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.editReply({
                content: "You cannot ban someone with a role that is equal to or higher than yours.",
                ephemeral: true,
            });
        }

        const bannedloser = new EmbedBuilder()
            .setTitle(`You were banned from ${interaction.guild.name}`)
            .addFields(
                { name: "Ban reason", value: reason },
                { name: "Moderator", value: `${interaction.member}` },
                { name: "If you wish to appeal, please fill out the form below", value: "[📎 Ban Appeal Form](https://forms.gle/TemVMjLXaxP5hTXs6)" }
            )
            .setColor("Red")
            .setThumbnail(interaction.guild.iconURL());

        let confirmationMessage = `Successfully banned ${target.user.tag}`;

        try {
            await target.send({ embeds: [bannedloser] });
        } catch (error) {
            confirmationMessage = `Successfully banned ${target.user.tag}, but I was unable to notify them.`;
        }

        setTimeout(() => {
            target.ban({
                reason: reason,
            }).then(() => interaction.editReply(confirmationMessage));



            const logEmbed = new EmbedBuilder()
                    .setTitle("User banned")
                    .setDescription("Someone was banned from the server")
                    .addFields(
                        { name: "User", value: `${target}` },
                        { name: "Reason", value: reason },
                        { name: "Responsible moderator", value: `${interaction.member}` }
                    )
                    .setColor("Red")
                    .setThumbnail(target.user.displayAvatarURL());

                const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN);

                logschan.send({ embeds: [logEmbed] });


        }, 1000);
    },
};
