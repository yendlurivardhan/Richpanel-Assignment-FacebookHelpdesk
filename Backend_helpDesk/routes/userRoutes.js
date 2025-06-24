const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Get all users (dev/testing)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "_id name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
