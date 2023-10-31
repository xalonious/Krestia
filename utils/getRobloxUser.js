const Schema = require("../schemas/staffMember")
module.exports = async (id) => {
    const user = await Schema.findOne({ userid: id });
    if (!user) {
      return null;
    }
    return user.robloxuser;

}
