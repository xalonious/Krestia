const { ApplicationCommandOptionType, PermissionsBitField, EmbedBuilder } = require("discord.js");
const sendLog = require("../../utils/sendLog");
const ms = require("ms")
require("dotenv").config()
module.exports = {
    name: "timeout",
    description: "puts a user in timeout",
    permissionsRequired: [PermissionsBitField.Flags.ModerateMembers],
    options: [
        {
            name: "user",
            description: "the user who you want to timeout",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "duration",
            description: "the duration of the timeout (30m, 1h, 1 day, etc)",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "reason",
            description: "the reason for the timeout",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run : async(client, interaction) => {

        const mentionable = interaction.options.getMember("user")
        const duration = interaction.options.getString("duration")
        let reason = interaction.options.getString("reason")
        if(!reason) reason = "No reason given"


        const targetUser = await interaction.guild.members.fetch(mentionable)

        const msDuration = ms(duration)
        if(isNaN(msDuration)) {
           return interaction.reply({
                content: "Please provide a valid timeout duration.",
                ephemeral: true
            })
        }

        if(msDuration < 5000 || msDuration > 2.419e9) {
            return interaction.reply({
                content: "Timeout duration cannot be less than 5 seconds or more than 28 days.",
                ephemeral: true
            })
        }

        if(mentionable.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({
            content: "You cant timeout someone with a role that is equal to or higher than yours.",
            ephemeral: true
        })

        if(targetUser.isCommunicationDisabled()) return interaction.reply({
            content: "This user is already in timeout.",
            ephemeral: true
        })

        try {
            await targetUser.timeout(msDuration, reason)
            interaction.reply("The user has been timed out.")
        } catch(error) {
            return interaction.reply({
                content: "An error occured, if the issue persists please contact the developer.",
                ephemeral: true
              })
        }

        /*const logEmbed = new EmbedBuilder()
        .setTitle("User timed out")
        .setDescription("Someone was timed out in the server")
        .addFields(
            {name: "User", value: `${mentionable}`},
            {name: "Reason", value: reason},
            {name: "Responsible moderator", value: `${interaction.member}`}
        )
        .setColor("Red")
        .setThumbnail(mentionable.user.displayAvatarURL())

        const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

        logschan.send({ embeds: [logEmbed]})*/

        sendLog(
            client,
            "User timed out",
            "Someone was timed out in the server",
            [
                {name: "User", value: mentionable},
                {name: "Reason", value: reason},
                {name: "Responsible moderator", value: interaction.member}
            ],
            "Red",
            mentionable.user.displayAvatarURL()
        )

    }
}