import React, { useState, SyntheticEvent } from 'react';
import { 
  Button, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  IconButton, 
  InputAdornment, 
  Alert, 
  Snackbar 
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { useColorMode } from '../App';
import { useAuth } from '../AuthContext';
import axios from 'axios';

interface LoginErrors {
  userName: string;
  password: string;
  api: string;
}

interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    is_active: boolean;
    is_admin: boolean;
    date_joined: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const { login: authLogin } = useAuth();

  // State Variables
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({
    userName: '',
    password: '',
    api: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Visibility State
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Handlers
  const handleAlertClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const togglePasswordVisibility = (): void => setShowPassword(!showPassword);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      userName: value.trim() === '' ? 'Username is required!' : '',
    }));
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: value.trim() === '' ? 'Password is required!' : '',
    }));
  }

  // Form Submission Handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate Inputs
    if (!userName.trim() || !password.trim()) {
      const newErrors: LoginErrors = {
        userName: userName.trim() ? '' : 'Username is required!',
        password: password.trim() ? '' : 'Password is required!',
        api: '',
      };
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // API Call to login
      const response = await axios.post<LoginResponse>('http://localhost:8000/api/user/login/', {
        username: userName,
        password: password
      });

      if (response.data.token) {
        const token = response.data.token;
        authLogin(token, response.data.user.username);

        setSeverity('success');
        setMessage('Login successful!');
        setOpen(true);

        // Navigate to user's home after a short delay
        setTimeout(() => {
          navigate(`/${response.data.user.username}/home`);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      setSeverity('error');
      if (error.response && error.response.data && error.response.data.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage('An error occurred during login.');
      }
      setOpen(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        api: 'Invalid username or password.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Box
        style={{
          width: '100%',
          backgroundColor: isDark ? '#25262B' : '#FFFFFF',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          position: 'relative',
          margin: '20px'
        }}
      >
        <Button
          variant="text"
          onClick={() => navigate('/')}
          startIcon={<ArrowBack />}
          sx={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: isDark ? '#909296' : '#495057',
            minWidth: 'auto',
            padding: '8px',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          Back
        </Button>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <Typography variant="h5" component="h1" gutterBottom style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: isDark ? '#FFFFFF' : '#1A1B1E',
            fontSize: '24px',
            fontWeight: 600
          }}>
            Login
          </Typography>

          <Grid container spacing={2}>
            {/* Username Field */}
            <Grid item xs={12}>
              <TextField
                required
                label="Username"
                placeholder="Enter your username"
                value={userName}
                onChange={handleUsernameChange}
                error={!!errors.userName}
                helperText={errors.userName}
                disabled={isSubmitting}
                fullWidth
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&:hover fieldset': {
                      borderColor: '#228be6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                required
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isSubmitting}
                fullWidth
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&:hover fieldset': {
                      borderColor: '#228be6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button 
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#FFFFFF',
                  height: '50px',
                  '&:hover': {
                    backgroundColor: '#115293'
                  },
                  '&:disabled': {
                    backgroundColor: isDark ? '#373A40' : '#E9ECEF',
                    color: isDark ? '#909296' : '#ADB5BD'
                  }
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Signup Link */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account? 
            <Button 
              color="primary" 
              onClick={() => navigate('/signup')}
              sx={{ ml: 1 }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>

        {/* Snackbar for Alerts */}
        <Snackbar 
          open={open} 
          autoHideDuration={6000} 
          onClose={handleAlertClose} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleAlertClose} 
            severity={severity} 
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </AuthLayout>
  );
}

export default Login;