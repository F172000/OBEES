import React, { useState, useContext, useEffect } from "react";
import sir from "../images/sir.png";
import Avatar from "react-avatar-edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar as MaterialUIAvatar } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, Paper, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import { updateTeacher } from "../apiCalls";
import { toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const Profile = () => {
  const { user, setUserAndToken } = useContext(UserContext);
  useEffect(() => {
    // Update state variables with user data
    if (user) {
      setFirstname(user.name || "");
      // setLastname(user.lastname || "");
      setEmail(user.email || "");
      setDesignation(user.position || "");
      setCampus(user.campus || "");
      setDepartment(user.department || "");
    }
  }, [user]);
  const [firstname, setFirstname] = useState(user?.name || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [campus, setCampus] = useState(user?.campus || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [open, setOpen] = React.useState(false);
  const [imgCrop, setimgCrop] = useState(false);
  const [storeimg, setstoreimg] = useState([]);

  const saveImage = () => {
    setstoreimg([...storeimg, { imgCrop }]);
    setOpen(false);
  };
  const onCrop = (view) => {
    setimgCrop(view);
  };
  const onClose = () => {
    setimgCrop(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };

  const handleCampusChange = (e) => {
    setCampus(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Submiited");
    if (!firstname || !designation || !department || !email || !campus) {
      toast.error("Kindly fill all input fields");
    } else {
      try {
        var img = user.image;
        if (imgCrop) {
          img = imgCrop;
        }
        const data = {
          id: user.id,
          name: firstname,
          email: email,
          position: designation,
          campus: campus,
          departmentName: department,
          image: img,
        };
        var res = await updateTeacher(data);
        if (res) {
          console.log("Res", res);
          toast.success("Profile Updated");
          localStorage.setItem("obeUser", JSON.stringify(res.data.data));
          localStorage.getItem("obeToken", res.data.token);
          setUserAndToken(res.data.data, res.data.token);
        }
      } catch (error) {
        toast.error("Error profile not updated");
        console.log("Error", error);
      }
    }
  };
  return (
    <div className="mb-5">
      <Box className="container-fluid">
        <Paper
          elevation={5}
          sx={{
            padding: "30px",
            marginTop: "30px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Grid container spacing={2} alignContent="center">
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                marginTop: "10px",
                marginLeft: "50px",
                marginRight: "50px",
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            >
              <div className="row mt-2">
                {/* <div className='col-md-6 col-xs-12 mt-5 mb-1 '> */}
                {/* <Badge color='success' overlap="circular" badgeContent={<a className="nav-link" href="//#"><ModeEditIcon sx={{fontSize:'20px'}}/></a>}> */}
                <div className="col-md-6 col-xs-12  offset-md-6 mt-4">
                  <IconButton onClick={handleClickOpen}>
                    <ModeEditIcon
                      sx={{
                        fontSize: "20px",
                        color: "#346448",
                        marginLeft: "6px",
                      }}
                    />
                  </IconButton>
                </div>
                <div className="col-md-6 col-xs-12 offset-md-2 mb-1 ">
                  <MaterialUIAvatar
                    alt="Remy Sharp"
                    src={imgCrop.length ? imgCrop : user?.image}
                    sx={{
                      bgcolor: " #346448",
                      width: "170px",
                      height: "170px",
                      marginLeft: "12px",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{
                        width: "150px",
                        height: "150px",
                        color: "//#F5B204",
                      }}
                    />
                  </MaterialUIAvatar>
                  <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleClose}
                    >
                      Update Profile Pic
                    </BootstrapDialogTitle>
                    <DialogContent>
                      <Avatar
                        width={400}
                        height={300}
                        onClose={onClose}
                        onCrop={onCrop}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={saveImage}>
                        Save
                      </Button>
                    </DialogActions>
                  </BootstrapDialog>
                </div>
                {/* </Badge> */}
                {/* </div> */}
                {/* <div className='col-md-4 col-xs-3  offset-md-1 mt-4'> */}
                {/* </div> */}
              </div>
              <div className="row mr-10">
                <div className="col-md col-sx-12 ">
                  <p className=" mt-4 profileinfo">{user?.name}</p>
                  <p className="alignment mt-3 ">
                    Department: {user?.department}
                  </p>
                  <p className="alignment ">{user?.campus}</p>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={3}
                sx={{
                  bgcolor: "#346448",
                  padding: "40px",
                  paddingRight: "30px",
                  margin: "10px",
                  marginRight: "30px",
                  marginLeft: "5px",
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <h3 className=" mb-3  personalinfo  row text-left ">
                      Profile Info
                    </h3>
                  </div>
                  <div className="col-md-1 offset-md-5">
                    <IconButton>
                      <ModeEditIcon
                        className="edit"
                        style={{ color: "#FFFFFF" }}
                      />
                    </IconButton>
                  </div>
                </div>
                <div>
                  <div className="row mb-1 mt-1">
                    <div className="col-md-4">
                      <label
                        htmlFor="fname"
                        className="form-label mt-2 mr-6 row text-left text-white textstyle labelinfo"
                      >
                        Name:
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control form labelinfo text-dark"
                        id="fname"
                        placeholder="Enter First Name"
                        name="FirstName"
                        value={firstname}
                        onChange={handleFirstnameChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-1">
                    <div className="col-md-4">
                      <label
                        htmlFor="designation"
                        className="form-label mt-2 mr-6 text-white row text-left textstyle labelinfo"
                      >
                        Designation
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control form labelinfo text-dark"
                        id="designation"
                        placeholder="Designation"
                        name="designation"
                        value={designation}
                        onChange={handleDesignationChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-md-4">
                      <label
                        htmlFor="department"
                        className="form-label mt-2 mr-6 text-white row text-left textstyle labelinfo"
                      >
                        Department:
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control form labelinfo text-dark"
                        id="department"
                        placeholder="Enter Department"
                        name="department"
                        value={department}
                        onChange={handleDepartmentChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-md-4">
                      <label
                        htmlFor="email"
                        className="form-label mt-2 mr-6 text-white row text-left textstyle labelinfo"
                      >
                        Email:
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control form labelinfo text-dark"
                        id="email"
                        placeholder="Enter Email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-1">
                    <div className="col-md-4">
                      <label
                        htmlFor="campus"
                        className="form-label mt-2 mr-6 text-white row text-left textstyle labelinfo"
                      >
                        Campus:
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control form labelinfo text-dark"
                        id="campus"
                        placeholder="Enter Campus"
                        name="campus"
                        value={campus}
                        onChange={handleCampusChange}
                      />
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <div className=" d-flex justify-content-end">
            <Button
              variant="contained"
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
                marginRight:'2.5em',
                backgroundColor: "#346448",
              }}
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default Profile;
