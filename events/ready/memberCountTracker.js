const getMemberCount = require("../../utils/getMemberCount");
const fs = require("fs").promises;
const { EmbedBuilder } = require("discord.js");

module.exports = async(client) => {
    let lastMemberCount = await getMemberCount();

    const memChannel = client.channels.cache.get("1097184023245234258");
    const VC = client.channels.cache.get("1097183583866716202");
    const memberJoinedEmbed = new EmbedBuilder()
        .setTitle("New member joined")
        .setColor("Aqua")
        .setThumbnail("https://cdn.discordapp.com/attachments/1076652520149110894/1086038285501083771/krestia_cafe.png");
    const memberLeftEmbed = new EmbedBuilder()
        .setTitle("Member left")
        .setColor("Red")
        .setThumbnail("https://cdn.discordapp.com/attachments/1076652520149110894/1086038285501083771/krestia_cafe.png");

    async function updateMemberCount() {
        try {
            const data = await fs.readFile("goal.json", "utf8");
            const jsonData = JSON.parse(data);
            const currentCount = await getMemberCount();

            if (currentCount && currentCount !== lastMemberCount) {
                const currentTarget = jsonData.goal;
                const amountLeft = currentTarget - currentCount;

                if (amountLeft === 0) {
                    memberJoinedEmbed.setDescription(`We now have ${currentCount} members! We have reached our goal! 🥳`);
                    memberJoinedEmbed.setFooter({ text: `New goal: ${currentTarget + 50}` });
                } else {
                    memberJoinedEmbed.setDescription(`We now have ${currentCount} members! Only ${amountLeft} to go to reach our goal of ${currentTarget}!`);
                }

                memberLeftEmbed.setDescription(`We now have ${currentCount} members! Only ${amountLeft} to go to reach our goal of ${currentTarget}!`);

                if (currentCount > lastMemberCount) {
                    await memChannel.send({ embeds: [memberJoinedEmbed] });
                } else if (currentCount < lastMemberCount) {
                    await memChannel.send({ embeds: [memberLeftEmbed] });
                }

                if (currentCount >= currentTarget) {
                    let newGoal = currentTarget + 50;
                    jsonData.goal = newGoal;
                    const updatedGoalData = JSON.stringify(jsonData, null, 2);

                    try {
                        await fs.writeFile("goal.json", updatedGoalData, "utf8");
                        console.log(`Goal updated to ${newGoal}`);
                    } catch (err) {
                        console.error("Error writing to goal.json:", err);
                    }
                }

                await VC.setName(`Group Members: ${currentCount}`);
                lastMemberCount = currentCount;
            }
        } catch (err) {
            console.error("Error updating member count:", err);
        } finally {
            setTimeout(updateMemberCount, 60 * 1000); 
        }
    }

    updateMemberCount(); 
}
