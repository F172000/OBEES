import "./App.css";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Setweight from "./components/Setweight";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Passwordreset from "./components/Passwordreset";
import Setweightdasboard from "./components/Setweightdasboard";
import Quizform from "./components/Quizform";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Publicroutes from "./components/Publicroutes";
import Courseplan from "./components/Courseplan";
import Coursedashboard from "./components/Coursedashboard";
import Assessmentdashboard from "./components/Assessmentdashboard";
import Attendance from "./components/Attendance";
import Scoreboard from "./components/Scoreboard";
import FinalScoreboard from "./components/FinalScoreboard";
import Quizscoreboard from "./components/Quizscoreboard";
import Listofassessments from "./components/Listofassessments";
import HodDashboard from "./components/HodScreens/Dashboard";
import AssignCourse from "./components/HodScreens/AssignCourses";
import AttendanceHod from "./components/HodScreens/AttendanceHod";
import Courses from "./components/HodScreens/Courses";
import CourseScore from "./components/HodScreens/CourseScore";
import View_Att from "./components/View_att";
import Add_Attendance from "./components/Add_att";
import Participants from "./components/participants";
import Clo from "./components/Clo";
import Plo from "./components/Plo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Feedback from "./components/Feedback";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route
              exact
              path="/setweight/:id"
              element={<ProtectedRoutes component={Setweight} />}
            />
            <Route
              exact
              path="quizscoreboard"
              element={<Quizscoreboard component={Setweight} />}
            />
            <Route
              exact
              path="allcourses"
              element={<ProtectedRoutes component={Courses} />}
            />
            <Route
              exact
              path="allcoursesscores"
              element={<ProtectedRoutes component={CourseScore} />}
            />
            <Route
              exact
              path="/dashboard"
              element={<ProtectedRoutes component={Dashboard} />}
            />
            <Route
              exact
              path="/viewattendance/:id"
              element={<ProtectedRoutes component={View_Att} />}
            />
            <Route
              exact
              path="/addattendance/:id"
              element={<ProtectedRoutes component={Add_Attendance} />}
            />
            <Route
              exact
              path="/participants/:id"
              element={<ProtectedRoutes component={Participants} />}
            />
            <Route
              exact
              path="/clo/:id"
              element={<ProtectedRoutes component={Clo} />}
            />
            <Route
              exact
              path="/plo/:id"
              element={<ProtectedRoutes component={Plo} />}
            />
            <Route
              exact
              path="/feedback/:id"
              element={<ProtectedRoutes component={Feedback} />}
            />
            <Route
              exact
              path="/hod"
              element={<ProtectedRoutes component={HodDashboard} />}
            />
            <Route
              exact
              path="/assignhodcources"
              element={<ProtectedRoutes component={AssignCourse} />}
            />
            <Route
              exact
              path="/listofassessments/:id"
              element={<ProtectedRoutes component={Listofassessments} />}
            />
            <Route
              exact
              path="/profile"
              element={<ProtectedRoutes component={Profile} />}
            />
            <Route
              exact
              path="/coursedashboard/:id"
              element={<ProtectedRoutes component={Coursedashboard} />}
            />
            <Route
              exact
              path="/Scoreboard/:id"
              element={<ProtectedRoutes component={Scoreboard} />}
            />
            <Route
              exact
              path="/FinalScoreboard/:id"
              element={<ProtectedRoutes component={FinalScoreboard} />}
            />
            <Route
              exact
              path="/assessmentdashboard/:id"
              element={<ProtectedRoutes component={Assessmentdashboard} />}
            />
            <Route
              exact
              path="/attendance"
              element={<ProtectedRoutes component={Attendance} />}
            />
            <Route
              exact
              path="/passwordreset"
              element={<ProtectedRoutes component={Passwordreset} />}
            />
            <Route
              exact
              path="/setweightdashboard"
              element={<Publicroutes component={Setweightdasboard} />}
            />
            <Route
              exact
              path="/courseplan/:id"
              element={<ProtectedRoutes component={Courseplan} />}
            />
            <Route
              exact
              path="/quizform/:id/:assisment_id"
              element={<ProtectedRoutes component={Quizform} />}
            />
          </Routes>
        </UserProvider>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
