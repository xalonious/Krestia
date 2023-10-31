const staffSchema = require("../../schemas/staffMember");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.id !== "1074391258333716581") return;

    const memberid = message.author.id;
    const staffMember = await staffSchema.findOne({ userid: memberid });

    if (staffMember) {
        staffMember.messages++;
        await staffMember.save();
    }
};
