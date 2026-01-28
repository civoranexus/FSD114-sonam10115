const User = require('../../models/User')
const ChatMessage = require("../../models/ChatMessage");
const { getAIReply } = require("../../service/aiService");

const isTeacherOnline = (teacher) => {
    if (!teacher.lastActive) return false;

    const now = new Date();
    const diffInMinutes = (now - teacher.lastActive) / 60000;

    return diffInMinutes < 5; // last 5 min active = online
};

exports.sendMessage = async (req, res) => {
    const { receiverId, courseId, message } = req.body;

    const student = req.user;
    const teacher = await User.findById(receiverId);

    // Save student message
    await ChatMessage.create({
        senderId: student.id,
        receiverId,
        courseId,
        senderRole: "student",
        message
    });

    // 👇 HERE isTeacherOnline is used
    if (!isTeacherOnline(teacher)) {
        const aiReply = await getAIReply(message, courseId);

        const aiMessage = await ChatMessage.create({
            senderId: "AI_SYSTEM",
            receiverId: student.id,
            courseId,
            senderRole: "ai",
            isAI: true,
            message: aiReply
        });

        return res.json({ replyType: "ai", message: aiMessage });
    }

    res.json({ replyType: "teacher", message: "Teacher is online" });
};

exports.fetchMessages = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        const messages = await ChatMessage.find({
            courseId,
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id },
            ],
        }).sort({ createdAt: 1 });

        res.json({
            success: true,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }
};

