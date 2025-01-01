import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Link,
  Stack,
  Alert,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import blackLogo from "../assets/black_on_trans.png";
import signupBg from "../assets/Signup.png";
import { userService } from "../services/userService";

interface FormErrors {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateUsername = (username: string) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleSignUp = async () => {
    const newErrors: FormErrors = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    let hasErrors = false;

    // Validate each field
    if (!form.firstname) {
      newErrors.firstname = 'First name is required';
      hasErrors = true;
    }

    if (!form.lastname) {
      newErrors.lastname = 'Last name is required';
      hasErrors = true;
    }

    if (!form.username) {
      newErrors.username = 'Username is required';
      hasErrors = true;
    } else if (!validateUsername(form.username)) {
      newErrors.username = 'Username must be at least 3 characters and contain only letters, numbers, and underscores';
      hasErrors = true;
    }

    if (!form.email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasErrors = true;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/register/", {
        firstname: form.firstname,
        lastname: form.lastname,
        username: form.username,
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPassword,
      });

      console.log("Signup Response:", response.data);

      // Login automatically after successful registration
      const loginResponse = await userService.login(form.username, form.password);
      console.log("Login Response:", loginResponse);

      if (loginResponse.access && loginResponse.user_id) {
        login(loginResponse.access, form.username, loginResponse.user_id);
        navigate("/login");
      } else {
        console.error("Missing user_id in login response");
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Signup Error:", err);

      if (err.response?.data) {
        const errorData = err.response.data;
        const newErrors: FormErrors = {
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

        // Map backend errors to form fields
        if (errorData.username) {
          newErrors.username = Array.isArray(errorData.username) 
            ? errorData.username[0] 
            : errorData.username;
        }
        if (errorData.email) {
          newErrors.email = Array.isArray(errorData.email) 
            ? errorData.email[0] 
            : errorData.email;
        }
        if (errorData.password) {
          newErrors.password = Array.isArray(errorData.password) 
            ? errorData.password[0] 
            : errorData.password;
        }
        if (errorData.confirm_password) {
          newErrors.confirmPassword = Array.isArray(errorData.confirm_password) 
            ? errorData.confirm_password[0] 
            : errorData.confirm_password;
        }
        if (errorData.firstname) {
          newErrors.firstname = Array.isArray(errorData.firstname) 
            ? errorData.firstname[0] 
            : errorData.firstname;
        }
        if (errorData.lastname) {
          newErrors.lastname = Array.isArray(errorData.lastname) 
            ? errorData.lastname[0] 
            : errorData.lastname;
        }

        setErrors(newErrors);
      } else {
        setErrors({
          ...errors,
          password: 'An error occurred during registration. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${signupBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.7)",
            transform: "scale(1.1)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            mb: 4,
            backgroundColor: "background.paper",
            borderRadius: 4,
            p: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              width: "180px",
              height: "180px",
              position: "relative",
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={blackLogo}
              alt="Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                padding: "5px",
              }}
            />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Sign Up
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
            <TextField
              label="First Name"
              variant="outlined"
              margin="dense"
              required
              fullWidth
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              disabled={loading}
              error={!!errors.firstname}
              helperText={errors.firstname}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f8f8f8",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                },
              }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              margin="dense"
              required
              fullWidth
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              disabled={loading}
              error={!!errors.lastname}
              helperText={errors.lastname}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f8f8f8",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                },
              }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="dense"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
            error={!!errors.username}
            helperText={errors.username}
            sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="dense"
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="dense"
            required
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            margin="dense"
            required
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            disabled={loading}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 0.5,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSignUp}
            disabled={loading}
            sx={{
              mt: 0.5,
              mb: 0.5,
              py: 0.75,
              fontSize: "0.95rem",
              fontWeight: 600,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(45deg, #2196F3 60%, #21CBF3 90%)",
                transform: "scale(1.02)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {"Sign In"}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage;
