const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/exchange-token", authMiddleware, async (req, res) => {
  const shortLivedToken = req.body.accessToken;

  if (!shortLivedToken) {
    return res.status(400).json({ message: "Missing access token" });
  }

  try {
    const response = await axios.get("https://graph.facebook.com/v19.0/oauth/access_token", {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });

    const longLivedToken = response.data.access_token;
    res.status(200).json({ accessToken: longLivedToken });
  } catch (error) {
    console.error("❌ Token exchange failed", error.response?.data || error.message);
    res.status(500).json({ message: "Token exchange failed", error: error.message });
  }
});

module.exports = router;
