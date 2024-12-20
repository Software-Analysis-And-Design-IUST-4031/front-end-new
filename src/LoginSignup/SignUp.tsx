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

interface SignUpErrors {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  api?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const { login: authLogin } = useAuth();

  // State Variables
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    api: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Visibility State
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Toggle Functions
  const togglePasswordVisibility = (): void => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = (): void => setShowConfirmPassword(!showConfirmPassword);

  // Alert Close Handler
  const handleAlertClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  // Input Change Handlers
  const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFirstName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      firstName: value.trim() === '' ? 'First name is required!' : '',
    }));
  }

  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLastName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      lastName: value.trim() === '' ? 'Last name is required!' : '',
    }));
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      userName: value.trim() === '' ? 'Username is required!' : '',
    }));
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: value.trim() === '' ? 'Email address is required!' : '',
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

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: value.trim() === '' ? 'Please confirm your password!' : '',
    }));
  }

  // Form Submission Handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate Inputs
    if (!firstName.trim() || !lastName.trim() || !userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      const newErrors: SignUpErrors = {
        firstName: firstName.trim() ? '' : 'First name is required!',
        lastName: lastName.trim() ? '' : 'Last name is required!',
        userName: userName.trim() ? '' : 'Username is required!',
        email: email.trim() ? '' : 'Email address is required!',
        password: password.trim() ? '' : 'Password is required!',
        confirmPassword: confirmPassword.trim() ? '' : 'Please confirm your password!',
        api: ''
      };
      setErrors(newErrors);
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match!',
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      // API Call to signup
      const response = await axios.post('http://localhost:8000/api/user/register/', {
        first_name: firstName,
        last_name: lastName,
        username: userName,
        email: email,
        password: password
      });

      if (response.status === 201) {
        setSeverity('success');
        setMessage('Registration successful! You can now log in.');
        setOpen(true);

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Signup Error:', error);
      setSeverity('error');
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat();
        setMessage(errorMessages.join(' '));
      } else {
        setMessage('Registration failed. Please try again.');
      }
      setOpen(true);
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
            Sign Up
          </Typography>

          <Grid container spacing={2}>
            {/* First Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="First Name"
                placeholder="Enter your first name"
                value={firstName}
                onChange={handleFirstnameChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
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

            {/* Last Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Last Name"
                placeholder="Enter your last name"
                value={lastName}
                onChange={handleLastnameChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
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

            {/* Username Field */}
            <Grid item xs={12}>
              <TextField
                required
                label="Username"
                placeholder="Choose a username"
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

            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                required
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
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
                placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <Grid item xs={12}>
              <TextField
                required
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
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
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Signup Link */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account? 
            <Button 
              color="primary" 
              onClick={() => navigate('/login')}
              sx={{ ml: 1 }}
            >
              Login
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

export default SignUp;