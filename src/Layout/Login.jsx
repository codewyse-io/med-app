import React, { useContext, useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiConfig from "../ApiConfig/ApiConfig";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/Auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import Btn from "../CommonComponenet/CommonButtons/Btn";
import CancelBtn from "../CommonComponenet/CommonButtons/CancelBtn";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState(new Array(6).fill("")); // Array for 6 inputs
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const auth = useContext(AuthContext);

  const inputsRef = useRef([]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      loginHandler(values);
    },
  });

  const loginHandler = async (values) => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: ApiConfig.login,
        data: {
          identity: values?.email,
          password: values?.password,
        },
      });

      if (response?.data?.error === "false") {
        const data = response?.data?.data;
        console.log("adgsdgsadgas", data);
        if (data?.enabled2FA === "true" && data?.verified2FA === "true") {
          // Show verification modal if 2FA is enabled but not yet verified
          setOpen(true);
          setLoading(false);
          window.localStorage.setItem("UhuruMedToken", data?.token);
        } else {
          // Proceed with normal login
          toast.success(response.data?.message);
          auth.checkLogin(data?.token);
          window.localStorage.setItem("UhuruMedToken", data?.token);
          window.localStorage.setItem("userData", JSON.stringify(data));
          auth.getProfileData();
          auth.setIsLogin(true);
          setLoading(false);
          let path = "/dashboard"; // default for ADMIN
          if (data?.userType === "DOCTOR") path = "/doctor-dashboard";
          else if (data?.userType === "USER") path = "/user-dashboard";

          setTimeout(() => {
            navigate(path);
          }, 2000);
          // setTimeout(() => {
          //   navigate("/dashboard");
          // }, 2000);
        }
      } else {
        setLoading(false);
        toast.error(response.data?.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Handlers for 2FA dialog
  const onClose = () => {
    setOpen(false);
    setCode(new Array(6).fill(""));
    setError("");
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      // allow only single digit or empty
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      setError("");

      // Move focus to next input if digit entered
      if (val && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        // If current input has a value, clear it
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        setError("");
      } else if (index > 0) {
        // Move focus back if current empty
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const verify2FAHandler = async () => {
    const token = window.localStorage.getItem("UhuruMedToken");
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      setError("Code must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      // Call API to verify 2FA code
      const response = await axios.post(
        ApiConfig.verify2FA,
        {
          code: enteredCode,
          // token: window.localStorage.getItem("UhuruMedToken"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error === "false") {
        const data = response?.data?.data;
        toast.success("Two-factor authentication successful");
        auth.checkLogin(response?.data?.data?.token);
        window.localStorage.setItem(
          "UhuruMedToken",
          response?.data?.data?.token
        );
        window.localStorage.setItem(
          "userData",
          JSON.stringify(response.data?.data)
        );
        auth.getProfileData();
        auth.setIsLogin(true);
        auth.setIsLogin(true);
        setLoading(false);
        setOpen(false);
        setCode(new Array(6).fill(""));
        setError("");
        setLoading(false);
        let path = "/dashboard"; // default for ADMIN
        if (data?.userType === "DOCTOR") path = "/doctor-dashboard";
        else if (data?.userType === "USER") path = "/user-dashboard";

        setTimeout(() => {
          navigate(path);
        }, 2000);
      } else {
        setError(response.data.message || "Invalid authentication code");
        setLoading(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed");
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/signUp");
  };

  const handlePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "#ffffffab",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 4,
          background: "linear-gradient(to bottom right, #0077CC, #ffffff9c)",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          mb={2}
          style={{ color: "#fff" }}
        >
          Please enter your <span style={{ color: "#0077CC" }}>Login</span>{" "}
          details
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Typography
            variant="h5"
            mt={2}
            mb={0.5}
            style={{ fontSize: "18px", color: "#fff" }}
          >
            Email
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            id="email"
            name="email"
            placeholder="Enter email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              sx: {
                borderRadius: 3,
                backgroundColor: "#fff",
                height: 50,
                fontSize: "16px",
                "& input::placeholder": {
                  fontSize: "0.8rem",
                },
              },
            }}
          />

          <Typography
            variant="h5"
            mt={2}
            mb={0.5}
            style={{ fontSize: "18px", color: "#fff" }}
            // onClick={() => setOpen(true)}
          >
            Password
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              sx: {
                borderRadius: 3,
                backgroundColor: "#fff",
                height: 49,
                fontSize: "16px",
                "& input::placeholder": {
                  fontSize: "0.8rem",
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePassword} edge="end">
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 999,
              backgroundColor: "#2e5ad5",
              fontSize: "1rem",
              textTransform: "none",
              ":hover": {
                backgroundColor: "#2e5ad5",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" mt={2}>
          New user?{" "}
          <Link
            href="#"
            underline="none"
            sx={{ color: "#2e5ad5", fontWeight: 500 }}
            onClick={handleSignUp}
          >
            Sign-Up
          </Link>
        </Typography>
      </Paper>

      <Dialog
        open={open}
        // onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "10px", // Set border radius
            p: 2, // Add padding (optional, adjust as needed)
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            fontWeight: "bold",
            fontSize: "1.25rem",
            // backgroundColor: "#f5f5f5",
            position: "relative",
            textAlign: "center",
          }}
        >
          Two-Factor Authentication
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Typography
            variant="body1"
            gutterBottom
            style={{ color: "#000", textAlign: "center" }}
          >
            Enter the 6-digit code from Google Authenticator to verify.
          </Typography>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            maxWidth={400}
            mx="auto"
          >
            {code.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: {
                    textAlign: "center",
                    fontSize: 24,
                    height: "50px",
                    padding: 0,
                  },
                }}
                sx={{
                  width: 50,
                  height: 50,
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    padding: 0,
                    "& input": {
                      height: 50,
                      padding: 0,
                      textAlign: "center",
                      fontSize: 24,
                      boxSizing: "border-box",
                    },
                  },
                }}
                error={Boolean(error)}
              />
            ))}
          </Box>
          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 1, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically if needed
          }}
        >
          <Button
            fullWidth
            onClick={() => verify2FAHandler()}
            variant="contained"
            sx={{
              mt: 3,
              py: 1,
              borderRadius: 999,
              backgroundColor: "#2e5ad5",
              fontSize: "1rem",
              textTransform: "none",
              width: "150px",
              ":hover": {
                backgroundColor: "#2e5ad5",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Button>
          {/* <Btn label="Submit" onClick={() => verify2FAHandler()} /> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
