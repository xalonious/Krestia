const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js")
const getRobloxUser = require("../../utils/getRobloxUser")
const noblox = require("noblox.js")
require("dotenv").config()
const group = process.env.GROUP


module.exports = {
  name: "setshout",
  description: "sets the group shout",
  highRankOnly: true,
  options: [
    {
        name: "shout",
        description: "the shout to set",
        type: ApplicationCommandOptionType.String,
        required: true
    }
  ],


    run: async(client, interaction) => {

        await interaction.deferReply()

        const shout = interaction.options.getString("shout")

        const runnerid = interaction.member.id
        const runnerUser = await getRobloxUser(runnerid)

        await noblox.shout(group, shout)

        interaction.editReply("Succesfully set the group shout!")

        const logEmbed = new EmbedBuilder()
        .setTitle("Group shout updated")
        .setDescription("The group shout has been updated")
        .addFields(
            {name: "New shout", value: shout},
            {name: "Responsible user", value: runnerUser}
        )
        .setColor("Blue")
        .setThumbnail(interaction.guild.iconURL())

        const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 
        logschan.send({ embeds: [logEmbed]})
    }
}