const { db } = require("../database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getTeachers = async (req, res) => {
  const query = "SELECT * FROM users";

  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving courses:", error);
      res.status(500).json({ error: "Failed to retrieve courses" });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.viewProfile = async (req, res) => {
  const userId = req.body.id;

  const viewQuery = "SELECT * FROM user WHERE id = ?";
  db.query(examQuery, [userId], (error, profileResults) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }

    if (profileResults.length > 0) {
      return res.status(200).json({ profileResults });
    }
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const departmentName = req.body.departmentName;
    const campus = req.body.campus;
    const image = req.body.image;
    const position = req.body.position;

    const updateQuery =
      "UPDATE users SET name = ?, email = ?, department = ?, campus=?, image = ?, position = ? WHERE id = ?";
    db.query(
      updateQuery,
      [name, email, departmentName, campus, image, position, userId],
      (error, profileResults) => {
        if (error) {
          return res.status(500).json({
            error: "Internal server error",
            message: error.sqlMessage,
          });
        }

        if (profileResults.affectedRows > 0) {
          // Fetch the updated row from the database
          const selectQuery = "SELECT * FROM users WHERE id = ?";
          db.query(selectQuery, [userId], (error, selectResults) => {
            if (error) {
              return res.status(500).json({
                error: "Internal server error",
                message: error.sqlMessage,
              });
            }

            if (selectResults.length > 0) {
              const updatedRow = selectResults[0];
              return res.status(200).json({
                message: "Successfully Updated",
                data: updatedRow,
              });
            }
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  const id = req.body.id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const sql = "SELECT * FROM users WHERE id = ? AND password = ?";

  db.query(sql, [id, oldPassword], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }

    if (results.length > 0) {
      const updateSql = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updateSql, [newPassword, id], (error, updateResults) => {
        if (error) {
          return res.status(500).json({
            error: "Internal server error",
            message: error.sqlMessage,
          });
        }
        if (updateResults.affectedRows > 0) {
          return res
            .status(200)
            .json({ Message: "Password Updated Successfully" });
        }
      });
    } else {
      return res.status(400).json({ Message: "Invalid Old Password" });
    }
  });
};
