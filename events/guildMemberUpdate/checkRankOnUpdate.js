const staffSchema = require("../../schemas/staffMember");
const noblox = require("noblox.js");
const axios = require("axios")
require("dotenv").config()

module.exports = async (client, oldMember, newMember) => {
    const { roles: oldRoles } = oldMember;
    const { roles: newRoles } = newMember;
    const memberID = newMember.user.id;

    const middleRankRole = "1089485777345466439";
    const highRankRole = "1089485564329345125";
    const seniorHighRankRole = "1089485004654006272";
    const leadershipTeamRole = "1089484325931720734";

    const isRankAbove75 = async (robloxUsername) => {
        const robloxUserId = await noblox.getIdFromUsername(robloxUsername);
        const rankInGroup = await noblox.getRankInGroup(process.env.GROUP, robloxUserId);
        return rankInGroup >= 75;
    };

    const userRecord = await staffSchema.findOne({ userid: memberID });
    if (userRecord) {
        const { cache: oldCache } = oldRoles;
        const { cache: newCache } = newRoles;
        const robloxUsername = userRecord.robloxuser;

        const wasStaffMember = [middleRankRole, highRankRole, seniorHighRankRole, leadershipTeamRole].some(role => oldCache.has(role));
        const isNotStaffMember = [middleRankRole, highRankRole, seniorHighRankRole, leadershipTeamRole].every(role => !newCache.has(role));

        if (wasStaffMember && isNotStaffMember) {
            await staffSchema.deleteOne({ userid: memberID });
        }

        switch (true) {
            case newCache.has(highRankRole):
            case newCache.has(seniorHighRankRole):
            case newCache.has(leadershipTeamRole):
                if (await isRankAbove75(robloxUsername)) {
                    await staffSchema.updateOne({ userid: memberID }, { hasRankPerms: true });
                }
                break;
            case newCache.has(middleRankRole):
                await staffSchema.updateOne({ userid: memberID }, { hasRankPerms: false });
                break;
        }
    } else {
        const { cache: oldCache } = oldRoles;
        const { cache: newCache } = newRoles;
        const hasStaffRole = [middleRankRole, highRankRole, seniorHighRankRole, leadershipTeamRole].some(role => newCache.has(role));
        const wasNotStaffMember = [middleRankRole, highRankRole, seniorHighRankRole, leadershipTeamRole].every(role => !oldCache.has(role));
        if (hasStaffRole && wasNotStaffMember) {
            const { data } = await axios.get(`https://api.blox.link/v4/public/guilds/${oldMember.guild.id}/discord-to-roblox/${memberID}`, {
                headers: {
                    Authorization: process.env.BLOXLINK_API_KEY
                }
            });
            if (data.robloxID) {
                const robloxUsername = await noblox.getUsernameFromId(data.robloxID);
                const rankInGroup = await noblox.getRankInGroup(process.env.GROUP, data.robloxID);
                if (rankInGroup >= 55) {
                    const hasRankPerms = rankInGroup >= 75;
                    const isImmuneToQuota = rankInGroup >= 198
                    const today = new Date();
                    const nextSunday = new Date();
                    nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);

                    await staffSchema.create({
                        userid: memberID,
                        robloxuser: robloxUsername,
                        messages: 0,
                        hasRankPerms,
                        strikes: [], 
                        isImmuneToQuota: isImmuneToQuota,
                        inactivity: {
                            isOnInactivity: true,
                            startDate: today,
                            endDate: nextSunday
                        }

                    });
                }
            } else {
                console.log(`User with ID ${memberID} is not linked to Bloxlink.`);
            }
        }
    }
};