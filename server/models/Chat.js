const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
{
    userId: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        required: true,
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Chat", chatSchema);