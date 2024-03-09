const mongoose = require("mongoose");

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
    isImmuneToQuota: { type: Boolean, required: true, default: false },
    inactivity: {
        isOnInactivity: { type: Boolean, required: true, default: false },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null }
    }
});

module.exports = mongoose.model("staffMember", staffMemberSchema);
