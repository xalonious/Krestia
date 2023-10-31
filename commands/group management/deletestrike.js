const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const staffSchema = require('../../schemas/staffMember');

module.exports = {
    name: "deletestrike",
    description: "Deletes a specific strike by ID",
    permissionsRequired: [PermissionsBitField.Flags.ManageMessages],
    options: [
        {
            name: "strikeid",
            description: "The ID of the strike to delete",
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

        const strikeId = interaction.options.getString("strikeid");

        const staffMembers = await staffSchema.find({});

        let strikeDeleted = false;

        for (const staffMember of staffMembers) {
            let strikes = staffMember.strikes || [];
            const strikeIndex = strikes.findIndex((strike) => strike.strikeId === strikeId);

            if (strikeIndex !== -1) {
                strikes.splice(strikeIndex, 1);

                strikes = strikes.map((strike, index) => {
                    strike.amount = index + 1;
                    return strike;
                });

                await staffSchema.updateOne({ userid: staffMember.userid }, { strikes: strikes });
                strikeDeleted = true;
            }
        }

        if (strikeDeleted) {
			interaction.editReply(`Strike with ID \`${strikeId}\` has been deleted.`);
        } else {
            interaction.editReply("No strike found with that ID.");
        }
    },
};
