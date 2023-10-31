const { ActivityType } = require("discord.js")
module.exports = (client) => {
    console.log(`✅  | ${client.user.tag}`)
    client.user.setPresence({
        activities: [{ name: "Krestia", type: ActivityType.Watching }],
      });
}