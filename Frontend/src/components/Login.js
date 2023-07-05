import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import abbasynlogo from "../images/abbasynlogo.png";
import { useNavigate } from "react-router-dom";
import { InputAdornment } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { toast } from "react-toastify";
import { login } from "../apiCalls";
import { UserContext } from "../context/UserContext";
const theme = createTheme();
export default function Login() {
  const { setUserAndToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const doLogin = async () => {
    try {
      var response = await login({ email: email, password: password });

      if (response) {
        console.log(response.data);
        localStorage.setItem("obeUser", JSON.stringify(response.data.user));
        localStorage.setItem("obeToken", response.data.token);
        setUserAndToken(response.data.user, response.data.token);
        if (response.data.user.type == 0) {
          navigate("/hod");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log("Error :", error);
      toast.error("Invalid Credentials");
    }
  };

  const handleSubmit = (event) => {
    console.log(email);
    console.log(password);

    if (!email || !password) {
      toast.error("Input fields can not be empty");
      return;
    }
    doLogin();
  };
  return (
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid white",
          borderRadius: " 5px",
          padding: "25px",
          bgcolor: "white",
          boxShadow: "5",
        }}
      >
        <img style={{ margin: 6 }} src={abbasynlogo} />

        <Box
          component="Paper"
          // onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color="success"
            InputProps={{
              startAdornment: (
                <InputAdornment sx={{ color: "#346448" }} position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            color="success"
            InputProps={{
              startAdornment: (
                <InputAdornment sx={{ color: "#346448" }} position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          <Grid container>
            <Grid item md={6} xs>
              <FormControlLabel
                control={<Checkbox value="remember" />}
                label="Remember me"
              />
            </Grid>
          </Grid>

          <Button
            //  className="loginbutton"
            type="submit"
            fullWidth
            variant="contained"
            onClick={() => handleSubmit()}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#346448",
              ":hover": {
                bgcolor: "#346448",
                color: "white",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
