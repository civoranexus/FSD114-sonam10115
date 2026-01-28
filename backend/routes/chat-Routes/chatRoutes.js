const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth-middleware");
const { sendMessage, fetchMessages } = require("../../controller/chat-controller/chatController");

router.post("/send", auth, sendMessage);
router.get("/:courseId/:userId", auth, fetchMessages);

module.exports = router;
