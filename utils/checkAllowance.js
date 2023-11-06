const noblox = require("noblox.js")
require("dotenv").config()
module.exports = async (runnerID, targetID) => {
    const runnerRankID = await noblox.getRankInGroup(process.env.GROUP, runnerID)
    const targetRankID = await noblox.getRankInGroup(process.env.GROUP, targetID)
     if(runnerRankID > targetRankID) {
        return true
     } else return false;
  }
