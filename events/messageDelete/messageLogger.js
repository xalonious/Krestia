const { EmbedBuilder } = require("discord.js");

module.exports = (client, message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const logsChannel = message.guild.channels.cache.get("1074168201560195082");

    try {
        let deletedContent = new EmbedBuilder()
        .setTitle("Deleted Message")
        .addFields(
            { name: "Author", value: `${message.author}` },
            { name: "In", value: `${message.channel}` },
            { name: "Content", value: `${message.content || "No content"}` }
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setColor("Random");

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        deletedContent.addFields({ name: "Attachment", value: `${attachment.url}`});
        deletedContent.setImage(attachment.url);
    }

     logsChannel.send({ embeds: [deletedContent] });
    } catch(e) {
        return;
    }

};



