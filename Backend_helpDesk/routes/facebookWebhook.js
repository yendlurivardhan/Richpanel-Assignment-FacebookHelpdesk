const express = require("express");
const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "MyFBverify123";

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed");
    res.sendStatus(403);
  }
});

router.post("/webhook", (req, res) => {
  console.log("📩 Incoming message:", JSON.stringify(req.body, null, 2));
  res.status(200).send("EVENT_RECEIVED");
});

module.exports = router;
