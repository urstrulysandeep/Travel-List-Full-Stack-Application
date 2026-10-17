const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.slice(7).trim();
    if (!token || token.split(".").length !== 3) {
      return res.status(401).json({ message: "Malformed token. Please log in again." });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server authentication is not configured" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found. Please log in again." });

    req.user = user;
    return next();
  } catch (error) {
    console.log("AUTH ERROR:", error.name, error.message);
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = authMiddleware;
