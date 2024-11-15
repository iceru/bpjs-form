const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../db");
dotenv.config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Authorization is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "f0rmjwt", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const querySelect = "SELECT id, roles FROM users WHERE id = ?";
    db.query(querySelect, [decoded.id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = results[0];
      next();
    });
  });
};
