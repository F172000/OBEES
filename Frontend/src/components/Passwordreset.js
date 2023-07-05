import React, { useContext, useState } from "react";
import { Grid, Paper, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { updatePassword } from "../apiCalls";
import { UserContext } from "../context/UserContext";
const Passwordreset = () => {
  const { user } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
    } else if (newPassword.length < 6) {
      toast.error("New password should be at least 6 characters long");
    } else {
      try {
        var res = await updatePassword({
          id: user.id,
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
        if (res) {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          toast.success("Password updated successfully");
        }
      } catch (error) {
        console.log("Error", error);
        toast.error(error.response.data.Message);
      }
    }
  };

  return (
    <div>
      <Paper
        elevation={1}
        sx={{
          padding: "30px",
          marginTop: "30px",
          marginBottom: "30px",
          marginLeft: "35%",
          marginRight: "35%",
        }}
      >
        <div className="row mb-3">
          <div className="col-md-12 d-flex justify-content-center">
            <p className="modalhtag quizheading">Reset Password</p>
          </div>
        </div>
        <div className="row">
          <div class="col">
            <label for="currentPassword" class="form-label modalcontent">
              Enter Current Password
            </label>
            <input
              type="password"
              class="form-control text-start mb-3 Popup"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div class="col">
            <label for="newPassword" class="form-label modalcontent">
              Enter New Password
            </label>
            <input
              type="password"
              class="form-control text-start mb-3 Popup"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div class="col">
            <label for="confirmPassword" class="form-label modalcontent">
              Enter Confirm Password
            </label>
            <input
              type="password"
              class="form-control text-start mb-3 Popup"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12 d-flex justify-content-center">
            <Button
              className="rounded"
              variant="contained"
              sx={{ bgcolor: " #346448" }}
              onClick={handlePasswordReset}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Passwordreset;
