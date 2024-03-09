const { EmbedBuilder } = require("discord.js");
const schedule = require('node-schedule');
const staffSchema = require("../../models/staffMember");
const generateToken = require("../../utils/generateToken");

module.exports = async (client) => {
  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = 5;
  rule.hour = 23;
  rule.minute = 5;

  schedule.scheduleJob(rule, async () => {
    await sendActivityEmbeds();
  });

  async function sendActivityEmbeds() {
    const activityChan = client.channels.cache.get("1215763529756315700");
    const allStaff = await staffSchema.find({});

    const guild = client.guilds.cache.get("959751115640029224");
    const inactivityRole = "1178013745163800668";



    const lowActivityUsers = allStaff.filter(user => user.messages < 50);
    const strikedUsers = [];

    for (const user of lowActivityUsers) {
      const member = await guild.members.fetch(user.userid);
      const isImmuneToQuota = user.isImmuneToQuota;
      if (!isImmuneToQuota && !user.inactivity.isOnInactivity) {
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
        strikedUsers.push(user.robloxuser);
        try {
          await userToNotify.send("⚠️ | You have been striked for failing to meet the weekly message requirement.");
        } catch (error) {
          continue;
        }
            }
    }

    const now = new Date();
    for (const user of allStaff) {
      console.log(user.inactivity.startDate)
      console.log(now)
      console.log(user.inactivity.startDate <= now)
      if (!user.inactivity.isOnInactivity && user.inactivity.startDate <= now) {
        console.log("entered if")
        await staffSchema.updateOne(
          { userid: user.userid },
          { $set: { "inactivity.isOnInactivity": true } }
        );
        const member = await guild.members.fetch(user.userid);
        await member.roles.add(inactivityRole);
      }

      

      if (user.inactivity.isOnInactivity && user.inactivity.endDate <= now) {
        await staffSchema.updateOne(
          { userid: user.userid },
          {
            $set: {
              "inactivity.isOnInactivity": false,
              "inactivity.startDate": null,
              "inactivity.endDate": null
            }
          }
        );
        const member = await guild.members.fetch(user.userid);
        await member.roles.remove(inactivityRole);
      }
    }

    console.log("Successfully checked inactivity status");

    

    const staffMembers = await staffSchema.find({});
    const lastMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - (now.getDay() === 0 ? 6 : 7));
    const lastSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const messagesRanking = staffMembers.map((user, index) => `\`${index + 1}\` <@${user.userid}> - ${user.messages}`).join("\n");

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

    const inactivityUsers = allStaff.filter(user => user.isOnInactivity);
    const inactivityEmbed = new EmbedBuilder()
      .setTitle("Users currently on inactivity")
      .setDescription(`${inactivityUsers.map(user => `<@${user.userid}>`).join("\n") || "None"}`)
      .setColor("#0000ff");

    activityChan.send({ embeds: [lbEmbed, lowActivityEmbed, inactivityEmbed] });

    if (strikedUsers.length) {
      activityChan.send(`Successfully striked users: ${strikedUsers.join(", ")}`);
    } else {
      activityChan.send("No one was striked!");
    }

    await Promise.all(allStaff.map(user => staffSchema.updateOne({ userid: user.userid }, { $set: { messages: 0 } })));

    console.log("Successfully sent weekly activity data");
  }
};
