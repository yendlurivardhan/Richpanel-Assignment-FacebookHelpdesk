const Message = require("./models/message");

const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res
        .status(400)
        .json({ message: "Receiver and content are required" });
    }

    const newMessage = new Message({
      sender: req.user._id,
      receiver,
      content,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = { sendMessage, getMessages };
