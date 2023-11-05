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
    }
};
