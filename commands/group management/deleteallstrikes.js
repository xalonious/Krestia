const staffSchema = require("../../schemas/staffMember");

module.exports = {
    name: "deleteallstrikes",
    description: "deletes all strikes",

    run: async(client, interaction) => {
        await interaction.deferReply();

        const shrRoles = ["1089485004654006272", "1089484325931720734"]

        const isShr = interaction.member.roles.cache.some(role => shrRoles.includes(role.id));

        if(!isShr) return interaction.editReply("Only SHRs can use this command");
        
        await staffSchema.updateMany({}, { strikes: [] });

        await interaction.editReply("All strikes have been deleted.");


    }
}