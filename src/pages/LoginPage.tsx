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
  CircularProgress,
  Paper,
  Link
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosInstance from "../api/axiosConfig";
import AuthNavbar from "../components/AuthNavbar";
import { useAuth } from "../context/AuthContext";
import { userService } from '../services/userService';
import blackLogo from '../assets/black_on_trans.png';
import loginBg from '../assets/Login.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Attempting login...');
      const response = await userService.login(form.username, form.password);
      console.log('Login response:', response);
      
      if (!response.access || !response.user_id || !response.username) {
        throw new Error('Invalid login response');
      }

      console.log('Setting auth context...');
      login(response.access, response.username, response.user_id);
      console.log('Navigating to profile...');
      navigate('/profile', { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid username or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        background: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={blackLogo}
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
        <Box sx={{ width: "100%", position: "absolute", top: 0, zIndex: 10 }}>
          <AuthNavbar color="black" />
        </Box>
        <Container maxWidth="xs" sx={{ mt: "80px" }}>
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'white',
              borderRadius: '24px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Welcome Back
              </Typography>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%',
                    '& .MuiAlert-icon': {
                      color: '#d32f2f'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
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
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  mt: 2,
                  bgcolor: 'black',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Login"}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    '& a': {
                      color: 'black',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                      '&:hover': {
                        opacity: 0.7
                      }
                    }
                  }}
                >
                  Don't have an account?{' '}
                  <Link 
                    component="button"
                    onClick={() => navigate('/signup')}
                    sx={{ 
                      color: 'black',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        opacity: 0.7
                      }
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
