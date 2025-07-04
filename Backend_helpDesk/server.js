require("dotenv").config();                         // ✅ Step 1: Load environment
require("./config/passport");                       // ✅ Step 2: Register passport strategy

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const facebookRoutes = require("./routes/facebookRoutes");

const app = express();

// ✅ CORS: allow deployed frontend on Vercel
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // should be: https://richpanel-assignment-facebook-helpd.vercel.app
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/facebook", facebookRoutes);

// ✅ MongoDB + Start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
