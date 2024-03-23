const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js")
const noblox = require("noblox.js")
require("dotenv").config()
const getUserAvatar = require("../../utils/getUserAvatar")


module.exports = {
    name: "whois",
    description: "shows information about a roblox user",
    options: [
        {
            name: "user",
            description: "the roblox user to get info for",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async(client, interaction) => {
        await interaction.deferReply();
        
        const robloxuser = interaction.options.getString("user")

        const userId = await noblox.getIdFromUsername(robloxuser)
        if(userId == null) {
            return interaction.editReply({
                content: "The specified username does not exist",
                ephemeral: true
            })
        }

        const avatarImage = await getUserAvatar(userId)
        

        const groupRank = await noblox.getRankNameInGroup(process.env.GROUP, userId)

        const info = await noblox.getPlayerInfo(userId)


        const infoEmbed = new EmbedBuilder()
        .setTitle(`Info for ${info.username}`)
        
        .setThumbnail(avatarImage)
        .addFields(
            {name: "Display name", value: info.displayName, inline: true},
            {name: "Username", value: info.username, inline: true},
            {name: "User ID", value: `${userId}`, inline: true},
            {name: "Join date", value: info.joinDate.toDateString(), inline: true},
            {name: "Past usernames", value: info.oldNames.length ? info.oldNames.join("\n") : "None", inline: true},
            {name: "Rank in group", value: groupRank, inline: true},
            {name: "Friends", value: info.friendCount.toString(), inline: true},
            {name: "Followers", value: info.followerCount.toString(), inline: true},
            {name: "Following", value: info.followingCount.toString(), inline: true}
        )
        .setColor("Random")

        await interaction.editReply({embeds: [infoEmbed]})
    }
}