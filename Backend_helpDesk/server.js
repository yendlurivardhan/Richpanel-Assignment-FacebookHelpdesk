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
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://richpanel-assignment-facebook-helpd.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
    },
  })
);

// ✅ Passport Init
require("./config/passport"); // load strategies
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes")); // register/login
app.use("/api/facebook", require("./routes/facebookRoutes")); // user profile & FB send msg
app.use("/api", require("./routes/facebookWebhook")); // webhook GET + POST
app.use("/api/users", require("./routes/userRoutes")); // get users etc.

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🎉 Facebook Helpdesk Server is Running");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
