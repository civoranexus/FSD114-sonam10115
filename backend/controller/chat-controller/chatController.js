const mongoose = require("mongoose");
const User = require("../../models/User");
const ChatMessage = require("../../models/ChatMessage");
const { getAIReply } = require("../../service/aiService");

/* -------------------- HELPER -------------------- */
const isTeacherOnline = (teacher) => {
    if (!teacher) {
        console.log("❌ Teacher not found");
        return false;
    }

    if (!teacher.lastActive) {
        console.log("⏱️  Teacher has no lastActive timestamp - will trigger AI");
        return false;
    }

    const now = new Date();
    const diffInMinutes = (now - teacher.lastActive) / 60000;
    const isOnline = diffInMinutes < 5;

    console.log(`📊 Teacher online check: ${diffInMinutes.toFixed(2)} minutes since last active. Online: ${isOnline}`);

    return isOnline;
};

/* -------------------- SEND MESSAGE -------------------- */
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, courseId, message } = req.body;
        const student = req.user;

        if (!student) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!receiverId || !courseId || !message) {
            return res.status(400).json({
                message: "receiverId, courseId or message missing",
            });
        }

        // ObjectId validation
        if (
            !mongoose.Types.ObjectId.isValid(receiverId) ||
            !mongoose.Types.ObjectId.isValid(courseId)
        ) {
            return res.status(400).json({ message: "Invalid IDs" });
        }

        const teacher = await User.findById(receiverId);

        // Save student message (use schema field names `senderId`/`receiverId`)
        const studentMessage = await ChatMessage.create({
            senderId: student.id || student._id,
            receiverId: receiverId,
            courseId,
            senderRole: "student",
            message,
        });

        // If teacher offline → AI reply
        console.log("🤔 Checking if teacher is online for receiverId:", receiverId);
        const teacherIsOnline = isTeacherOnline(teacher);

        if (!teacherIsOnline) {
            console.log("🤖 Teacher offline - Triggering AI reply...");
            let aiReply = "I'll get back to you soon.";

            try {
                console.log("📤 Calling getAIReply with message:", message.substring(0, 50) + "...");
                aiReply = await getAIReply(message, courseId);
                console.log("✅ AI Reply received:", aiReply.substring(0, 100) + "...");
            } catch (aiError) {
                console.error("❌ AI ERROR 🔥:", {
                    message: aiError.message,
                    code: aiError.code,
                    status: aiError.status,
                    fullError: aiError
                });
            }

            // Create AI message — schema requires an ObjectId for `senderId`.
            // Use a generated ObjectId for system messages so Mongoose casting passes.
            const aiMessage = await ChatMessage.create({
                senderId: new mongoose.Types.ObjectId(),
                receiverId: student.id || student._id,
                courseId,
                senderRole: "ai",
                isAI: true,
                message: aiReply,
            });

            return res.json({
                replyType: "ai",
                message: aiMessage,
            });
        }

        return res.json({
            replyType: "teacher",
            message: studentMessage,
        });
    } catch (error) {
        console.error("SEND MESSAGE ERROR 🔥:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* -------------------- FETCH MESSAGES -------------------- */
exports.fetchMessages = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ObjectId validation
        if (
            !mongoose.Types.ObjectId.isValid(courseId) ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(400).json({
                message: "Invalid courseId or userId",
            });
        }

        const messages = await ChatMessage.find({
            courseId,
            $or: [
                { senderId: req.user.id, receiverId: userId },
                { senderId: userId, receiverId: req.user.id },
            ],
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error("FETCH MESSAGE ERROR 🔥:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
