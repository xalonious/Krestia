const { EmbedBuilder } = require("discord.js");

module.exports = async (client, oldMessage, newMessage) => {
  if (oldMessage.author.bot || oldMessage.attachments.size > 0 || oldMessage.content.includes("http")) {
    return;
  }

  try {
    const logsChannel = oldMessage.guild.channels.cache.get("1074168201560195082");

    const editedContent = new EmbedBuilder()
      .setTitle("Edited Message")
      .addFields(
        { name: "Author", value: `${oldMessage.author}`},
        { name: "In", value: `${oldMessage.channel}`},
        { name: "Old Message", value: oldMessage.content },
        { name: "New Message", value: newMessage.content }
      )
      .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }))
      .setColor("Random");

    await logsChannel.send({ embeds: [editedContent] });
  } catch (error) {
    console.log(`Error on message update event: ${error}`);
  }
};
