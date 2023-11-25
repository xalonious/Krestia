const mongoose = require("mongoose")

let TicketSchema = new mongoose.Schema({
    MemberID: String,
    TicketID: String,
    ChannelID: String,
    Closed: Boolean,
    Type: String
})

module.exports = mongoose.model("tickets", TicketSchema)