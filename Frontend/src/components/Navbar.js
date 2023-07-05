import React, { useContext } from "react";
import logo from "../images/logo.png";
import sir from "../images/sir.png";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, handleLogout } = useContext(UserContext);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            <img src={logo} alt="logo"></img>
            <span>Faculty Portal</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav ms-auto justify-content-start">
              {/* <li className="nav-item ">
    <div class = 'search-box'>
      <input class = "search-text" type="text" placeholder = "Search Anything"/>
    <Link to="#" class = "search-btn">
    <i class="bi bi-search "></i>
    </Link>

  </div>
  </li> */}

              <li className="nav-item ">
                {user?.type == 0 ? (
                  <Link className="nav-link" to="/hod">
                    <i class="bi bi-house-door-fill "></i> Home
                  </Link>
                ) : (
                  <Link className="nav-link" to="/Dashboard">
                    <i class="bi bi-house-door-fill "></i> Home
                  </Link>
                )}
              </li>
              <li className="nav-item ">
                <Link class="nav-link " to="/passwordreset">
                  <i class="bi bi-arrow-repeat "></i> Reset Password
                </Link>
              </li>
              <li className="nav-item ">
                <span
                  role="button"
                  class="nav-link "
                  onClick={(e) => handleLogout()}
                >
                  <i class="bi bi-box-arrow-right "></i> Logout
                </span>
              </li>

              {/* <li className="nav-item ">
                <Link to="/#">
                  <img src={user?.image} alt="Avatar" class="avatar" />
                </Link>
              </li> */}
              <li className="nav-item ">
                <Link className="nav-link" to="/profile">
                  <img src={user?.image?user?.image:sir} className="me-2 avatar" alt="Avatar" />

                  {user?.name}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
