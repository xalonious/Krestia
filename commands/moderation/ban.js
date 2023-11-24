const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js")
require("dotenv").config()
module.exports = {
 name: "ban",
 description: "bans a user from the server",
 permissionsRequired: [PermissionsBitField.Flags.BanMembers],
 options: [
    {
        name: "user",
        description: "the user who you want to ban",
        type: ApplicationCommandOptionType.User,
        required: true
    },
    {
        name: "reason",
        description: "the reason for the ban",
        type: ApplicationCommandOptionType.String,
        required: false
    }
 ],


        run: async(client, interaction) => {

        const target = interaction.options.getMember("user")

        let reason = interaction.options.getString("reason")
        if(!reason) reason = "No reason given"
       

            if(interaction.member.roles.highest.position <= target.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({
                content: "You cannot ban someone with a role that is equal to or higher than yours.",
                ephemeral: true
            })
                const bannedloser = new EmbedBuilder()
                .setTitle(`You were banned from ${interaction.guild.name}`)
                .addFields(
                    {name: "Ban reason", value: reason},
                    {name: "Moderator", value: `${interaction.member}`}
                )
                .setColor([255, 0, 0])
                .setThumbnail(interaction.guild.iconURL())

                    let confirmationMessage = `Succesfully banned ${target.user.tag}`

            try {
                await target.send({ embeds: [bannedloser]})
            } catch(error) {
                confirmationMessage = `Succesfully banned ${target.user.tag}, I was unable to notify them.`
            }

                
              setTimeout(() => {
                 target.ban({
                    reason: reason
                }).then(() => interaction.reply(confirmationMessage))
              }, 1000)
                


            const logEmbed = new EmbedBuilder()
            .setTitle("User banned")
            .setDescription("Someone was banned from the server")
            .addFields(
                {name: "User", value: `${target}`},
                {name: "Reason", value: reason},
                {name: "Responsible moderator", value: `${interaction.member}`}
            )
            .setColor("Red")
            .setThumbnail(target.user.displayAvatarURL())

            const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

            logschan.send({ embeds: [logEmbed]})
      

    }}