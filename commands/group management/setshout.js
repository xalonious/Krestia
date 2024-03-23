const { ApplicationCommandOptionType } = require("discord.js")
const getRobloxUser = require("../../utils/getRobloxUser")
const noblox = require("noblox.js")
require("dotenv").config()
const group = process.env.GROUP
const sendLog = require("../../utils/sendLog")


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


        sendLog(
          client,
          "Group shout updated",
          "The group shout has been updated",
          [
            {name: "New shout", value: shout},
            {name: "Responsible user", value: runnerUser}
          ],
          "Blue",
          interaction.guild.iconURL()
        )
    }
}