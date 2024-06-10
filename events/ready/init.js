const mongoose = require("mongoose");
const noblox = require("noblox.js")
const { ActivityType } = require("discord.js"); 
require("dotenv").config();

module.exports = async (client) => {

    console.log(`✅ | ${client.user.tag}`)
    client.user.setPresence({
        activities: [{ name: "Krestia", type: ActivityType.Watching }],
    });

    await mongoose.connect(process.env.MONGOURL);
    console.log("✅ | Connected to DB")

    noblox.setCookie(process.env.COOKIE).then((user) => console.log(`✅ | Logged in as ${user.UserName}`))
}