const { EmbedBuilder } = require("discord.js");
const schedule = require('node-schedule');
const now = new Date();
const staffSchema = require("../../schemas/staffMember");
const generateToken = require("../../utils/generateToken");

module.exports = async (client) => {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = 1;
  rule.hour = 6;
  rule.minute = 0;

  schedule.scheduleJob(rule, async () => {
    await sendActivityEmbeds();
  });

  async function sendActivityEmbeds() {
    const activityChan = client.channels.cache.get("1100846300309770432");
    const allStaff = await staffSchema.find({});
    const lowActivityUsers = allStaff.filter(user => user.messages < 50);
    const guild = client.guilds.cache.get("1074154728545583174");
    const inactivityRole = "1100853944353300500";
    const inactivityUsers = [];
   for (const user of allStaff) {
      const member = await guild.members.fetch(user.userid);
      if (member.roles.cache.has(inactivityRole)) {
        inactivityUsers.push(user);
      }
    }
    const strikedUsers = [];

    for (const user of lowActivityUsers) {
      const member = await guild.members.fetch(user.userid);
      const hasInactivityRole = member.roles.cache.get(inactivityRole);
      if (!hasInactivityRole) {
        let strikeId = generateToken();
        let strikeExists = await staffSchema.findOne({ "strikes.strikeId": strikeId });
        while (strikeExists) {
          strikeId = generateToken();
          strikeExists = await staffSchema.findOne({ "strikes.strikeId": strikeId });
        }
        const strike = {
          strikeId: strikeId,
          amount: (user.strikes?.length ?? 0) + 1,
          reason: "Failed to meet 50 weekly messages requirement",
        };
        await staffSchema.updateOne({ userid: user.userid }, { $push: { strikes: strike } });
        const userToNotify = await client.users.fetch(user.userid);
        userToNotify.send("⚠️ | You have been striked for failing to meet the weekly message requirement.");
        strikedUsers.push(user.robloxuser);
      }
    }

    const staffMembers = await staffSchema.find({});
    const lastMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 6);
    const lastSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const users = staffMembers.slice().sort((a, b) => b.messages - a.messages);
    const messagesRanking = users.map((user, index) => `\`${index + 1}\` <@${user.userid}> - ${user.messages}`).join("\n");

    const lbEmbed = new EmbedBuilder()
      .setAuthor({
        name: `Staff message count - ${lastMonday.toLocaleDateString()} - ${lastSunday.toLocaleDateString()}`,
        iconURL: "https://cdn.discordapp.com/attachments/1076652520149110894/1086038285501083771/krestia_cafe.png",
      })
      .setDescription(`**Messages ranking**\n\n${messagesRanking}`)
      .setColor("#ff69b4");

    const lowActivityEmbed = new EmbedBuilder()
      .setTitle("Failed messages requirement")
      .setDescription(`${lowActivityUsers.length ? `The following staff members have failed this week's message requirements:\n\n${lowActivityUsers.map(user => `<@${user.userid}>`).join("\n")}` : "No one"}`)
      .setColor("#ff0000");

    const inactivityEmbed = new EmbedBuilder()
      .setTitle("Users currently exempt")
      .setDescription(`${inactivityUsers.map(user => `<@${user.userid}>`).join("\n") || "None"}`)
      .setColor("#0000ff");

    activityChan.send({ embeds: [lbEmbed, lowActivityEmbed, inactivityEmbed] });

    if (strikedUsers.length) {
      activityChan.send(`Successfully striked users: ${strikedUsers.join(", ")}`);
    } else {
      activityChan.send("No one was striked!");
    }

    await Promise.all(allStaff.map(user => staffSchema.updateOne({ userid: user.userid }, { $set: { messages: 0 } })));

    console.log("Succesfully sent weekly activity data");
  }
};
