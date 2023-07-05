const { db } = require("../database");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.doLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if the provided email and password match a user record in the database
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }

    if (results.length === 0) {
      // No matching user found
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      // User found, generate JWT token
      const user = results[0];
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          department: user.department,
          campus: user.campus,
          image: user.image,
          position: user.position,
        },
        secretKey
      );

      // Send token and user data to frontend
      res.json({ token, user });
    }
  });
};

exports.logout = async (req, res) => {};

