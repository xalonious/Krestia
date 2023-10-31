const mongoose = require('mongoose');

const staffMemberSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  robloxuser: { type: String, required: true },
  messages: { type: Number, required: true },
  hasRankPerms: { type: Boolean, required: true },
  strikes: [
    {
      _id: false, 
      strikeId: { type: String, required: true },
      amount: { type: Number, required: true },
      reason: { type: String, required: true },
    },
  ],
});

const StaffMember = mongoose.model('staffMember', staffMemberSchema);

module.exports = StaffMember;
