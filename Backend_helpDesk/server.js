const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4714;

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Initialize Passport
require("./config/passport"); // Your passport config (with FacebookStrategy)
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes")); // Facebook login + callback
app.use("/api/facebook", require("./routes/facebookRoutes")); // user-profile, exchange-token, messages
app.use("/api", require("./routes/facebookWebhook"));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🎉 Facebook Helpdesk Server is Running");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
