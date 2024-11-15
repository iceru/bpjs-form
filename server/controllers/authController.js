const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { splitPassword } = require("../helper/decrypt");

exports.register = async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const decryptedPassword = splitPassword(password);

  const queryCheck = "SELECT email FROM users WHERE email = ?";
  db.query(queryCheck, [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

    const queryInsert =
      "INSERT INTO users (name, email, password, roles, created_at) VALUES (?, ?, ?, ?, NOW())";
    db.query(
      queryInsert,
      [name, email, hashedPassword, "user"],
      (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
};

exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const decryptedPassword = splitPassword(password);

  const querySelect = "SELECT * FROM users WHERE email = ?";
  db.query(querySelect, [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    console.log(decryptedPassword);
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.roles },
      process.env.JWT_SECRET || "f0rmjwt",
      {
        expiresIn: "4h",
      }
    );

    res.json({ token });
  });
};

exports.changePassword = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { email, oldPassword, newPassword } = req.body;

  const query = "SELECT email, password FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = results[0];

    bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
      if (err)
        return res.status(500).json({ error: "Error comparing passwords" });
      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updateQuery, [hashedPassword, user.id], (err) => {
        if (err)
          return res.status(500).json({ error: "Failed to update password" });

        res.json({ message: "Password changed successfully" });
      });
    });
  });
};
