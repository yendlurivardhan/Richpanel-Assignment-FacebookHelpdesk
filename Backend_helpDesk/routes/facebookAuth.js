const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔁 Facebook OAuth callback handler
router.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Missing authorization code from Facebook" });
  }

  try {
    const params = new URLSearchParams({
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      redirect_uri: `${process.env.FB_LOCAL_URL}`,
      code,
    });

    // 🔑 Exchange code for access_token
    const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`);
    const { access_token } = tokenRes.data;

    // 👤 Fetch user profile
    const fbUserRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
    );

    const { id: fbId, name, email } = fbUserRes.data;

    // 📦 Check if user exists or create
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, facebookId: fbId });
      await user.save();
    }

    // 🪙 Issue JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🔁 Redirect back to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/connect?token=${token}`);

  } catch (err) {
    console.error("❌ Facebook login error:", err.response?.data || err.message);
    res.status(500).json({ message: "Facebook login failed", error: err.message });
  }
});

module.exports = router;
