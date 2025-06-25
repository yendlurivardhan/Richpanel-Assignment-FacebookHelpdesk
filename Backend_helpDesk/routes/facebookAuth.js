const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Make sure this model exists

const router = express.Router();

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Redirect URI must match Facebook Developer Console exactly
const REDIRECT_URI = "https://facebook-helpdesk-8.onrender.com/api/auth/facebook/callback";

// 🔹 This route is triggered after Facebook login
router.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

  try {
    // 🔄 Exchange code for access token
    const tokenRes = await axios.get(
      `https://graph.facebook.com/v19.0/oauth/access_token`,
      {
        params: {
          client_id: FB_APP_ID,
          client_secret: FB_APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 🔍 Get user profile
    const userRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const fbUser = userRes.data;

    // 🧑‍💻 Check if user exists in DB or create new
    let user = await User.findOne({ facebookId: fbUser.id });
    if (!user) {
      user = new User({
        facebookId: fbUser.id,
        name: fbUser.name,
        email: fbUser.email || "", // Optional
        picture: fbUser.picture?.data?.url || "",
        fbAccessToken: accessToken,
      });
      await user.save();
    } else {
      user.fbAccessToken = accessToken; // Update token if needed
      await user.save();
    }

    // 🔐 Issue JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 🔁 Redirect to frontend with token
    res.redirect(`http://localhost:5173/connect?token=${token}`);
  } catch (err) {
    console.error("Facebook login error:", err.response?.data || err.message);
    res.status(500).send("Facebook login failed");
  }
});

module.exports = router;
