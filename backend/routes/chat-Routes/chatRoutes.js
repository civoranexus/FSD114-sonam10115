const express = require("express");
const router = express.Router();
const { sendMessage, fetchMessages } = require("../../controller/chat-controller/chatController");

router.post("/send", sendMessage);
router.get("/:courseId/:userId", fetchMessages);

module.exports = router;
