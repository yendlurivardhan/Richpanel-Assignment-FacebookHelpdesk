const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// ✅ Exchange short-lived token for long-lived token
router.post("/exchange-token", authMiddleware, async (req, res) => {
  const shortLivedToken = req.body.accessToken;

  if (!shortLivedToken) {
    return res.status(400).json({ message: "Missing access token" });
  }

  try {
    const response = await axios.get("https://graph.facebook.com/v23.0/oauth/access_token", {
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

// ✅ Get user profile from Facebook by PSID
router.get("/user-profile/:psid", async (req, res) => {
  const { psid } = req.params;

  try {
    const response = await axios.get(`https://graph.facebook.com/v23.0/${psid}`, {
      params: {
        fields: "first_name,last_name,profile_pic",
        access_token: PAGE_ACCESS_TOKEN,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error fetching Facebook user profile:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
});

// ✅ Get messages from a Facebook conversation using PSID
router.get("/conversations/:psid", async (req, res) => {
  const { psid } = req.params;

  try {
    // Step 1: Get conversation ID
    const convRes = await axios.get(`https://graph.facebook.com/v23.0/${psid}/conversations`, {
      params: { access_token: PAGE_ACCESS_TOKEN },
    });

    const conversationId = convRes.data.data?.[0]?.id;
    if (!conversationId) {
      return res.status(404).json({ message: "No conversation found for this PSID" });
    }

    // Step 2: Get messages from that conversation
    const msgRes = await axios.get(
      `https://graph.facebook.com/v23.0/${conversationId}/messages`,
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );

    res.status(200).json({ messages: msgRes.data.data });
  } catch (error) {
    console.error("❌ Error fetching messages:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
});

module.exports = router;
