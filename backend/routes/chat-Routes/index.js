const express = require("express");
const router = express.Router();
const { sendMessage, fetchMessages, fetchInstructorConversations } = require("../../controller/chat-controller/chatController");
const authenticateMiddleware = require("../../middleware/auth-middleware");

router.use(authenticateMiddleware);

router.post("/send", authenticateMiddleware, sendMessage);
router.get("/instructor/conversations", authenticateMiddleware, fetchInstructorConversations);
router.get("/:courseId/:userId", authenticateMiddleware, fetchMessages);

module.exports = router;
