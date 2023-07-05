const { db } = require("../database");
const mysql = require("mysql2/promise");
require("dotenv").config();

exports.addExam = async (req, res) => {
  const examName = req.body.examName;
  const courseId = req.body.courseId;
  const assessmentId = req.body.assessmentId;
  const totalMarks = req.body.marks;
  const questionData = req.body.questions;

  const insertExamQuery =
    "INSERT INTO exam (examName, courseId, assessmentId, totalMarks) VALUES (?, ?, ?, ?)";
  db.query(
    insertExamQuery,
    [examName, courseId, assessmentId, totalMarks],
    (error, examResult) => {
      if (error) {
        const errorMessage = {
          error: "Internal server error",
          message: error.sqlMessage,
        };
        return res.status(500).json(errorMessage);
      }

      // Retrieve the newly inserted examId
      const examId = examResult.insertId;

      const insertExamQuestions = () => {
        return new Promise((resolve, reject) => {
          questionData.forEach((question, index) => {
            const examQuestionData = {
              examId: examId,
              questionNumber: question.questionNumber,
              clo: question.clo,
              marks: question.marks,
            };

            const insertExamQuestionQuery =
              "INSERT INTO examquestion (questionNumber, examId, cloId, marks) VALUES (?, ?, ?, ?)";
            db.query(
              insertExamQuestionQuery,
              [
                examQuestionData.questionNumber,
                examQuestionData.examId,
                examQuestionData.clo,
                examQuestionData.marks,
              ],
              (error, questionResult) => {
                if (error) {
                  reject(error);
                }

                // Retrieve the newly inserted examQuestionId
                const examQuestionId = questionResult.insertId;
                var questionClo = examQuestionData.clo;
                const insertQuestionParts = () => {
                  return new Promise((resolve, reject) => {
                    if (question.parts && question.parts.length > 0) {
                      const insertQuestionPartPromises = question.parts.map(
                        (part, partIndex) => {
                          var partClo = 0;
                          if (questionClo > 0) {
                            partClo = questionClo;
                          } else {
                            partClo = part.clo;
                          }
                          const questionPartData = {
                            examQuestionId: examQuestionId,
                            partNumber: part.part,
                            clo: partClo,
                            marks: part.marks,
                          };

                          const insertQuestionPartQuery =
                            "INSERT INTO questionpart (examQuestionId, partNumber, cloId, marks) VALUES (?, ?, ?, ?)";
                          return new Promise((resolve, reject) => {
                            db.query(
                              insertQuestionPartQuery,
                              [
                                questionPartData.examQuestionId,
                                questionPartData.partNumber,
                                questionPartData.clo,
                                questionPartData.marks,
                              ],
                              (error, partResult) => {
                                if (error) {
                                  reject(error);
                                }

                                // Retrieve the newly inserted questionPartId
                                const questionPartId = partResult.insertId;
                                resolve({
                                  questionPartId,
                                  marks: questionPartData.marks,
                                  cloId: questionPartData.clo,
                                });
                              }
                            );
                          });
                        }
                      );

                      // Wait for all question parts to be inserted
                      Promise.all(insertQuestionPartPromises)
                        .then((questionParts) => {
                          resolve(questionParts);
                        })
                        .catch((error) => {
                          reject(error);
                        });
                    } else {
                      // No parts for the question, resolve immediately
                      resolve([]);
                    }
                  });
                };

                // Insert question parts and wait for completion
                insertQuestionParts()
                  .then((questionParts) => {
                    const insertGradingPromises = [];

                    // Retrieve all students based on courseId
                    const getStudentsQuery =
                      "SELECT * FROM student WHERE course_id = ?";
                    db.query(
                      getStudentsQuery,
                      [courseId],
                      (error, studentResults) => {
                        if (error) {
                          reject(error);
                        }

                        // Check if any students are found
                        if (studentResults && studentResults.length > 0) {
                          // Iterate over students and insert a row in grading table for each student, question, and part
                          studentResults.forEach((student) => {
                            if (questionParts.length > 0) {
                              questionParts.forEach((questionPart) => {
                                const gradingData = {
                                  roll_no: student.roll_no,
                                  examId: examId,
                                  questionId: examQuestionId,
                                  partId: questionPart.questionPartId,
                                  obtainedMarks: 0, // Initial obtained marks set to 0
                                  totalMarks: questionPart.marks, // Save marks from questionpart table into totalMarks column
                                  cloId: questionPart.cloId, // Save cloId from questionpart table
                                };

                                const insertGradingQuery =
                                  "INSERT INTO gradding (roll_no, courseId, examId, questionId, partId, obtainedMarks, totalMarks, cloId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                                const insertGradingPromise = new Promise(
                                  (resolve, reject) => {
                                    db.query(
                                      insertGradingQuery,
                                      [
                                        gradingData.roll_no,
                                        courseId,
                                        gradingData.examId,
                                        gradingData.questionId,
                                        gradingData.partId,
                                        gradingData.obtainedMarks,
                                        gradingData.totalMarks,
                                        gradingData.cloId,
                                      ],
                                      (error) => {
                                        if (error) {
                                          reject(error);
                                        }
                                        resolve();
                                      }
                                    );
                                  }
                                );
                                insertGradingPromises.push(
                                  insertGradingPromise
                                );
                              });
                            } else {
                              // No parts for the question, insert grading with partId as null and use cloId from examquestion table
                              const gradingData = {
                                roll_no: student.roll_no,
                                examId: examId,
                                questionId: examQuestionId,
                                partId: null,
                                obtainedMarks: 0,
                                totalMarks: examQuestionData.marks,
                                cloId: examQuestionData.clo,
                              };

                              const insertGradingQuery =
                                "INSERT INTO gradding (roll_no, courseId, examId, questionId, partId, obtainedMarks, totalMarks, cloId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                              const insertGradingPromise = new Promise(
                                (resolve, reject) => {
                                  db.query(
                                    insertGradingQuery,
                                    [
                                      gradingData.roll_no,
                                      courseId,
                                      gradingData.examId,
                                      gradingData.questionId,
                                      gradingData.partId,
                                      gradingData.obtainedMarks,
                                      gradingData.totalMarks,
                                      gradingData.cloId,
                                    ],
                                    (error) => {
                                      if (error) {
                                        reject(error);
                                      }
                                      resolve();
                                    }
                                  );
                                }
                              );
                              insertGradingPromises.push(insertGradingPromise);
                            }
                          });

                          // Wait for all grading inserts to complete
                          Promise.all(insertGradingPromises)
                            .then(() => {
                              resolve();
                            })
                            .catch((error) => {
                              reject(error);
                            });
                        } else {
                          // No students found, resolve immediately
                          resolve();
                        }
                      }
                    );
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            );
          });
        });
      };

      // Insert exam questions and wait for completion
      insertExamQuestions()
        .then(() => {
          // All database operations completed successfully
          return res.status(200).json({ message: "Exam Created Successfully" });
        })
        .catch((error) => {
          // Error occurred during database operations
          const errorMessage = {
            error: "Internal server error",
            message: error.sqlMessage,
          };
          return res.status(500).json(errorMessage);
        });
    }
  );
};

exports.showExam = async (req, res) => {
  const assessmentId = req.body.id;

  const sql = "SELECT * FROM exam WHERE assessmentId = ?";

  db.query(sql, [assessmentId], (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    return res.status(200).json({ results });
  });
};
exports.showAllExam = async (req, res) => {
  const courseId = req.body.id;

  const sql = "SELECT * FROM exam WHERE courseId = ?";

  db.query(sql, [courseId], (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    return res.status(200).json({ results });
  });
};

exports.showExamQuestion = async (req, res) => {
  const examId = req.body.id;

  const sql = "SELECT * FROM examQuestion WHERE examId = ?";

  db.query(sql, [examId], (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    return res.status(200).json({ results });
  });
};

exports.showQuestionPart = async (req, res) => {
  const examQuestionId = req.body.id;

  const sql = "SELECT * FROM questionPart WHERE examQuestionId = ?";

  db.query(sql, [examQuestionId], (error, results) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    return res.status(200).json({ results });
  });
};

