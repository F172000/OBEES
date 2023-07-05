const { db } = require("../database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.enrollStudent = async (req, res) => {
  
  const courseId = req.body.courseId; // Assuming the course ID is provided in the request body
  const studentData = req.body.students.filter((data) => {
    const rollNo = data[0]; // Retrieve roll number from the second element
    const name = data[1];
    return name !== "\n" && rollNo !== "\n" && rollNo !== "" && name !== "";
  });

  if (studentData?.length === 0) {
    res.status(400).json({ error: "No valid student data provided" });
    return;
  }

  // Delete existing student data for the given courseId
  const deleteQuery = "DELETE FROM student WHERE course_id = ?";

  // Execute the delete query
  db.query(deleteQuery, [courseId], (deleteError, deleteResults) => {
    if (deleteError) {
      console.error(deleteError);
      res.status(500).json({ error: "Failed to delete existing student data" });
      return;
    }
  });

  const values = studentData.map(([rollNo, name]) => [rollNo, name, courseId]); // Create an array of arrays containing name, rollNo, and courseId

  const query = "INSERT INTO student (roll_no, name, course_id) VALUES ?";
  try {
    await new Promise((resolve, reject) => {
      db.query(query, [values], (error, results) => {
        if (error) {
          console.error(error);
          reject({ error: "Failed to save student data" });
        } else {
          resolve();
        }
      });
    });

    const [gradding, newStudent] = await Promise.all([
      new Promise((resolve, reject) => {
        const gradeSql = "SELECT * FROM student WHERE course_id = ?";
        db.query(gradeSql, [courseId], (error, gradeResults) => {
          if (error) {
            reject({
              error: "Internal server error",
              message: error.sqlMessage,
            });
            return;
          }
          var graddingData;
          const newStudents = [];
          if (gradeResults?.length > 0) {
            let completedCount = 0;
            for (let i = 0; i < gradeResults?.length; i++) {
              const findStuSql =
                "SELECT * FROM gradding WHERE roll_no = ? AND courseId = ?";
              db.query(
                findStuSql,
                [gradeResults[i].roll_no, courseId],
                (error, findStuResults) => {
                  if (error) {
                    reject({
                      error: "Internal server error",
                      message: error.sqlMessage,
                    });
                    return;
                  }
                  if (findStuResults?.length > 0) {
                    graddingData = findStuResults;
                  } else {
                    newStudents.push(gradeResults[i].roll_no);
                  }
                  completedCount++;
                  if (completedCount === gradeResults?.length) {
                    resolve(graddingData);
                  }
                }
              );
            }
          } else {
            resolve(graddingData);
          }
        });
      }),
      new Promise((resolve, reject) => {
        const gradeSql = "SELECT * FROM student WHERE course_id = ?";
        db.query(gradeSql, [courseId], (error, gradeResults) => {
          if (error) {
            reject({
              error: "Internal server error",
              message: error.sqlMessage,
            });
            return;
          }
          const newStudents = [];
          if (gradeResults?.length > 0) {
            let completedCount = 0;
            for (let i = 0; i < gradeResults?.length; i++) {
              const findStuSql =
                "SELECT * FROM gradding WHERE roll_no = ? AND courseId = ?";
              db.query(
                findStuSql,
                [gradeResults[i].roll_no, courseId],
                (error, findStuResults) => {
                  if (error) {
                    reject({
                      error: "Internal server error",
                      message: error.sqlMessage,
                    });
                    return;
                  }
                  if (findStuResults?.length === 0) {
                    newStudents.push(gradeResults[i].roll_no);
                  }
                  completedCount++;
                  if (completedCount === gradeResults?.length) {
                    resolve(newStudents);
                  }
                }
              );
            }
          } else {
            resolve(newStudents);
          }
        });
      }),
    ]);
    for (let j = 0; j < newStudent?.length; j++) {
      for (let k = 0; k < gradding?.length; k++) {
        const insertGrade =
          "INSERT INTO gradding (roll_no, courseId, examId, questionId, partId, cloId, obtainedMarks, totalMarks) VALUES (?, ?, ?, ?, ?, ?, 0, ?)";
        db.query(
          insertGrade,
          [
            newStudent[j],
            gradding[k].courseId,
            gradding[k].examId,
            gradding[k].questionId,
            gradding[k].partId,
            gradding[k].cloId,
            gradding[k].totalMarks,
          ],
          (error, insertResult) => {
            if (error) {
              return res.status(500).json({
                error: "Internal server error",
                message: error.sqlMessage,
              });
            }
          }
        );
      }
    }
    res.json({ message: "Student enrollment saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentsByCourse = async (req, res) => {
  const courseId = req.body.id;
  console.log(courseId);
  const query = `
    SELECT *
    FROM student
    WHERE course_id = ?
  `;

  db.query(query, [courseId], (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error);
      return res.status(500).json({ error: "Failed to fetch students" });
    }

    const students = results.map((row) => {
      // Create a student object with desired properties from the row
      return {
        id: row.id,
        name: row.name,
        rollNo: row.roll_no,
        // Add other properties from the row as needed
      };
    });

    return res.json(students);
  });
};
