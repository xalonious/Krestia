const noblox = require("noblox.js")
require("dotenv").config()
const group = process.env.GROUP
const getUserAvatar = require("../../utils/getUserAvatar")
const extractRankName = require("../../utils/extractRankName")
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")


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
            required: true
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


        const rank = interaction.options.getString("rank").toLowerCase()


        const rankMap = {
            "customer": "Customer",
            "business partner": "[B] Business Partner",
            "noted customer": "[N] Noted Customer",
            "awaiting training": "[L] Awaiting Training",
            "cashier": "[L] Cashier",
            "wait staff": "[L] Wait Staff",
            "head wait staff": "[L] Head Wait Staff",
            "chef": "[L] Chef",
            "staff assistant": "[M] Staff Assistant",
            "shift leader": "[M] Shift Leader",
            "shift supervisor": "[M] Shift Supervisor",
            "advisor": "[M] Advisor",
            "assistant manager": "[H] Assistant Manager",
            "general manager": "[H] General Manager",
            "executive assistant": "[H] Executive Assistant",
            "exexutive director": "[H] Executive Director",
            "executive head": "[S] Executive Head",
            "board of directors": "[S] Board Of Directors",
            "corporate": "[S] Corporate",
            "developer": "[D] Developer"
          };
          
          const fullRank = rankMap[rank] || "Invalid Rank";
        
          if(fullRank == currentRank) return interaction.editReply(`${username} already has the rank ${currentRank}`)

          if(fullRank == "Invalid Rank") return interaction.editReply({
            content: "Please provide a valid rank",
          })


        if(await checkAllowance(runnerID, userId) === false) return interaction.editReply({
            content: "Unauthorized operation: the user you are trying to update has a rank that is equal to or above your own.",
        })

        const roleToUpdateTo = await noblox.getRole(group, fullRank);

        if(runnerRank <= roleToUpdateTo.rank) return interaction.editReply({
         content: "Unauthorized operation: the role you are trying to update to is equal to or above your own.",
        })


        try {
            await noblox.setRank(group, userId, fullRank)
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