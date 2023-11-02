const { ApplicationCommandOptionType } = require("discord.js");
const staffSchema = require('../../schemas/staffMember');

module.exports = {
    name: "strike",
    description: "strikes a staff member",
    options: [
        {
            name: "user",
            description: "The user to strike",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "reason",
            description: "The reason for the strike",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        await interaction.deferReply();

                const roleIdsToCheck = ["1089485004654006272", "1089484325931720734"];

        const isShr = interaction.member.roles.cache.some(role => roleIdsToCheck.includes(role.id));

        if (!isShr) {
            return interaction.editReply("Only SHRs can use this command");
        }

        const staffMember = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const staffDocument = await staffSchema.findOne({ userid: staffMember.id });

        if (!staffDocument) {
            return interaction.editReply(`The specified user is not in the staff database.`);
        }

        const strike = {
            strikeId: generateToken(),
            amount: staffDocument.strikes ? staffDocument.strikes.length + 1 : 1,
            reason: reason,
        };

        await staffSchema.updateOne({ userid: staffMember.id }, { $push: { strikes: strike } });

        interaction.editReply(`Successfully striked ${staffDocument.robloxuser} for: ${reason}`);

        const userToNotify = await client.users.fetch(staffMember.id);
        userToNotify.send(`⚠️ | You have been striked for: ${reason}`);
    },
};

function generateToken() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 11; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}