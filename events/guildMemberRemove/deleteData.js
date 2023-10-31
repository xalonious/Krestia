const messageSchema = require("../../schemas/messages")
const staffSchema = require("../../schemas/staffMember")

module.exports = async(client, guildMember) => {
    let user = await messageSchema.findOne({ userid: guildMember.user.id });
    if(user) {
      await messageSchema.deleteOne({ userid: guildMember.user.id})
      console.log(`Deleted messages data for ${guildMember.user.tag}`)
    }
  
    let staffUser = await staffSchema.findOne({ userid: guildMember.user.id })
    if(staffUser) {
      await staffSchema.deleteOne({ userid: guildMember.user.id })
      console.log(`Deleted staff data for ${guildMember.user.tag}`)
    }
  
}