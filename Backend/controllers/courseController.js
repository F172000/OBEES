const { db } = require("../database");
require("dotenv").config();

/////Get All Courses
exports.getCources = async (req, res) => {
  const query =
    "SELECT users.name as teacherName, users.id as teacherId,course.id as id, course.* FROM course LEFT JOIN users ON course.teacherId = users.id";

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

////Get only unassigned Courses
exports.getunAssignedCources = async (req, res) => {
  const query = "SELECT * FROM course WHERE teacherId IS NULL";

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

///assign Course to teacher
exports.assignCourse = async (req, res) => {
  const { courses, teacher } = req.body;

  console.log("Course", courses);
  console.log("teacher", teacher);
  try {
    // Loop over the courses array and update the teacherId in the course table
    for (const course of courses) {
      const courseId = course.id; // Assuming the course object has an 'id' property

      // Update the teacherId for the course in the database using the promise-based API
      const updateQuery = "UPDATE course SET teacherId = ? WHERE id = ?";
      await db.promise().query(updateQuery, [teacher, courseId]);
    }

    res.status(200).json({ message: "Courses assigned successfully" });
  } catch (error) {
    console.error("Error assigning courses:", error);
    res.status(500).json({ error: "Failed to assign courses" });
  }
};

///Get course based on techer

exports.getCoursesByTeacher = async (req, res) => {
  const query = "SELECT * FROM course WHERE teacherId = ?";

  // Execute the query
  db.query(query, [req.body.teacherId], (error, results) => {
    if (error) {
      console.error("Error retrieving courses:", error);
      res.status(500).json({ error: "Failed to retrieve courses" });
    } else {
      res.status(200).json(results);
    }
  });
};

//Get Course By Id
exports.getCourseById = async (req, res) => {
  const id = req.body.id;
  const sql = "SELECT * FROM course WHERE id = ?";
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }

    if (results.length != 0) {
      //write code here
      return res.status(200).json(results);
    } else {
      res.status(400).json({ message: "No Course Found" });
    }
  });
};

exports.addCoursePlan = async (req, res) => {
  const courseId = req.body.courseId;
  const weekNo = req.body.weekNo;
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;
  const topicCovered = req.body.topicCovered;
  const activities = req.body.activities;

  const sql =
    "INSERT INTO coursePlan (courseId, weekNo, fromDate, toDate, topicCovered, activities) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [courseId, weekNo, fromDate, toDate, topicCovered, activities],
    (error, Results) => {
      if (error) {
        console.log(error.sqlMessage);
        return res
          .status(500)
          .json({ error: "Internal server error", message: error.sqlMessage });
      }
      if (Results.affectedRows > 0) {
        return res.status(200).json({ message: "Successfully Inserted" });
      }
    }
  );
};
exports.deleteCoursePlan = async (req, res) => {
  const id = req.body.id;

  const sql = "DELETE FROM coursePlan WHERE id = ?";
  db.query(sql, [id], (error, Results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    if (Results.affectedRows > 0) {
      return res.status(200).json({ message: "Successfully Deleted" });
    }
  });
};

exports.updateCoursePlan = async (req, res) => {
  try {
    const id = req.body.id;
    const weekNo = req.body.weekNo;
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const topicCovered = req.body.topicCovered;
    const activities = req.body.activities;

    const sql =
      "UPDATE coursePlan SET weekNo = ?, fromDate = ?, toDate = ?, topicCovered = ?, activities = ? WHERE id = ?";
    db.query(
      sql,
      [weekNo, fromDate, toDate, topicCovered, activities, id],
      (error, Results) => {
        if (error) {
          return res
            .status(500)
            .json({
              error: "Internal server error",
              message: error.sqlMessage,
            });
        }
        if (Results.affectedRows > 0) {
          return res.status(200).json({ message: "Successfully Updated" });
        }
        return res.status(201).json({ message: "Course not found" });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

exports.viewCoursePlan = async (req, res) => {
  const courseId = req.body.id;

  const sql = "SELECT * FROM coursePlan WHERE courseId = ?";
  db.query(sql, [courseId], (error, Results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    if (Results.length > 0) {
      return res.status(200).json({ Results });
    }
  });
};
