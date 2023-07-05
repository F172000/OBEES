const { db } = require("../database");
require("dotenv").config();
const mysql = require("mysql2/promise");

exports.calculateClo = async (req, res) => {
  try {
    const cId = req.body.id;
    const query = `SELECT g.roll_no,c.ploId as ploId,c.cloKpi,p.ploKpi,a.id as assessmentId, COUNT(*) AS frequency, SUM(g.obtainedMarks) AS total_obtained_marks, SUM(g.totalMarks) AS total_marks, s.name, g.cloId
    FROM gradding AS g
    JOIN student AS s ON g.roll_no = s.roll_no AND g.courseId = s.course_id
    JOIN exam AS e ON e.id = g.examId
    JOIN assessment AS a ON a.id = e.assessmentId
    JOIN clo As c ON c.id = g.cloId
    LEFT JOIN plo As p ON p.id = c.ploId
    WHERE g.courseId = ?
    GROUP BY g.roll_no, g.cloId,a.id`;

    const connection = await mysql.createConnection({
      host: process.env.HOST || "localhost",
      user: process.env.USER || "root",
      password: process.env.PASSWORD || "",
      database: process.env.DATABASE || "obesystem",
    });

    const [results] = await connection.execute(query, [cId]);

    // Process the query results and calculate CLO achievements for each student
    const formattedResults = results.reduce((acc, row) => {
      const {
        roll_no,
        name,
        ploId,
        cloId,
        total_obtained_marks,
        total_marks,
        assessmentId,
        ploKpi,
        cloKpi,
        frequency,
      } = row;
      console.log("AssesmentID", assessmentId);
      // Calculate the CLO achievement
      const cloAchievement = Math.round(
        (total_obtained_marks / total_marks) * 100
      );
      console.log(cloId);
      // Check if the student already exists
      const existingStudent = acc.find((item) => item.roll_no === roll_no);

      if (existingStudent) {
        const existingAchievement = Object.values(
          existingStudent.cloAchievements
        ).find(
          (achievement) =>
            achievement.assessmentId === assessmentId &&
            achievement.cloId === cloId
        );

        if (!existingAchievement) {
          console.log("not exist", assessmentId);

          // Update the existing student's CLO achievements
          existingStudent.cloAchievements.push({
            achievement: cloAchievement,
            totalMarks: 0,
            obtainedMarks: 0,
            assessmentId: assessmentId,
            cloId: cloId,
            ploId: ploId,
            ploKpi: ploKpi,
            cloKpi: cloKpi,
            roll_no: roll_no,
          });
        }
      } else {
        // Create a new student object with CLO achievements
        const newStudent = {
          roll_no,
          name,
          cloAchievements: [
            {
              achievement: cloAchievement,
              totalMarks: 0,
              obtainedMarks: 0,
              assessmentId: assessmentId,
              cloId: cloId,
              ploId: ploId,
              ploKpi: ploKpi,
              cloKpi: cloKpi,
              roll_no: roll_no,
            },
          ],
        };

        acc.push(newStudent);
      }

      return acc;
    }, []);

    // Calculate the CLO attainment marks for each student
    const formattedResultsWithAttainment = await Promise.all(
      formattedResults.map(async (student) => {
        const { cloAchievements } = student;
        const attainmentMarks = {};

        const Query1 =
          "SELECT e.assessmentId, a.weightage AS weightage, SUM(e.totalMarks) AS totalMarks FROM exam e JOIN assessment a ON e.assessmentId = a.id WHERE e.courseId = ? GROUP BY e.assessmentId";
        const [Result1] = await connection.execute(Query1, [cId]);

        const Query2 =
          "SELECT g.*, a.id AS assessmentId, a.weightage AS weightage, COUNT(g.totalMarks) AS frequency, SUM(g.totalMarks) AS Total_Marks,SUM (g.obtainedMarks) AS obtainedMarks FROM gradding g JOIN exam e ON g.examId = e.id JOIN assessment a ON e.assessmentId = a.id WHERE g.courseId = ? AND g.roll_no = ? GROUP BY a.id, g.cloId";
        const [Result2] = await connection.execute(Query2, [
          cId,
          student.roll_no,
        ]);

        // Loop through each object in Result2
        Result2.forEach((obj2) => {
          const cloAchievementObj = Object.values(cloAchievements).find(
            (achievement) =>
              achievement.roll_no == student.roll_no &&
              achievement.assessmentId == obj2.assessmentId &&
              achievement.cloId == obj2.cloId
          );

          if (cloAchievementObj) {
            // Find the corresponding object in Result1 based on the assessmentId
            const obj1 = Result1.find(
              (item) => item.assessmentId === obj2.assessmentId
            );

            if (obj1) {
              // Calculate cloTotal based on the values from obj1 and obj2

              const cloTotal =
                (obj1.weightage / obj1.totalMarks) * obj2.Total_Marks;
              const cloObtained =
                (obj1.weightage / obj1.totalMarks) * obj2.obtainedMarks;

              // Update cloAchievementObj with the new values
              cloAchievementObj.totalMarks += cloTotal;
              cloAchievementObj.obtainedMarks += cloObtained;
            }
          }
        });

        const uniqueCloAchievements = {};
        cloAchievements.forEach((achievement) => {
          const { cloId, totalMarks, obtainedMarks, ploId, cloKpi, ploKpi } =
            achievement;
          if (!uniqueCloAchievements[cloId]) {
            uniqueCloAchievements[cloId] = {
              totalMarks,
              obtainedMarks,
              ploId,
              cloKpi,
              ploKpi,
            };
          } else {
            uniqueCloAchievements[cloId].totalMarks += totalMarks;
            uniqueCloAchievements[cloId].obtainedMarks += obtainedMarks;
          }
        });

        // Convert uniqueCloAchievements back to an array
        const mergedCloAchievements = Object.entries(uniqueCloAchievements).map(
          ([cloId, { totalMarks, obtainedMarks, ploId, cloKpi, ploKpi }]) => ({
            cloId,
            ploId,
            cloKpi,
            ploKpi,
            totalMarks,
            obtainedMarks,
          })
        );
        return {
          ...student,
          cloAchievements: mergedCloAchievements,
          attainmentMarks,
        };
      })
    );

    // Close the database connection
    connection.end();

    // Send the formatted results with attainment marks to the frontend
    res.status(200).json(formattedResultsWithAttainment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching data from the database.",
    });
  }
};

