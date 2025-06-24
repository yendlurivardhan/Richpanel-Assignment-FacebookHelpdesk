const mongoose = require("mongoose");

const PageConnectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who connected the page
  pageId: String,         // Facebook Page ID
  pageName: String,       // Page Name
  pageAccessToken: String // Page Access Token from Facebook
});

module.exports = mongoose.model("PageConnection", PageConnectionSchema);
