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
    // Get all conversations for the page
    const convRes = await axios.get(`https://graph.facebook.com/v23.0/me/conversations`, {
      params: { access_token: PAGE_ACCESS_TOKEN }
    });

    const allConversations = convRes.data.data;

    // Find the conversation with this PSID
    let matchedConversation = null;

    for (const convo of allConversations) {
      const participantsRes = await axios.get(
        `https://graph.facebook.com/v23.0/${convo.id}/participants`,
        { params: { access_token: PAGE_ACCESS_TOKEN } }
      );

      const participants = participantsRes.data.data;
      const user = participants.find(p => p.id === psid);

      if (user) {
        matchedConversation = convo.id;
        break;
      }
    }

    if (!matchedConversation) {
      return res.status(404).json({ message: "No conversation found for this PSID" });
    }

    // Get messages
    const msgRes = await axios.get(
      `https://graph.facebook.com/v23.0/${matchedConversation}/messages`,
      { params: { access_token: PAGE_ACCESS_TOKEN } }
    );

    res.status(200).json({ messages: msgRes.data.data });
  } catch (error) {
    console.error("❌ Error fetching messages:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
});

module.exports = router;
