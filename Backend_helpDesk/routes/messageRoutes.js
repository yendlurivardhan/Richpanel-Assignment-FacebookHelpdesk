const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// ✅ Send a message
router.post("/", async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Get messages between two users
router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 }); // ascending by time

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
