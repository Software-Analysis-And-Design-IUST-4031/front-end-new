import { useState, useEffect, SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import '@mantine/core/styles.css';
import './Login.css';
import './auth.css';
import axios from 'axios';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import { Text, Grid, Box, PasswordInput, TextInput } from '@mantine/core';
import AuthLayout from './AuthLayout';
import { useColorMode } from '../App';
import { IconArrowLeft } from '@tabler/icons-react';
import { Snackbar, Alert } from "@mui/material";
import userService from '../services/userService'; // Import userService

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

const Login = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ userName: '', password: '', api: '' }); 
  const [isSubmiting, setIsSubmiting] = useState(false);
  const navigate = useNavigate();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    return () => {
      setIsSubmiting(false);
    };
  }, []);

  const handleAlertClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'cliclaway') {
      return;
    }
    setOpen(false);
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      userName: value.trim() === '' ? 'username is required!' : '',
    }));
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: value.trim() === '' ? 'password is required!' : '',
    }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({ userName: '', password: '', api: '' });
    
    if (!userName || !password) {
      const newErrors = {
        userName: userName ? '' : 'Username is required!',
        password: password ? '' : 'Password is required!',
        api: ''
      };
      setErrors(newErrors);
      return;
    }

    setIsSubmiting(true);
    try {
      const response = await userService.login({
        username: userName,
        password: password
      });
      console.log('Login response:', response);
      const userId = response.user.user_id;
      console.log('Navigation attempted with userId:', userId);


      setSeverity('success');
      setMessage('Login successful!');
      setOpen(true);


      setTimeout(() => {
        navigate(`/${userId}/home`);
      }, 500);
      
    } catch (error: any) {
      setIsSubmiting(false);
      console.error('Login error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        const status = error.response.status;
        console.log('Error response:', { status, data: errorData });
        
        switch (status) {
          case 401:
            setMessage('Invalid username or password');
            break;
          case 404:
            setMessage('Server not found. Please try again later');
            break;
          case 500:
            setMessage('Server error. Please try again later');
            break;
          default:
            setMessage(errorData.message || 'An error occurred during login');
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setMessage('No response from server. Please check your connection');
      } else {
        // Error in setting up the request
        console.error('Error setting up request:', error.message);
        setMessage(error.message || 'An error occurred during login');
      }
    }
  };

  return (
    <AuthLayout>
      <Box
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: isDark ? '#25262B' : '#FFFFFF',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        <Button
          variant="text"
          onClick={() => navigate('/')}
          startIcon={<IconArrowLeft size={20} />}
          sx={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: isDark ? '#909296' : '#495057',
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          Back
        </Button>

        <form className='login-form' onSubmit={handleSubmit}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: isDark ? '#FFFFFF' : '#1A1B1E'
          }}>
            Login
          </h1>

          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={userName}
                onChange={handleUsernameChange}
                error={errors.userName}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`
                  },
                  label: {
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  }
                }}
              />
            </Grid.Col>

            <Grid.Col span={12} mt="md">
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`
                  },
                  label: {
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  },
                  innerInput: {
                    color: isDark ? '#FFFFFF' : '#1A1B1E'
                  }
                }}
                visibilityToggleIcon={({ reveal }) => 
                  reveal ? <EyeOff size={20}/> : <EyeCheck size={20}/>
                }
              />
            </Grid.Col>

            <Grid.Col span={12} mt="xl">
              <Button
                type='submit'
                variant='contained'
                disabled={isSubmiting}
                fullWidth
                sx={{
                  backgroundColor: isDark ? '#228BE6' : '#1A1B1E',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: isDark ? '#1C7ED6' : '#373A40'
                  },
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              > 
                {isSubmiting ? 'Signing in...' : 'Login'}
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Box>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleAlertClose} severity={severity} sx={{width: '235px', height: '90px', textAlign: 'center'}}>
            {message}
          </Alert>
        </Snackbar>
    </AuthLayout>
  );
};

export default Login;