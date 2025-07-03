const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    console.log("✅ User attached to request:", req.user);
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = authMiddleware;
