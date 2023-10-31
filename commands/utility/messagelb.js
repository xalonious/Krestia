const { EmbedBuilder } = require("discord.js");
const MessageModel = require("../../schemas/messages")
module.exports = {
    name: "messagelb",
    description: "Shows the 10 users with the most messages",

    run : async(client, interaction) => {
        await interaction.deferReply()
        
        let users = await MessageModel.find().sort({ messages: -1 }).limit(10) 

        if(users.length == 0) {
            return interaction.editReply("There is currently no one on the message lb.")
        }
        const lbEmbed = new EmbedBuilder()
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
        .setDescription(`**Messages ranking**\n\n${users.map((user, index) => `\`${index + 1}\` <@${user.userid}> - ${user.messages}`).join("\n")}`)
        .setColor(`#ff69b4`)
        .setFooter({text: `Requested by ${interaction.user.username}`, imageUrl: `${interaction.user.displayAvatarURL({ format: "png", dynamic: true })}`})

        interaction.editReply({embeds: [lbEmbed]})

    }
}