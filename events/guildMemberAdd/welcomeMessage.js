const { EmbedBuilder } = require("discord.js")
module.exports = (client, guildMember) => {
    if(guildMember.user.bot) return;
    const welcomeChan = guildMember.guild.channels.cache.get("1074169169668476989")

    const welcomeEmbed = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription(`Hey ${guildMember.user.username}! Welcome to the Krestia server! Before you send your first message please read the rules! Enjoy your time in the server.`)
    .setThumbnail("https://cdn.discordapp.com/attachments/1076652520149110894/1086038285501083771/krestia_cafe.png")
    .setColor([0, 255, 255])

    welcomeChan.send({ content: `${guildMember}`, embeds: [welcomeEmbed]})
}