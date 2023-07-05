import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/", // Update the base URL to match your backend API address
});
// Get the token from localStorage
// const token = localStorage.getItem("obeToken");

// // Add the Authorization header to the Axios instance if the token exists
// if (token) {
//   api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

/////

export function login(data) {
  return api.post("/auth/login", data);
}

/////fetch all cources
export function getCourses(data) {
  return api.post("/course/all", data);
}

/////fetch un assigned cources
export function getunAssignedCources(data) {
  return api.post("/course/unassigned", data);
}
/////Assign cources
export function assignCourse(data) {
  return api.post("/course/assign", data);
}

/////Get teacher cources
export function getCoursesByTeacher(data) {
  return api.post("/course/teacher", data);
}

/////fetch all teachers
export function getTeachers(data) {
  return api.post("/teacher/all", data);
}
/////Update teachers
export function updateTeacher(data) {
  return api.post("/teacher/update", data);
}
/////Update Password
export function updatePassword(data) {
  return api.post("/teacher/update_password", data);
}

///Set weightage
export function assignWeightage(data) {
  return api.post("/AddAssessment", data);
}

///Get Assismensts By Course
export function ShowAssessment(data) {
  return api.post("/ShowAssessment", data);
}

///Update Assismensts By Course
export function UpdateAssessment(data) {
  return api.post("/UpdateAssessment", data);
}
///Update Assismensts By Course
export function DeleteAssessment(data) {
  return api.post("/DeleteAssessment", data);
}

//Get Course By ID
export function getCourseById(data) {
  return api.post("/course/getCourseById", data);
}
//Add course PLan
export function AddCoursePlan(data) {
  return api.post("/course/AddCoursePlan", data);
}
//Update course PLan
export function UpdateCoursePlan(data) {
  return api.post("/course/UpdateCoursePlan", data);
}
//Delete course PLan
export function DeleteCoursePlan(data) {
  return api.post("/course/DeleteCoursePlan", data);
}
//View course PLan by course
export function viewCoursePlan(data) {
  return api.post("/course/viewCoursePlan", data);
}

//Save Exam
export function addExam(data) {
  return api.post("/AddExam", data);
}
//Get ExamCount By ID
export function countExam(data) {
  return api.post("/countExam", data);
}

////Enroll Student

export function enrollStudent(data) {
  return api.post("/enroll_student", data);
}

//Get students by course
export function getStudentsByCourse(data) {
  return api.post("/getstudents_bycourse", data);
}

export function getScoreBasedonCourse(data) {
  return api.post("/scores", data);
}

////Save Attendance
export function saveAttendanece(data) {
  return api.post("/save_attendance", data);
}
////View Attendance
export function viewAttendance(data) {
  return api.post("/view_attendance", data);
}
////Update Attendance
export function updateAttendance(data) {
  return api.post("/update_attendance", data);
}
////Get Extra Attendance
export function getExtraAttendance(data) {
  return api.post("/get_extra_attendance", data);
}
////Add Extra Attendance
export function addExtraAttendance(data) {
  return api.post("/add_extra_attendance", data);
}

//Get Exams
export function getExamsByAssisment(data) {
  return api.post("/ShowExam", data);
}
//Get Exams Questions
export function getQuestionsByExam(data) {
  return api.post("/ShowExamQuestion", data);
}

///Get Question Parts

export function getQuestionParts(data) {
  return api.post("/ShowQuestionPart", data);
}

///Get Graddings
export function getGrades(data) {
  return api.post("/getGradesbycourse", data);
}
///Get All Exams By course
export function getAllExamsByCourse(data) {
  return api.post("/showAllExam", data);
}
///Get  Exams By course
export function getMarkSheet(data) {
  return api.post("/getMarkSheetData", data);
}
export function getFinalMarkSheet(data) {
  return api.post("/getFinalMarkSheetData", data);
}

//Update Grades
export function updateGrades(data) {
  return api.post("/updateGrades", data);
}

///View Attendance//

export function getAttendace(data) {
  return api.post("/View", data);
}

////Calculate Clo

export function calculateClo(data) {
  return api.post("/calculateClo", data);
}
export function calculateFinalClo(data) {
  return api.post("/calculateFinalClo", data);
}

////Get Clos
export function getClo(data) {
  return api.post("/getClo", data);
}
////Get FeedBack Questions
export function getQuestions(data) {
  return api.post("/feedback-questions", data);
}
////Save FeedBack
export function saveFeedback(data) {
  return api.post("/save-feedback", data);
}
