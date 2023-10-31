const { EmbedBuilder } = require("discord.js")
module.exports = (client, oldMessage, newMessage) => {
    
    
    try {
      if(!oldMessage.guild) return;
      if(oldMessage.author.bot) return;
     if(oldMessage.attachments.size > 0) return;
     if(oldMessage.content.includes("http")) return;
      const logsChannel = oldMessage.guild.channels.cache.get("1074168201560195082")

      let editedContent = new EmbedBuilder()
      .setTitle("Edited Message")
      .addFields(
        {name: "Author", value: `${oldMessage.author}`},
        {name: "In", value: `${oldMessage.channel}`},
        {name: "Old Message", value: `${oldMessage.content}`},
        {name: "New Message", value: `${newMessage.content}`}
      )
      .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }))
      .setColor("Random")

      logsChannel.send({ embeds: [editedContent]})
        
    } catch(error) {
        console.log(`Error on message update event: ${error}`)
    }

}