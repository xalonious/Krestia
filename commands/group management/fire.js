require("dotenv").config()
const noblox = require("noblox.js")
const group = process.env.GROUP
const checkAllowance = require("../../utils/checkAllowance")
const getRobloxUser = require("../../utils/getRobloxUser")
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")

module.exports = {
   name: "fire",
   description: "fires a user in the group",
   highRankOnly: true,
   options: [
    {
        name: "username",
        description: "the user to fire",
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: "reason",
        description: "the reason why the user is being fired",
        type: ApplicationCommandOptionType.String,
        required: false
    }
   ],

   run: async(client, interaction) => {

    await interaction.deferReply()


        const runnerid = interaction.member.id
        const username = interaction.options.getString("username")
        
                    const runnerUser = await getRobloxUser(runnerid)


        const userId = await noblox.getIdFromUsername(username)
        if(userId == null) {
            return interaction.editReply("The specified username does not exist")
        }
        let currentRank = await noblox.getRankNameInGroup(group, userId)
        if(currentRank == "Customer") return interaction.editReply("That user is a customer, they cannot be fired.")
            


            

            const runnerID = await noblox.getIdFromUsername(runnerUser)


            const isMember = await noblox.getRankInGroup(group, userId)
        

            if(isMember == 0) {
                return interaction.editReply({
                    content: "The specified roblox user is not in the group.",
                })
            }


            if(!await checkAllowance(runnerID, userId)) return interaction.editReply({
                content: "Unauthorized rank change: the user you are trying to fire has a role that is equal to or above your own.",
             })
       
      if((currentRank == "[P] Vice-President") || (currentRank == "[P] President") || (currentRank == "[A] Automation")) return interaction.editReply("Their rank is the same as or above mine, I can't do that")

         try {
            await noblox.setRank(group, userId, "Customer")
         interaction.editReply(`Succesfully fired ${username}!`)


        
        } catch(error) {
            interaction.editReply({
                content: "An error occured, if the issue persists please contact the developer.",
              })
              return console.log(error)
             }

         const userAvatar = await noblox.getPlayerThumbnail(robloxuserID, 420, "png", false)
         const embedimage = userAvatar[0].imageUrl

         let reason = interaction.options.getString("reason")
         if(!reason) reason = "No reason given"

         let logging = new EmbedBuilder()
         .setTitle("User fired")
         .setDescription("Someone was fired from the staff team")
         .addFields(
            {name: "Username", value: username},
            {name: "Reason", value: reason},
            {name: "Responsible user", value: runnerUser}
         )
         .setColor("Red")
         .setThumbnail(embedimage)

         const logschan = interaction.guild.channels.cache.get(process.env.LOGSCHAN) 

         logschan.send({embeds: [logging]})
    }
}