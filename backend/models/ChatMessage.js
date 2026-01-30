const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Course",
        },
        senderRole: {
            type: String,
            enum: ["student", "teacher", "ai"],
            required: true,
        },
        isAI: {
            type: Boolean,
            default: false,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
