import React, { useContext, useEffect, useState } from 'react'

import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { UserContext } from '../context/UserContext';
import { getCoursesByTeacher } from '../apiCalls';
import { Link } from 'react-router-dom';

const Teacherdashheader = () => {
  const [Course, setCourse] = useState();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchTeacherCourses();
    console.log(user);
  }, [user]);

  const fetchTeacherCourses = async () => {
    try {
      var res = await getCoursesByTeacher({ teacherId: user.id });
      if (res) {
        console.log(res);
        setCourse(res.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div>
       <div class="container-fluid">
    <div className='row tophead'>
      <div class="dropdown col-md-2 block">
  <button type="button" class="btn  rounded-0 text-white" data-bs-toggle="dropdown">
    My Courses<KeyboardArrowDownIcon/>
  </button>
  <ul class="dropdown-menu ">

    {
      Course?.map((course)=>{

        return(

        
        <li><a class="dropdown-item" href="#"><AutoStoriesIcon sx={{fontSize:'18px'}}/>{course.name} - {course.courseType}</a>
    
    {(course.weightage < 100 && course.mainCourse == 0) ||
                      (course.weightage < 50 && course.mainCourse != 0) ? (
                        <ul class="dropdown-menu dropdown-submenu bg-white">
                        <li>
                          <Link class="dropdown-item" to={"/setweight/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Set Weightage</Link>
                        </li>

                      </ul>
                      ):   <ul class="dropdown-menu dropdown-submenu">
                      <li>
                        <Link class="dropdown-item" to={"/coursedashboard/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Dashboard</Link>
                      </li>
                      <li>
                        <Link class="dropdown-item"  to={"/participants/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/>  Participants</Link>
                      </li>
                      <li>
                        <Link class="dropdown-item"  to={"/assessmentdashboard/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Add Exam</Link>
                      </li>
                      <li>
                        <Link class="dropdown-item"  to={"/Scoreboard/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Scoreboard</Link>
                      </li>
                      <li>
                        <Link class="dropdown-item"  to={"/courseplan/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Course Plan</Link>
                      </li>
                      <li>
                          <Link class="dropdown-item" to={"/setweight/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Set Weightage</Link>
                        </li>
                      <li>
                        <Link class="dropdown-item"  to={"/addattendance/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> Add Attendance</Link>
                      </li>
                      <li>
                        <Link class="dropdown-item"  to={"/viewattendance/"+course.id}><ViewTimelineIcon sx={{fontSize:'18px'}}/> View Attendance</Link>
                      </li>
                    </ul>}
     
        </li>
        )  })
    }
  
  
  </ul>
</div>
</div>
</div>
    </div>
  )
}

export default Teacherdashheader;
