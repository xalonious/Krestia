const noblox = require("noblox.js")
const db = require("../../schemas/staffMember")
const axios = require("axios")
require("dotenv").config()

module.exports = {
    name: "verify",
    description: "Verify your Roblox user to your Discord account, allowing you to use the ranking commands.",

    run: async (client, interaction) => {
        await interaction.deferReply();

        const userid = interaction.user.id;

        const alreadyVerified = await db.findOne({ userid: userid });

        if (alreadyVerified) {
            return interaction.editReply({
                content: `You are already verified.`,
            });
        }

        const bloxlinkResponse = await axios.get(`https://api.blox.link/v4/public/guilds/${interaction.guild.id}/discord-to-roblox/${userid}`, {
            headers: {
                Authorization: process.env.BLOXLINK_API_KEY
            }
        });

        if (bloxlinkResponse.data.error) {
            return interaction.editReply({
                content: `You are not linked to a Roblox account. Please link your account using Bloxlink before using this command.`
            });
        }

        const robloxuserid = bloxlinkResponse.data.robloxID;
        const robloxuser = await noblox.getUsernameFromId(robloxuserid);

        const rankInGroup = await noblox.getRankInGroup(process.env.GROUP, robloxuserid);

        if (rankInGroup < 55) {
            return interaction.editReply({
                content: "This command is only for high ranks.",
            });
        }

        if (rankInGroup === 198) {
            return interaction.editReply("This command is not available for developers.");
        }

        const existingRobloxUser = await db.findOne({ robloxuser: robloxuser });
        if (existingRobloxUser) {
            return interaction.editReply({
                content: `Username ${robloxuser} is already linked to another Discord account.`,
            });
        }

        let hasRankPerms = rankInGroup >= 75;

        const newUser = new db({
            userid: userid,
            robloxuser: robloxuser,
            messages: 0,
            hasRankPerms: hasRankPerms,
            strikes: []
        });
        

        await newUser.save();

        interaction.editReply(`You have succesfully been verified as ${robloxuser}!`)

       
    }
}
