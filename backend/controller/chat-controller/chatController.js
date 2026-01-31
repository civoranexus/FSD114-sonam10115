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
        const sender = req.user;

        if (!sender) {
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

        // Determine sender role based on user role
        const senderRole = sender.role === "teacher" ? "teacher" : "student";
        console.log(`📨 Message from ${senderRole} (${sender._id}) to ${receiverId}`);

        const receiver = await User.findById(receiverId);

        // Save message with correct sender role
        const newMessage = await ChatMessage.create({
            senderId: sender.id || sender._id,
            receiverId: receiverId,
            courseId,
            senderRole: senderRole,
            message,
        });

        // If sender is student AND teacher is offline → AI reply
        if (senderRole === "student") {
            console.log("🤔 Checking if teacher is online for receiverId:", receiverId);
            const teacherIsOnline = isTeacherOnline(receiver);

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
                    receiverId: sender.id || sender._id,
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
        }

        return res.json({
            replyType: senderRole === "student" ? "teacher" : "student",
            message: newMessage,
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

/* -------------------- FETCH INSTRUCTOR CONVERSATIONS -------------------- */
exports.fetchInstructorConversations = async (req, res) => {
    try {
        const instructorId = req.user?._id || req.user?.id;

        if (!instructorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log("📬 Fetching conversations for instructor:", instructorId);

        // Find all unique students who messaged this instructor
        const conversations = await ChatMessage.aggregate([
            {
                $match: {
                    $or: [
                        { receiverId: new mongoose.Types.ObjectId(instructorId) },
                        { senderId: new mongoose.Types.ObjectId(instructorId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        courseId: "$courseId",
                        studentId: {
                            $cond: [
                                { $eq: ["$senderId", new mongoose.Types.ObjectId(instructorId)] },
                                "$receiverId",
                                "$senderId"
                            ]
                        }
                    },
                    lastMessage: { $first: "$message" },
                    lastMessageTime: { $first: "$createdAt" },
                    messageCount: { $sum: 1 }
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            },
            {
                $limit: 50
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.studentId",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id.courseId",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            {
                $project: {
                    studentId: "$_id.studentId",
                    courseId: "$_id.courseId",
                    studentName: {
                        $ifNull: [
                            { $arrayElemAt: ["$studentInfo.userName", 0] },
                            "Unknown Student"
                        ]
                    },
                    studentEmail: {
                        $ifNull: [
                            { $arrayElemAt: ["$studentInfo.userEmail", 0] },
                            ""
                        ]
                    },
                    courseName: {
                        $ifNull: [
                            { $arrayElemAt: ["$courseInfo.title", 0] },
                            "Unknown Course"
                        ]
                    },
                    lastMessage: 1,
                    lastMessageTime: 1,
                    messageCount: 1
                }
            }
        ]);

        // Map to ensure all fields are present
        const enrichedConversations = conversations.map(conv => ({
            studentId: conv.studentId,
            courseId: conv.courseId,
            studentName: conv.studentName || "Unknown Student",
            studentEmail: conv.studentEmail || "",
            courseName: conv.courseName || "Unknown Course",
            lastMessage: conv.lastMessage,
            lastMessageTime: conv.lastMessageTime,
            messageCount: conv.messageCount
        }));

        console.log("✅ Enriched conversations:", enrichedConversations.length);

        return res.status(200).json({
            success: true,
            data: enrichedConversations,
        });
    } catch (error) {
        console.error("FETCH INSTRUCTOR CONVERSATIONS ERROR 🔥:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
