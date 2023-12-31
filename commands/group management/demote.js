const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const noblox = require("noblox.js")
require("dotenv").config()
const group = process.env.GROUP
const getUserAvatar = require("../../utils/getUserAvatar")
const extractRankName = require("../../utils/extractRankName")
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")


module.exports = {
    name: "demote",
    description: "demotes a user in the group",
    highRankOnly: true,
    options: [
        {
            name: "username",
            description: "the user to demote",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

   run: async(client, interaction) => {

        await interaction.deferReply()

        const runnerid = interaction.member.id 




        const username = interaction.options.getString("username")
        
        const runnerUser = await getRobloxUser(runnerid)

  
            const userId = await noblox.getIdFromUsername(username)
            if(userId == null) {
                return interaction.editReply({
                    content: "The specified username does not exist",
                    ephemeral: true
                })
            }
            let currentRank = await noblox.getRankNameInGroup(group, userId)
            


            

        const runnerID = await noblox.getIdFromUsername(runnerUser)


        const isMember = await noblox.getRankInGroup(group, userId)
        

        if(isMember == 0) {
            return interaction.editReply({
                content: "The specified roblox user is not in the group.",
            })
        }

        if(isMember == 1) {
            return interaction.editReply({
                content: "That user is a customer, I can't demote them.",
            })
        }
        
    


         if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
            content: "Unauthorized rank change: the user you are trying to demote has a role that is equal to or above your own.",
         })
        
                    if((currentRank == "[P] Vice-President") || (currentRank == "[P] President") || (currentRank == "[A] Automation")) return interaction.editReply("Their rank is the same as or above mine, I can't do that")
       
        
            try {
               await noblox.demote(group, userId)
               let newRank = await noblox.getRankNameInGroup(group, userId)
               const newRankName = extractRankName(newRank)
            interaction.editReply(`Succesfully demoted ${username} to **${newRankName}**!`)


           
            } catch(error) {
                interaction.editReply({
                    content: "An error occured, if the issue persists please contact the developer.",
                  })
              return console.log(error)
                 }
            

            let newRank = await noblox.getRankNameInGroup(group, userId)

            const embedimage = await getUserAvatar(userId)

            let logging = new EmbedBuilder()
            .setTitle("User demoted")
            .setDescription("Someone was demoted in the group")
            .addFields(
                {name: "Username", value: username},
                {name: "Old rank", value: currentRank},
                {name: "New rank", value: newRank},
                {name: "Responsible user", value: runnerUser}
            )
            
            .setColor("Red")
            .setThumbnail(embedimage)

            const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

            logschan.send({ embeds: [logging]}) 

    },
}