exports.calculateFinalClo = async (req, res) => {
  const connection = await mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || "obesystem",
  });
  try {
    const cId = req.body.id;
    const query1 = `
    SELECT
      id AS labId
    FROM
      course
    WHERE
      mainCourse = ?
  `;

    const results1 = await connection.query(query1, [cId]);
    let labId = -1;

    if (results1 && results1[0] && results1[0][0] && results1[0][0].labId) {
      labId = results1[0][0].labId;
    }

    const query = `SELECT g.roll_no,c.ploId as ploId,c.cloKpi,p.ploKpi,a.id as assessmentId, COUNT(*) AS frequency, SUM(g.obtainedMarks) AS total_obtained_marks, SUM(g.totalMarks) AS total_marks, s.name, g.cloId
    FROM gradding AS g
    JOIN student AS s ON g.roll_no = s.roll_no AND g.courseId = s.course_id
    JOIN exam AS e ON e.id = g.examId
    JOIN assessment AS a ON a.id = e.assessmentId
    JOIN clo As c ON c.id = g.cloId
    LEFT JOIN plo As p ON p.id = c.ploId
    WHERE g.courseId IN(?,?)
    GROUP BY g.roll_no, g.cloId,a.id ORDER BY
    s.name`;

    const [results] = await connection.execute(query, [labId, cId]);

    // Process the query results and calculate CLO achievements for each student
    const formattedResults = results.reduce((acc, row) => {
      const {
        roll_no,
        name,
        ploId,
        cloId,
        total_obtained_marks,
        total_marks,
        assessmentId,
        ploKpi,
        cloKpi,
        frequency,
      } = row;
      console.log("AssesmentID", assessmentId);
      // Calculate the CLO achievement
      const cloAchievement = Math.round(
        (total_obtained_marks / total_marks) * 100
      );
      console.log(cloId);
      // Check if the student already exists
      const existingStudent = acc.find((item) => item.roll_no === roll_no);

      if (existingStudent) {
        const existingAchievement = Object.values(
          existingStudent.cloAchievements
        ).find(
          (achievement) =>
            achievement.assessmentId === assessmentId &&
            achievement.cloId === cloId
        );

        if (!existingAchievement) {
          console.log("not exist", assessmentId);

          // Update the existing student's CLO achievements
          existingStudent.cloAchievements.push({
            achievement: cloAchievement,
            totalMarks: 0,
            obtainedMarks: 0,
            assessmentId: assessmentId,
            cloId: cloId,
            ploId: ploId,
            ploKpi: ploKpi,
            cloKpi: cloKpi,
            roll_no: roll_no,
          });
        }
      } else {
        // Create a new student object with CLO achievements
        const newStudent = {
          roll_no,
          name,
          cloAchievements: [
            {
              achievement: cloAchievement,
              totalMarks: 0,
              obtainedMarks: 0,
              assessmentId: assessmentId,
              cloId: cloId,
              ploId: ploId,
              ploKpi: ploKpi,
              cloKpi: cloKpi,
              roll_no: roll_no,
            },
          ],
        };

        acc.push(newStudent);
      }

      return acc;
    }, []);

    // Calculate the CLO attainment marks for each student
    const formattedResultsWithAttainment = await Promise.all(
      formattedResults.map(async (student) => {
        const { cloAchievements } = student;
        const attainmentMarks = {};

        const Query1 =
          "SELECT e.assessmentId,e.courseId, a.weightage AS weightage, SUM(e.totalMarks) AS totalMarks FROM exam e JOIN assessment a ON e.assessmentId = a.id WHERE e.courseId IN(?,?) GROUP BY e.assessmentId";
        const [Result1] = await connection.execute(Query1, [labId, cId]);

        const Query2 =
          "SELECT g.*, a.id AS assessmentId, a.weightage AS weightage, COUNT(g.totalMarks) AS frequency, SUM(g.totalMarks) AS Total_Marks,SUM (g.obtainedMarks) AS obtainedMarks FROM gradding g JOIN exam e ON g.examId = e.id JOIN assessment a ON e.assessmentId = a.id WHERE g.courseId IN ( ?,?) AND g.roll_no = ? GROUP BY a.id, g.cloId";
        const [Result2] = await connection.execute(Query2, [
          labId,
          cId,
          student.roll_no,
        ]);

        // Loop through each object in Result2
        Result2.forEach((obj2) => {
          const cloAchievementObj = Object.values(cloAchievements).find(
            (achievement) =>
              achievement.roll_no == student.roll_no &&
              achievement.assessmentId == obj2.assessmentId &&
              achievement.cloId == obj2.cloId
          );

          if (cloAchievementObj) {
            // Find the corresponding object in Result1 based on the assessmentId
            const obj1 = Result1.find(
              (item) => item.assessmentId === obj2.assessmentId
            );

            if (obj1) {
              // Calculate cloTotal based on the values from obj1 and obj2

              var cloTotal =
                (obj1.weightage / obj1.totalMarks) * obj2.Total_Marks;
              var cloObtained =
                (obj1.weightage / obj1.totalMarks) * obj2.obtainedMarks;
              if (labId && labId > 0) {
                if (obj1.courseId == labId) {
                  cloTotal = cloTotal * 0.5;
                  cloObtained = cloObtained * 0.5;
                } else {
                  cloTotal = cloTotal * 0.75;
                  cloObtained = cloObtained * 0.75;
                }
              }
              // Update cloAchievementObj with the new values
              cloAchievementObj.totalMarks += cloTotal;
              cloAchievementObj.obtainedMarks += cloObtained;
            }
          }
        });

        const uniqueCloAchievements = {};
        cloAchievements.forEach((achievement) => {
          const { cloId, totalMarks, obtainedMarks, ploId, cloKpi, ploKpi } =
            achievement;
          if (!uniqueCloAchievements[cloId]) {
            uniqueCloAchievements[cloId] = {
              totalMarks,
              obtainedMarks,
              ploId,
              cloKpi,
              ploKpi,
            };
          } else {
            uniqueCloAchievements[cloId].totalMarks += totalMarks;
            uniqueCloAchievements[cloId].obtainedMarks += obtainedMarks;
          }
        });

        // Convert uniqueCloAchievements back to an array
        const mergedCloAchievements = Object.entries(uniqueCloAchievements).map(
          ([cloId, { totalMarks, obtainedMarks, ploId, cloKpi, ploKpi }]) => ({
            cloId,
            ploId,
            cloKpi,
            ploKpi,
            totalMarks,
            obtainedMarks,
          })
        );
        return {
          ...student,
          cloAchievements: mergedCloAchievements,
          attainmentMarks,
        };
      })
    );

    // Close the database connection
    connection.end();

    // Send the formatted results with attainment marks to the frontend
    res.status(200).json(formattedResultsWithAttainment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching data from the database.",
    });
  }
};
exports.getCloByCourse = async (req, res) => {
  const courseId = req.body.id;
  console.log(courseId);
  const query = `
    SELECT *
    FROM clo
    WHERE courseId= ?
  `;

  db.query(query, [courseId], (error, results) => {
    if (error) {
      console.error("Error executing SQL query:", error);
      return res.status(500).json({ error: "Failed to fetch clos" });
    }

    const students = results.map((row) => {
      return {
        id: row.id,
        clo: row.clo,
        plo: row.ploId,
        course: courseId,
      };
    });

    return res.json(students);
  });
};