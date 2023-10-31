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
        type: ApplicationCommandOptionType.Mentionable,
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

        const target = interaction.options.getMentionable("user")

        let reason = interaction.options.getString("reason")
        if(!reason) reason = "No reason given"
       

            if(interaction.member.roles.highest.position <= target.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({
                content: "You cannot ban someone with a role that is equal to or higher than yours.",
                ephemeral: true
            })
            try {
                const bannedloser = new EmbedBuilder()
                .setTitle(`You were banned from ${interaction.guild.name}`)
                .addFields(
                    {name: "Ban reason", value: reason},
                    {name: "Moderator", value: `${interaction.member}`}
                )
                .setColor([255, 0, 0])
                .setThumbnail(interaction.guild.iconURL())
                target.send({ embeds: [bannedloser]})
              setTimeout(() => {
                 target.ban({
                    reason: reason
                }).then((memb) => interaction.reply(`Succesfully banned ${target.user.tag}`))
              }, 1000)
                
            } catch(error) {
            interaction.reply("unable to ban that user, make sure my highest role is above theirs")
            console.log(error)
            return;
            }

            const logEmbed = new EmbedBuilder()
            .setTitle("User banned")
            .setDescription("Someone was banned from the server")
            .addFields(
                {name: "User", value: `${target}`},
                {name: "Reason", value: reason},
                {name: "Responsible moderator", value: `${interaction.member}`}
            )
            .setColor([255, 0, 0])
            .setThumbnail(target.user.displayAvatarURL())

            const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

            logschan.send({ embeds: [logEmbed]})
      

    }}