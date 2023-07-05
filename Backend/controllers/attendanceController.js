const { db } = require("../database");
const mysql = require("mysql2/promise");
require('dotenv').config();

exports.saveAttendance = async (req, res) => {
  try {
    const { date, attendance, courseId } = req.body;
    console.log(date);
    // Check if attendance already exists for the given courseId and date
    const existingAttendanceQuery =
      "SELECT * FROM attendance WHERE courseId = ? AND date = ?";
    db.query(
      existingAttendanceQuery,
      [courseId, date.toString()],
      (error, results) => {
        if (error) {
          console.error("Error executing query", error);
          return res.status(500).json({
            error: "Internal server error",
            message: error.sqlMessage,
          });
        }

        console.log(results);
        // If attendance already exists, return a response indicating that it cannot be saved again
        if (results.length > 0) {
          return res.status(400).json({
            error: "Attendance already exists for the given courseId and date",
          });
        }

        // Prepare the query to insert attendance records
        const insertQuery =
          "INSERT INTO attendance (studentId, date, status, courseId) VALUES ?";

        // Create an array of values to be inserted
        const values = attendance.map((student) => [
          student.rollNo,
          date.toString(),
          student.attendance,
          courseId,
        ]);

        // Execute the query with the values
        db.query(insertQuery, [values], (error, results) => {
          if (error) {
            console.error("Error executing query", error);
            return res.status(500).json({
              error: "Internal server error",
              message: error.sqlMessage,
            });
          }

          // Assuming the attendance records were successfully inserted
          return res.status(200).json({ success: true });
        });
      }
    );
  } catch (error) {
    console.error("Error saving attendance", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.viewAttendance = async (req, res) => {
  const courseId = req.body.id;
  // var extraPercentage = 0;

  try {
    // Create a connection using the promise wrapper
    const connection = await mysql.createConnection({
      host: process.env.HOST || "localhost",
      user: process.env.USER || "root",
      password: process.env.PASSWORD || "",
      database: process.env.DATABASE || "obesystem",
    });


    
    const datesQuery =
      "SELECT DISTINCT date FROM attendance WHERE courseId = ?";
    const [datesResult] = await connection.query(datesQuery, [courseId]);

    // Fetch the student names, attendance IDs, and their attendance data from the Students and Attendance tables
    const studentsQuery = `
    SELECT student.id, student.name, student.roll_no, attendance.id AS attendanceId, attendance.date, attendance.status
    FROM student
    LEFT JOIN attendance ON student.roll_no = attendance.studentId AND attendance.courseId = ?
    WHERE student.course_id = ?; `;
    const [studentsResult] = await connection.query(studentsQuery, [
      courseId,
      courseId,
    ]);

    // Prepare the table structure
    const attendanceTable = {
      dates: datesResult.map((row) => row.date), // Array of distinct dates
      students: studentsResult, // Array of student objects (id, name, roll_no, attendanceId, date, status)
      data: [], // Attendance data to be populated
    };

    // Fetch the attendance data for each student and date
    for (const student of attendanceTable.students) {
      // Find the student's attendance data
      const studentAttendanceData = attendanceTable.data.find(
        (attendanceData) => attendanceData.studentId === student.id
      );

      if (!studentAttendanceData) {
        // Create an object to store attendance data for the student
        const attendanceData = {
          studentId: student.id,
          studentName: student.name,
          studentRollNo: student.roll_no,
          attendanceIds: [], // Array of attendance IDs for each date
          attendance: [], // Array of attendance statuses for each date
          totalPresent: 0,
          totalAbsent: 0,
          attendancePercentage: 0,
        };

        // Populate the attendance data for each date
        for (const date of attendanceTable.dates) {
          const attendance = attendanceTable.students.find(
            (row) => row.id === student.id && row.date === date
          );

          if (attendance) {
            attendanceData.attendanceIds.push(attendance.attendanceId);
            attendanceData.attendance.push(attendance.status);
            if (attendance.status === "P") {
              attendanceData.totalPresent++;
            } else if (attendance.status === "A") {
              attendanceData.totalAbsent++;
            }
          } else {
            attendanceData.attendanceIds.push(null); // Attendance data not available for the date
            attendanceData.attendance.push("A");
          }
        }

        // console.log("Extra ", extraPercentage);
        // Calculate the attendance percentage
        const totalClasses = attendanceData.attendance.length;
        if (totalClasses > 0) {
          attendanceData.attendancePercentage =
            (attendanceData.totalPresent / totalClasses) * 100;
          attendanceData.attendancePercentage = Math.min(
            attendanceData.attendancePercentage,
            100
          );
        }

        // Add the student's attendance data to the table data
        attendanceTable.data.push(attendanceData);
      }
    }

    // Close the connection
    connection.end();

    // Send the attendance table data as the response
    res.status(200).json({ attendanceTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateAttendance = async (req, res) => {
  const updates = req.body.updates;
  const student = req.body.id;
  const course = req.body.course;

  // Iterate over the updates and update the attendance table
  for (const update of updates) {
    const { date, value } = update;

    // Check if a row exists for the given condition
    const checkQuery = `SELECT * FROM attendance WHERE date = ? AND studentId = ? AND courseId = ?`;
    db.query(checkQuery, [date.toString(), student, course], (error, rows) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error while checking attendance" });
        return;
      }

      if (rows.length > 0) {
        // Row exists, perform the update query
        const updateQuery = `UPDATE attendance SET status = ? WHERE date = ? AND studentId = ? AND courseId = ?`;
        db.query(
          updateQuery,
          [value, date.toString(), student, course],
          (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).json({
                error: `Failed to update attendance for date ${date}`,
              });
              return;
            }
          }
        );
      } else {
        // Row does not exist, perform the insert query
        const insertQuery = `INSERT INTO attendance (date, studentId, courseId, status) VALUES (?, ?, ?, ?)`;
        db.query(
          insertQuery,
          [date.toString(), student, course, value],
          (error, result) => {
            if (error) {
              console.error(error);
              res.status(500).json({
                error: `Failed to insert attendance for date ${date}`,
              });
              return;
            }
          }
        );
      }
    });
  }

  return res.status(200).json({ message: "Attendance updated successfully" });
};

exports.addExtraAttendance = async (req, res) => {
  const courseId = req.body.id;
  const percentage = req.body.percentage;

  const delSql = "DELETE FROM extraattendance WHERE courseId = ?";
  db.query(delSql, [courseId], (error) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    const addSql =
      "INSERT INTO extraattendance (courseId, percentage) VALUES (?, ?)";
    db.query(addSql, [courseId, percentage], (error, addResult) => {
      if (error) {
        return res
          .status(500)
          .json({ error: "Internal server error", message: error.sqlMessage });
      }
      return res.status(200).json({ message: "Extra Attendance Added" });
    });
  });
};

exports.getExtraAttendance = async (req, res) => {
  const courseId = req.body.id;

  const delSql = "SELECT * FROM extraattendance WHERE courseId = ?";
  db.query(delSql, [courseId], (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }

    return res.status(200).json({ result });
  });
};
