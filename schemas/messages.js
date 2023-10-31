const mongoose = require("mongoose")
let Schema = new mongoose.Schema({
  userid: String,
  messages: Number,
})

module.exports = mongoose.model("messages", Schema)