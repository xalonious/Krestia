const noblox = require("noblox.js")
require("dotenv").config()
const group = process.env.GROUP
const getUserAvatar = require("../../utils/getUserAvatar")
const extractRankName = require("../../utils/extractRankName")
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")


const rankChoices = [
    { name: "Customer", value: "Customer" },
    { name: "Business Partner", value: "[B] Business Partner" },
    { name: "Noted Customer", value: "[N] Noted Customer" },
    { name: "Awaiting Training", value: "[L] Awaiting Training" },
    { name: "Cashier", value: "[L] Cashier" },
    { name: "Wait Staff", value: "[L] Wait Staff" },
    { name: "Head Wait Staff", value: "[L] Head Wait Staff" },
    { name: "Chef", value: "[L] Chef" },
    { name: "Staff Assistant", value: "[M] Staff Assistant" },
    { name: "Shift Leader", value: "[M] Shift Leader" },
    { name: "Shift Supervisor", value: "[M] Shift Supervisor" },
    { name: "Advisor", value: "[M] Advisor" },
    { name: "Assistant Manager", value: "[H] Assistant Manager" },
    { name: "General Manager", value: "[H] General Manager" },
    { name: "Executive Assistant", value: "[H] Executive Assistant" },
    { name: "Executive Director", value: "[H] Executive Director" },
    { name: "Executive Head", value: "[S] Executive Head" },
    { name: "Board of Directors", value: "[S] Board Of Directors" },
    { name: "Corporate", value: "[S] Corporate" },
    { name: "Developer", value: "[D] Developer" }
];




module.exports = {
    name: "setrank",
    description: "sets the rank of a user in the group",
   highRankOnly: true,
    options: [
        {
            name: "username",
            description: "the user to update the rank of",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "rank",
            description: "the rank to update the user to",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: rankChoices
        }
    ],

    run : async(client, interaction) => {


        await interaction.deferReply()
        
         const runnerid = interaction.member.id
        
         const runnerUser = await getRobloxUser(runnerid)


       
        const username = interaction.options.getString("username")

        
            const userId = await noblox.getIdFromUsername(username)
            if(userId == null) {
                return interaction.editReply({
                    content: "The specified username does not exist",
                })
            }
            let currentRank = await noblox.getRankNameInGroup(group, userId)
            


            const isMember = await noblox.getRankInGroup(group, userId)
        

            if(isMember == 0) {
                return interaction.editReply({
                    content: "The specified roblox user is not in the group.",
                })
            }

        const runnerID = await noblox.getIdFromUsername(runnerUser)

        const runnerRank = await noblox.getRankInGroup(group, runnerID)


        const rank = interaction.options.getString("rank")
        
          if(rank == currentRank) return interaction.editReply(`${username} already has the rank ${currentRank}`)



          if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
            content: "Unauthorized rank change: the user you are trying to demote has a role that is equal to or higher than yours.",
         })

        const roleToUpdateTo = await noblox.getRole(group, rank);

        if(runnerRank <= roleToUpdateTo.rank) return interaction.editReply({
         content: "Unauthorized operation: the role you are trying to update to is equal to or above your own.",
        })


        try {
            await noblox.setRank(group, userId, rank)
            let newRank = await noblox.getRankNameInGroup(group, userId)
            const newRankName = extractRankName(newRank)
         interaction.editReply(`Succesfully set the rank of ${username} to **${newRankName}**!`)


        
         } catch(error) {
          interaction.editReply({
            content: "An error occured, if the issue persists please contact the developer.",
          })
           return console.log(error)
         }

         let newRank = await noblox.getRankNameInGroup(group, userId)

         const embedimage = await getUserAvatar(userId)

         let logging = new EmbedBuilder()
         .setTitle("User rank updated")
         .setDescription("Someone's rank was updated in the group")
         .addFields(
            {name: "Username", value: username},
            {name: "Old rank", value: currentRank},
            {name: "New rank", value: newRank},
            {name: "Responsible user", value: runnerUser}
         )
         .setColor([0, 0, 255])
         .setThumbnail(embedimage)

         const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

         logschan.send({ embeds: [logging]})
    }
}