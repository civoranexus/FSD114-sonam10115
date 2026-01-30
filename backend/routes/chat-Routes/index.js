const express = require("express");
const router = express.Router();
const { sendMessage, fetchMessages } = require("../../controller/chat-controller/chatController");
const authenticateMiddleware = require("../../middleware/auth-middleware");

router.use(authenticateMiddleware);

router.post("/send", authenticateMiddleware, sendMessage);
router.get("/:courseId/:userId", authenticateMiddleware, fetchMessages);

module.exports = router;
