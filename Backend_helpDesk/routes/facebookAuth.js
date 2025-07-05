const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Step 1: Redirect user to Facebook login
router.get("/facebook", (req, res) => {
  const fbAuthURL = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${encodeURIComponent(
    process.env.FB_CALLBACK_URL
  )}&scope=email,public_profile,pages_messaging,pages_show_list,pages_read_engagement`;
  res.redirect(fbAuthURL);
});

// Step 2: Facebook callback
router.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;

  console.log("👉 Facebook callback hit");
  console.log("👉 Code received:", code);

  if (!code) {
    return res.status(400).json({ message: "Missing authorization code from Facebook" });
  }

  try {
    // Get access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      redirect_uri: process.env.FB_CALLBACK_URL,
      code,
    });

    const tokenURL = `https://graph.facebook.com/v23.0/oauth/access_token?${tokenParams.toString()}`;
    console.log("👉 Requesting token from:", tokenURL);

    const tokenRes = await axios.get(tokenURL);
    const { access_token } = tokenRes.data;

    console.log("✅ Access Token received:", access_token);

    // Get Facebook user info
    const fbUserURL = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`;
    const fbUserRes = await axios.get(fbUserURL);

    console.log("✅ Facebook User Data:", fbUserRes.data);

    const { id: fbId, name, email } = fbUserRes.data;

    if (!email) {
      return res.status(400).json({ message: "Facebook account does not provide an email. Please try another account." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, facebookId: fbId });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ JWT Token created:", token);

    // Redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/connect?token=${token}`);
  } catch (err) {
    console.error("❌ Facebook login error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });

    res.status(500).json({
      message: "Facebook login failed",
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
