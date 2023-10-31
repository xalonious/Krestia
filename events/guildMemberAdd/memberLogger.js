const { EmbedBuilder } = require("discord.js")
const moment = require("moment")
module.exports = (client, guildMember) => {


    const logsChannel = guildMember.guild.channels.cache.get("1074168175425499206")

    const logEmbed = new EmbedBuilder()
        .setAuthor({name: "Member Joined", iconURL: guildMember.user.displayAvatarURL()})
        .setDescription(`${guildMember} ${guildMember.user.tag}`)
        .addFields(
        {name: "Account Creation Date", value: `${moment(guildMember.user.createdAt).format("LLLL")}`},
        {name: "Current Member Count", value: `${guildMember.guild.memberCount}`}
        )
        .setFooter({text: `ID: ${guildMember.user.id}`})
        .setColor("Green")
    
        logsChannel.send({embeds: [logEmbed]})
}