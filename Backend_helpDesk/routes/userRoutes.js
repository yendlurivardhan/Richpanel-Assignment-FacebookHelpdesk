const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const axios = require("axios");

// ✅ Get all users (Dev/Test route — protect in production)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ Get a single user by Mongo ID
router.get("/users/:id", authMiddleware, async (req, res) => {
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

// ✅ Get Facebook user profile using PSID
router.get("/facebook/:psid", async (req, res) => {
  const { psid } = req.params;
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${psid}`,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: "first_name,last_name,profile_pic",
        },
      }
    );

    const { first_name, last_name, profile_pic } = response.data;

    res.status(200).json({
      name: `${first_name} ${last_name}`,
      firstName: first_name,
      lastName: last_name,
      picture: profile_pic,
    });
  } catch (error) {
    console.error("❌ Facebook error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch Facebook user profile",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
