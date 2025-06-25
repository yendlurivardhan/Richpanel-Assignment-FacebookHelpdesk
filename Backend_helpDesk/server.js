require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 4714;

// Middleware to parse JSON
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");

    // ✅ Use express-session with MongoDB session store
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "defaultSecret123", // Fallback if .env missing
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
      })
    );

    // ✅ Sample route
    app.get("/", (req, res) => {
      res.send("Hello from Facebook Helpdesk backend!");
    });

    // ✅ Start server only after MongoDB is connected
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
