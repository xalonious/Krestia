const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js")
const sendLog = require("../../utils/sendLog")
require("dotenv").config()
module.exports = {
 name: "kick",
 description: "kicks a user from the server",
 permissionsRequired: [PermissionsBitField.Flags.KickMembers],
 options: [
    {
        name: "user",
        description: "the user who you want to kick",
        type: ApplicationCommandOptionType.User,
        required: true
    },
    {
        name: "reason",
        description: "the reason for the kick",
        type: ApplicationCommandOptionType.String,
        required: false
    }
 ],


        run: async(client, interaction) => {

        await interaction.deferReply()

        const target = interaction.options.getMember("user")

        let reason = interaction.options.getString("reason") || "No reason given"

            if(interaction.member.roles.highest.position <= target.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) return interaction.editReply({
                content: "You cannot kick someone with a role that is equal to or higher than yours.",
                ephemeral: true
            })
            
                const bannedloser = new EmbedBuilder()
                .setTitle(`You were kicked from ${interaction.guild.name}`)
                .addFields(
                    {name: "Kick reason", value: reason},
                    {name: "Moderator", value: `${interaction.member}`}
                )
                .setColor("Red")
                .setThumbnail(interaction.guild.iconURL())



                let confirmationMessage = `Succesfully kicked ${target.user.tag}`

                try {
                    await target.send({ embeds: [bannedloser]})
                } catch(error) {
                    confirmationMessage = `Succesfully kicked ${target.user.tag}, I was unable to notify them.`
                }

              setTimeout(() => {
                 target.kick({
                    reason: reason
                }).then(() => interaction.editReply(confirmationMessage))
              }, 1000)
                

            sendLog(
                client,
                "User kicked",
                "Someone was kicked from the server",
                [
                    {name: "User", value: target},
                    {name: "Reason", value: reason},
                    {name: "Responsible moderator", value: interaction.member}
                ],
                "Red",
                target.user.displayAvatarURL()
            )
      

    }}