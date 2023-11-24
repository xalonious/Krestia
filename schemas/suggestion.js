const mongoose = require("mongoose")
const { randomUUID } = require("crypto")

const suggestionSchema = new mongoose.Schema({
    suggestionId: {
        type: String,
        default: randomUUID()
    },
    authorId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    upvotes: {
        type: [String],
        default: []
    },
    downvotes: {
        type: [String],
        default: []
    },
    
}, {
    timestamps: true
})

module.exports = mongoose.model("suggestion", suggestionSchema)