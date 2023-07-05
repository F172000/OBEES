const express = require("express");
const { db } = require("./database");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

const registrationRoutes = require("./routes/registrationRoutes");
app.use("/auth/", registrationRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/course/", courseRoutes);

const teacherRoutes = require("./routes/teacherRoutes");
app.use("/teacher/", teacherRoutes);

const assessmentRoutes = require("./routes/assessmentRoutes");
app.use("/", assessmentRoutes);

const examRoutes = require("./routes/examRoutes");
app.use("/", examRoutes);

const studentsRoutes = require("./routes/studentsRoutes");
app.use("/", studentsRoutes);


const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/", attendanceRoutes);


const cloRoutes = require("./routes/cloRoutes");
app.use("/", cloRoutes);

const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/", feedbackRoutes);


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
