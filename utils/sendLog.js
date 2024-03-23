const { EmbedBuilder } = require("discord.js");

module.exports = function logEmbed(client, title, description, fields, color, thumbnail) {
    const logsChannel = client.channels.cache.get("1075349387758293073");
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .addFields(fields)
        .setColor(color)
        .setThumbnail(thumbnail);

    logsChannel.send({ embeds: [embed] });
}
