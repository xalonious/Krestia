const staffSchema = require("../../schemas/staffMember")
const { EmbedBuilder } = require("discord.js")
const noblox = require("noblox.js")
require("dotenv").config()

module.exports = {
    name: "me",
    description: "Shows your staff information",

    run: async(client, interaction) => {

        await interaction.deferReply()

        const staffData = await staffSchema.findOne({ userid: interaction.user.id })
        if(!staffData) return interaction.editReply("This command is only for staff members")

        const rankInGroup = await noblox.getRankNameInGroup(process.env.GROUP, await noblox.getIdFromUsername(staffData.robloxuser))

        const staffEmbed = new EmbedBuilder()
            .setTitle("Your Staff info")
            .addFields(
                { name: "User", value: `${interaction.member}`},
                { name: "Roblox Username", value: staffData.robloxuser },
                { name: "Rank in Group", value: rankInGroup },
                { name: "Weekly Messages", value: `${staffData.messages}` },
                { name: "Is on Inactivity?", value: staffData.inactivity.isOnInactivity ? "Yes" : "No" }
            );

        if (staffData.inactivity.isOnInactivity) {
            const startDate = staffData.inactivity.startDate ? staffData.inactivity.startDate.toLocaleDateString("en-GB") : "N/A";
            const endDate = staffData.inactivity.endDate ? staffData.inactivity.endDate.toLocaleDateString("en-GB") : "N/A";
            staffEmbed.addFields(
                { name: "Start Date", value: startDate },
                { name: "End Date", value: endDate }
            );
        }

        if (staffData.strikes.length === 0) {
            staffEmbed.addFields({ name: "Strikes", value: "None" });
        } else {
            staffEmbed.addFields({ name: "Strikes", value: staffData.strikes.map((strike, index) => `#${index + 1}: ${strike.reason}`).join("\n") });
        }

        staffEmbed.setColor("Blurple")
        const robloxuserID = await noblox.getIdFromUsername(staffData.robloxuser)
        const userAvatar = await noblox.getPlayerThumbnail(robloxuserID, 420, "png", false)
        staffEmbed.setThumbnail(userAvatar[0].imageUrl)
        

        await interaction.editReply({ embeds: [staffEmbed] })

    }
}