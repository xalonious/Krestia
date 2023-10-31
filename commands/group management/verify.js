const { ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");
const noblox = require("noblox.js")
const db = require("../../schemas/staffMember")
const getUserAvatar = require("../../utils/getUserAvatar")
require("dotenv").config()

module.exports = {
    name: "verify",
    description: "Verify your Roblox user to your Discord account, allowing you to use the ranking commands.",
    options: [
        {
            name: "user",
            description: "Your Roblox username",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {
        await interaction.deferReply();

        const robloxuser = interaction.options.getString("user");
        const robloxuserid = await noblox.getIdFromUsername(robloxuser);
        const userid = interaction.user.id;

        const alreadyVerified = await db.findOne({ userid: userid });

        if (alreadyVerified) {
            return interaction.editReply({
                content: `You are already verified.`,
            });
        }

        if (robloxuserid == null) {
            return interaction.editReply({
                content: `${robloxuser} is not a valid Roblox username.`,
            });
        }

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

        const randomEmojis = [
            "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😇", "😉", "😊", "🙂", "🙃", "😋",
            "😌", "😍", "😜", "🤪", "😝", "😛", "🤑", "🤗", "🤭", "🤫", "🤔", "🙄", "😲", "🤓", "😎"
        ];

        const selectedString = pickRandomEmojis(randomEmojis, 5);

        const avatarImage = await getUserAvatar(robloxuserid);

        let hasRankPerms = rankInGroup >= 75; // Set hasRankPerms based on rankInGroup

        const verifyEmbed = new EmbedBuilder()
            .setTitle(`Hello ${robloxuser}!`)
            .setDescription("To verify that you own this account, please put the code below in your Roblox bio.")
            .addFields({ name: "Your code:", value: `\`${selectedString}\`` })
            .setColor("Random")
            .setFooter({ text: "Once the code has been added, say 'done', or anything else to cancel." })
            .setThumbnail(avatarImage);

        await interaction.editReply({ embeds: [verifyEmbed] });

        const filter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
            filter,
            time: 120000,
        });

        collector.on("collect", async (m) => {
            if (m.content.toLowerCase() === "done") {
                collector.stop();
                const playerinfo = await noblox.getPlayerInfo(robloxuserid);
                const blurb = playerinfo.blurb;
                if (blurb.includes(selectedString)) {
                    const newUser = new db({
                        userid: userid,
                        robloxuser: robloxuser,
                        messages: 0,
                        hasRankPerms: hasRankPerms, // Set hasRankPerms here
                        strikes: [],
                    });
                    await newUser.save();

                    return interaction.followUp(`You have successfully been verified as ${robloxuser}!`);
                } else {
                    return interaction.followUp("Failed to find the code in your Roblox bio, please try again.");
                }
            } else {
                await interaction.followUp("Verification canceled.");
                collector.stop();
            }
        });

        collector.on("end", async (collected) => {
            if (collected.size === 0) {
                await interaction.followUp("Verification timed out.");
            }
        })
    }
}


function pickRandomEmojis(array, num) {
  let result = "";
  const arrayLength = array.length;
  
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * arrayLength);
    result += array[randomIndex];
  }
  
  return result;
}