exports.countExam = async (req, res) => {
  const assessmentId = req.body.id;

  const sql = "SELECT * FROM exam WHERE assessmentId = ?";

  db.query(sql, [assessmentId], (error, countResults) => {
    if (error) {
      console.error("Error executing query", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.sqlMessage });
    }
    const sql = "SELECT * FROM assessment WHERE id = ?";
    db.query(sql, [assessmentId], (error, results) => {
      if (error) {
        console.error("Error executing query", error);
        return res
          .status(500)
          .json({ error: "Internal server error", message: error.sqlMessage });
      }
      return res
        .status(200)
        .json({ count: countResults.length, assessmentData: results });
    });
  });
};

exports.updateGrades = async (req, res) => {
  const newMarks = req.body.marks;

  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST || "localhost",
      user: process.env.USER || "root",
      password: process.env.PASSWORD || "",
      database: process.env.DATABASE || "obesystem",
    });
    // Update obtainedMarks for each object in newMarks array
    for (const mark of newMarks) {
      const { id, mark: obtainedMarks } = mark;

      const query = `
        UPDATE gradding
        SET obtainedMarks = ?
        WHERE id = ?;
      `;

      await connection.query(query, [obtainedMarks, id]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update grades" });
  }
};

exports.getFinalMarkSheetData = async (req, res) => {
  const courseId = req.body.id;

  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST || "localhost",
      user: process.env.USER || "root",
      password: process.env.PASSWORD || "",
      database: process.env.DATABASE || "obesystem",
    });
    const query1 = `
    SELECT
      id AS labId
    FROM
      course
    WHERE
      mainCourse = ?
  `;

    const results1 = await connection.query(query1, [courseId]);
    let labId = -1;

    if (results1 && results1[0] && results1[0][0] && results1[0][0].labId) {
      labId = results1[0][0].labId;
    }

    const query = `
    SELECT
      student.name AS studentName,
      student.roll_no AS studentRollno,
      exam.examName,
      exam.courseId,
      exam.totalMarks,
      assessment.name as assessmentName,
      assessment.weightage,
      exam.assessmentId,
      examquestion.questionNumber,
      questionpart.partNumber,
      gradding.obtainedMarks,
      gradding.id AS gradingId,
      gradding.totalMarks AS questionTotalMarks,
      gradding.cloId AS clo
    FROM
      student
      LEFT JOIN gradding ON student.roll_no = gradding.roll_no AND student.course_id = ?
      LEFT JOIN exam ON gradding.examId = exam.id
      LEFT JOIN assessment ON exam.assessmentId = assessment.id
      LEFT JOIN examquestion ON gradding.questionId = examquestion.id
      LEFT JOIN questionpart ON gradding.partId = questionpart.id
    WHERE exam.courseId In(?,?)
    ORDER BY
      student.name,
      CASE
        WHEN assessment.name = 'Quiz' THEN 1
        WHEN assessment.name = 'Assignment' THEN 2
        WHEN assessment.name = 'Midterm' THEN 3
        WHEN assessment.name = 'Viva' THEN 4
        WHEN assessment.name = 'Presentation' THEN 5
        WHEN assessment.name = 'Project' THEN 6
        WHEN assessment.name = 'Final Term' THEN 7
        WHEN assessment.name = 'Lab quiz' THEN 8
        WHEN assessment.name = 'Lab assignment' THEN 9
        WHEN assessment.name = 'Lab work' THEN 10
        WHEN assessment.name = 'Lab viva' THEN 11
        WHEN assessment.name = 'Lab project' THEN 12
        WHEN assessment.name = 'Lab exam' THEN 13
        ELSE 1
      END,
      exam.examName,
      examquestion.questionNumber,
      questionpart.partNumber;
    `;

    const results = await connection.query(query, [courseId, courseId, labId]);

    // Retrieve column names
    const markSheetData = {};

    results[0].forEach((row) => {
      const studentName = row.studentName;
      const studentRollno = row.studentRollno;
      const examName = row.examName;
      const questionNumber = row.questionNumber;
      const partNumber = row.partNumber;
      const obtainedMarks = row.obtainedMarks;
      const gradingId = row.gradingId;
      const totalMarks = row.totalMarks;
      const questionTotalMarks = row.questionTotalMarks;
      const weightage = row.weightage;
      const assessmentId = row.assessmentId;
      const assessmentName = row.assessmentName;
      const courseId = row.courseId;
      const clo = row.clo;
      if (!markSheetData[studentName]) {
        markSheetData[studentName] = {
          studentRollno: studentRollno,
        };
      }

      if (!markSheetData[studentName][examName]) {
        markSheetData[studentName][examName] = {};
      }
      if (!markSheetData[studentName][examName][questionNumber]) {
        markSheetData[studentName][examName][questionNumber] = {};
      }

      markSheetData[studentName][examName][questionNumber][partNumber] = {
        obtainedMarks,
        gradingId,
        totalMarks,
        weightage,
        assessmentId,
        assessmentName,
        questionTotalMarks,
        clo,
        courseId,
      };
      if (req.body.id != row.courseId) {
        const labMarks = "labMarks";
        if (!markSheetData[studentName][labMarks]) {
          markSheetData[studentName][labMarks] = {};
        }
        if (!markSheetData[studentName][labMarks][assessmentName]) {
          markSheetData[studentName][labMarks][assessmentName] = {};
        }
        markSheetData[studentName][labMarks][assessmentName].weightage =
          weightage;
        if (
          !markSheetData[studentName][labMarks][assessmentName].obtainedMarks
        ) {
          markSheetData[studentName][labMarks][assessmentName].obtainedMarks =
            obtainedMarks;
        } else {
          markSheetData[studentName][labMarks][assessmentName].obtainedMarks =
            markSheetData[studentName][labMarks][assessmentName].obtainedMarks +
            obtainedMarks;
        }
        if (!markSheetData[studentName][labMarks][assessmentName].totalMarks) {
          markSheetData[studentName][labMarks][assessmentName].totalMarks =
            parseFloat(questionTotalMarks);
        } else {
          markSheetData[studentName][labMarks][assessmentName].totalMarks =
            parseFloat(
              markSheetData[studentName][labMarks][assessmentName].totalMarks
            ) + parseFloat(questionTotalMarks);
        }
        if (!markSheetData[studentName][labMarks][assessmentName].frequency) {
          markSheetData[studentName][labMarks][assessmentName].frequency = 1;
        } else {
          markSheetData[studentName][labMarks][assessmentName].frequency =
            markSheetData[studentName][labMarks][assessmentName].frequency + 1;
        }
      }
    });

    // Fetch data for courseId 3 and merge it into markSheetData
    // const query2 = `
    // SELECT
    //   student.name AS studentName,
    //   student.roll_no AS studentRollno,
    //   exam.examName,
    //   exam.totalMarks,
    //   assessment.name as assessmentName,
    //   assessment.weightage,
    //   exam.assessmentId,
    //   examquestion.questionNumber,
    //   questionpart.partNumber,
    //   gradding.obtainedMarks,
    //   gradding.id AS gradingId,
    //   gradding.totalMarks AS questionTotalMarks,
    //   gradding.cloId AS clo
    // FROM
    //   student
    //   LEFT JOIN gradding ON student.roll_no = gradding.roll_no AND student.course_id = ?
    //   LEFT JOIN exam ON gradding.examId = exam.id
    //   LEFT JOIN assessment ON exam.assessmentId = assessment.id
    //   LEFT JOIN examquestion ON gradding.questionId = examquestion.id
    //   LEFT JOIN questionpart ON gradding.partId = questionpart.id
    // WHERE exam.courseId = ?
    // ORDER BY
    //   student.name,
    //   CASE
    //     WHEN exam.examName = 'Midterm' THEN 2
    //     WHEN exam.examName = 'Final Term' THEN 3
    //     WHEN exam.examName = 'Lab exam' THEN 4
    //     WHEN exam.examName = 'Project' THEN 5
    //     ELSE 1
    //   END,
    //   exam.examName,
    //   examquestion.questionNumber,
    //   questionpart.partNumber;
    // `;

    // const results2 = await connection.query(query2, [3, 3]);

    res.json(markSheetData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve mark sheet data" });
  }
};

