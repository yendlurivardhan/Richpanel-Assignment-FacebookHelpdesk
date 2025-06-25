const express = require("express");
const Message = require("../models/message");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ Send a message
router.post("/messages", authMiddleware, async (req, res) => {
  const sender = req.user._id; // ✅ get from token
  const { receiver, content } = req.body;

  if (!receiver || !content) {
    return res.status(400).json({ message: "Receiver and content are required" });
  }

  try {
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
});

// ✅ Get all messages between two users
router.get("/messages/:user1/:user2", authMiddleware, async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

module.exports = router;
