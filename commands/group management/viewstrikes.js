const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const staffSchema = require('../../schemas/staffMember');

module.exports = {
    name: "viewstrikes", 
    description: "Displays strikes for a user",
    permissionsRequired: [PermissionsBitField.Flags.ManageMessages],
    options: [
        {
            name: "user",
            description: "The user to display strikes for",
            type: ApplicationCommandOptionType.User,
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

        const user = interaction.options.getUser("user");
        const userId = user.id;

        const staffMember = await staffSchema.findOne({ userid: userId });
        
        if(!staffMember) return interaction.editReply("That user is not a staff member.")
        
        if (staffMember.strikes.length == 0) {
            return interaction.editReply("No strikes found for that user.");
        }

        const strikeEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${user.username}'s strikes`)
            .setDescription(
                staffMember.strikes
                    .map((strike, index) => `\`${index + 1}\` - ID: ${strike.strikeId}\nReason: ${strike.reason}`)
                    .join("\n\n")
            )
            .setFooter({ text: `Total strikes: ${staffMember.strikes.length}` })
            .setThumbnail(user.displayAvatarURL());

        interaction.editReply({ embeds: [strikeEmbed] });
    },
};