exports.getMarkSheetData = async (req, res) => {
  const courseId = req.body.id;

  try {
    const connection = await mysql.createConnection({
      host: process.env.HOST || "localhost",
      user: process.env.USER || "root",
      password: process.env.PASSWORD || "",
      database: process.env.DATABASE || "obesystem",
    });

    const query = `
    SELECT
    student.name AS studentName,
    student.roll_no AS studentRollno,
    exam.examName,
    exam.totalMarks,
    assessment.weightage,
    exam.assessmentId,
    examquestion.questionNumber,
    questionpart.partNumber,
    gradding.obtainedMarks,
    gradding.id AS gradingId,
    gradding.totalMarks AS questionTotalMarks,
    gradding.cloId AS clo
  FROM
    student
    LEFT JOIN gradding ON student.roll_no = gradding.roll_no AND student.course_id = ?
    LEFT JOIN exam ON gradding.examId = exam.id
    LEFT JOIN assessment ON exam.assessmentId = assessment.id
    LEFT JOIN examquestion ON gradding.questionId = examquestion.id
    LEFT JOIN questionpart ON gradding.partId = questionpart.id
  WHERE
    exam.courseId = ?
  ORDER BY
    student.name,
    CASE
    WHEN assessment.name = 'Quiz' THEN 1
        WHEN assessment.name = 'Assignment' THEN 2
        WHEN assessment.name = 'Midterm' THEN 3
        WHEN assessment.name = 'Viva' THEN 4
        WHEN assessment.name = 'Presentation' THEN 5
        WHEN assessment.name = 'Project' THEN 6
        WHEN assessment.name = 'Final Term' THEN 7
        WHEN assessment.name = 'Lab quiz' THEN 8
        WHEN assessment.name = 'Lab assignment' THEN 9
        WHEN assessment.name = 'Lab work' THEN 10
        WHEN assessment.name = 'Lab viva' THEN 11
        WHEN assessment.name = 'Lab project' THEN 12
        WHEN assessment.name = 'Lab exam' THEN 13
      ELSE 1
    END,
    exam.examName,
    examquestion.questionNumber,
    questionpart.partNumber;

  `;

    const results = await connection.query(query, [courseId, courseId]);
    // console.log("Results Length:", results.length);

    // Retrieve column names
    const markSheetData = {};

    results[0].forEach((row) => {
      // console.log("Row:", row);

      const studentName = row.studentName;
      const studentRollno = row.studentRollno;
      const examName = row.examName;
      const questionNumber = row.questionNumber;
      const partNumber = row.partNumber;
      const obtainedMarks = row.obtainedMarks;
      const gradingId = row.gradingId;
      const totalMarks = row.totalMarks;
      const questionTotalMarks = row.questionTotalMarks;
      const weightage = row.weightage;
      const assessmentId = row.assessmentId;
      const clo = row.clo;

      if (!markSheetData[studentName]) {
        markSheetData[studentName] = {
          studentRollno: studentRollno,
        };
      }
      if (!markSheetData[studentName][examName]) {
        markSheetData[studentName][examName] = {};
      }
      if (!markSheetData[studentName][examName][questionNumber]) {
        markSheetData[studentName][examName][questionNumber] = {};
      }

      markSheetData[studentName][examName][questionNumber][partNumber] = {
        obtainedMarks,
        gradingId,
        totalMarks,
        weightage,
        assessmentId,
        questionTotalMarks,
        clo,
      };
    });

    res.json(markSheetData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve mark sheet data" });
  }
};
