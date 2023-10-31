const staffSchema = require("../../schemas/staffMember");

module.exports = {
    name: "mymessages",
    description: "Shows your messages for the week",

    run: async (client, interaction) => {
       await interaction.deferReply({ ephemeral: true}); 
       
        const memberId = interaction.user.id;
        const staffMember = await staffSchema.findOne({ userid: memberId });

        if (staffMember) {
            const messages = staffMember.messages;
            return interaction.editReply({
                content: `You currently have ${messages} messages`,
                ephemeral: true
            });
        } else {
            return interaction.editReply({
                content: "This command is only for staff members",
                ephemeral: true
            });
        }
    }
};
