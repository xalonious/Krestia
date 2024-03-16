const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
require("dotenv").config()
const noblox = require("noblox.js")
const group = process.env.GROUP
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")


module.exports = {
    name: "exile",
    description: "exiles a user from the group",
    highRankOnly: true,
    options: [
        {
            name: "username",
            description: "the user to exile",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "reason",
            description: "reason for the exile",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async(client, interaction) => {

        await interaction.deferReply()
        
        const runnerid = interaction.member.id 

        const runnerUser = await getRobloxUser(runnerid)
        

        const runnerrobloxid = await noblox.getIdFromUsername(runnerUser)

        const runnerRank = await noblox.getRankInGroup(group, runnerrobloxid)




        




        const username = interaction.options.getString("username")




        
            const userId = await noblox.getIdFromUsername(username)
            if(userId == null) {
                return interaction.editReply({
                    content: "The specified username does not exist",
                })
            }
            let currentRank = await noblox.getRankNameInGroup(group, userId)
            
            
            


    

            


            

            if(runnerRank < 95) {
                return interaction.editReply({
                    content: "Only SHRs are able to exile other users."
                })
            }





        const runnerID = await noblox.getIdFromUsername(runnerUser)


        const isMember = await noblox.getRankInGroup(group, userId)
        

        if(isMember == 0) {
            return interaction.editReply({
                content: "The specified roblox user is not in the group.",
            })
        }


        if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
            content: "Unauthorized Operation: the user you are trying to exile has a role that is equal to or above your own.",
         })
        
                   if((currentRank == "[P] Vice-President") || (currentRank == "[P] President") || (currentRank == "[A] Automation")) return interaction.editReply("Their rank is the same as or above mine, I can't do that")
       
        
            try {
                await noblox.exile(group, userId)
            await interaction.editReply(`Succesfully exiled ${username}!`)


           
        } catch(error) {
            interaction.editReply({
                content: "An error occured, if the issue persists please contact the developer."
              })
              return console.log(error)
             }


            const userAvatar = await noblox.getPlayerThumbnail(userId, 420, "png", false)
            const embedimage = userAvatar[0].imageUrl

            let exileReason = interaction.options.getString("reason")
            if(!exileReason) exileReason = "No reason given"

            let logging = new EmbedBuilder()
            .setTitle("User exiled")
            .setDescription("Someone was exiled from the group")
            .addFields(
                {name: "Username", value: username},
                {name: "Responsible user", value: runnerUser},
                {name: "Reason", value: exileReason}
            )
            
            .setColor("Red")
            .setThumbnail(embedimage)

            const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

            logschan.send({ embeds: [logging]}) 

    }, 
}