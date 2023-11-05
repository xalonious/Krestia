const messageSchema = require("../../schemas/messages")
const staffSchema = require("../../schemas/staffMember")

module.exports = async(client, guildMember) => {
  await Promise.all([
    messageSchema.findOneAndDelete({ userid: guildMember.user.id }),
    staffSchema.findOneAndDelete({ userid: guildMember.user.id })
  ]);
}