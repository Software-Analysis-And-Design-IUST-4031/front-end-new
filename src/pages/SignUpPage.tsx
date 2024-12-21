import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress,
  Link,
  Stack
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../api/axiosConfig";
import AuthNavbar from "../components/AuthNavbar";
import { useAuth } from "../context/AuthContext";
import whiteLogo from '../assets/white_on_trans.png';
import signupBg from '../assets/Signup.png';
import { userService } from '../services/userService';

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
  const [error, setError] = useState("");
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
    const { firstname, lastname, username, email, password, confirmPassword } =
      form;

    // Basic validation
    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Username validation
    if (!validateUsername(username)) {
      setError("Username must be at least 3 characters long and can only contain letters, numbers, and underscores.");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/user/register/", {
        firstname,
        lastname,
        username,
        email,
        password,
        confirm_password: confirmPassword
      });

      console.log("Signup Response:", response.data);
      
      // Login automatically after successful registration
      const loginResponse = await userService.login(username, password);
      console.log("Login Response:", loginResponse);

      if (loginResponse.access && loginResponse.user_id) {
        login(loginResponse.access, username, loginResponse.user_id);
        navigate("/home");
      } else {
        console.error("Missing user_id in login response");
        navigate("/login");
      }
    } catch (err: any) {
      console.error("Signup Error:", err);
      
      if (err.response?.data) {
        const errorData = err.response.data;
        let errorMessage = "";

        // Handle array of errors for each field
        if (errorData.username) {
          errorMessage += `Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}. `;
        }
        if (errorData.email) {
          errorMessage += `Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}. `;
        }
        if (errorData.password) {
          errorMessage += `Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}. `;
        }
        if (errorData.confirm_password) {
          errorMessage += `Confirm Password: ${Array.isArray(errorData.confirm_password) ? errorData.confirm_password[0] : errorData.confirm_password}. `;
        }
        if (errorData.firstname) {
          errorMessage += `First Name: ${Array.isArray(errorData.firstname) ? errorData.firstname[0] : errorData.firstname}. `;
        }
        if (errorData.lastname) {
          errorMessage += `Last Name: ${Array.isArray(errorData.lastname) ? errorData.lastname[0] : errorData.lastname}. `;
        }

        // If no specific field errors, check for general error
        if (!errorMessage && errorData.detail) {
          errorMessage = errorData.detail;
        }

        // If still no error message, use a generic one
        setError(errorMessage || "Registration failed. Please try different username/email.");
      } else {
        setError("An error occurred during registration. Please try again.");
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${signupBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowY: "auto",
        backgroundColor: "#ffffff",
        height: "100vh",
        width: "100vw"
      }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={whiteLogo}
          alt="Logo"
          onClick={() => navigate('/')}
          sx={{
            height: "240px",
            width: "auto",
            position: "absolute",
            top: "-40px",
            left: "-40px",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
            },
            zIndex: 20
          }}
        />
        <Box
          sx={{ width: "100%", position: "absolute", top: 0, zIndex: 10 }}
        >
          <AuthNavbar color="white" />
        </Box>
        <Container maxWidth="xs" sx={{ mt: "40px" }}>
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              mt: 4,
              px: 4,
              py: 4,
              bgcolor: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              Create Account
            </Typography>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-icon': {
                    color: '#d32f2f'
                  }
                }}
              >
                {error}
              </Alert>
            )}
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={form.firstname}
                onChange={(e) =>
                  setForm({ ...form, firstname: e.target.value })
                }
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f8f8f8',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#f0f0f0'
                    }
                  }
                }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={form.lastname}
                onChange={(e) =>
                  setForm({ ...form, lastname: e.target.value })
                }
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f8f8f8',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#f0f0f0'
                    }
                  }
                }}
              />
            </Stack>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8f8f8',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f0f0f0'
                  }
                }
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8f8f8',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f0f0f0'
                  }
                }
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8f8f8',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f0f0f0'
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8f8f8',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f0f0f0'
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSignUp}
              disabled={loading}
              sx={{ 
                mt: 1,
                py: 1.5,
                bgcolor: 'black',
                color: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Sign Up"}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.6)',
                  '& a': {
                    color: 'black',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }
                }}
              >
                Already have an account?{' '}
                <Link 
                  component="button"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: 'black',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default SignUpPage;
