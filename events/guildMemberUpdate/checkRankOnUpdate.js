const staffSchema = require("../../schemas/staffMember");
const noblox = require("noblox.js");
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
        const robloxUsername = userRecord.robloxuser;

        const wasStaffMember = (
            oldRoles.cache.has(middleRankRole) ||
            oldRoles.cache.has(highRankRole) ||
            oldRoles.cache.has(seniorHighRankRole) ||
            oldRoles.cache.has(leadershipTeamRole)
        );

        const isNotStaffMember = (
            !newRoles.cache.has(middleRankRole) &&
            !newRoles.cache.has(highRankRole) &&
            !newRoles.cache.has(seniorHighRankRole) &&
            !newRoles.cache.has(leadershipTeamRole)
        );

        if (wasStaffMember && isNotStaffMember) {
            await staffSchema.deleteOne({ userid: memberID });
        }

        if (oldRoles.cache.has(middleRankRole) && (
            newRoles.cache.has(highRankRole) ||
            newRoles.cache.has(seniorHighRankRole) ||
            newRoles.cache.has(leadershipTeamRole)
        )) {
            if (await isRankAbove75(robloxUsername)) {
                await staffSchema.updateOne({ userid: memberID }, { hasRankPerms: true });
            }
        }

        if (
            (oldRoles.cache.has(highRankRole) || oldRoles.cache.has(seniorHighRankRole) || oldRoles.cache.has(leadershipTeamRole)) &&
            newRoles.cache.has(middleRankRole)
        ) {
            await staffSchema.updateOne({ userid: memberID }, { hasRankPerms: false });
        }
    }
};

