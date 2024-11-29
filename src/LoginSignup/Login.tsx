import { useState, useEffect } from 'react';
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

interface LoginErrors {
  userName: string;
  password: string;
  api: string;
}

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({ 
    userName: '', 
    password: '', 
    api: '' 
  }); 
  const [isSubmiting, setIsSubmiting] = useState(false);
  const navigate = useNavigate();
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  // Only redirect to home if user is already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('access_token');
    if (auth === 'true' && token) {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      // Cleanup authentication check on unmount
      setIsSubmiting(false);
    };
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
    setErrors(prev => ({ ...prev, userName: '', api: '' }));
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: '', api: '' }));
  }

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {
      userName: '',
      password: '',
      api: ''
    };

    if (!userName.trim()) {
      newErrors.userName = 'Username is required!';
    }

    if (!password) {
      newErrors.password = 'Password is required!';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmiting(true);
    try {
      // For test user
      if (userName === 'testuser' && password === 'Test@123') {
        localStorage.setItem('access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.7eMe1dyoNm0QQmkTGgVLcTMvPtZg4NE6mF5NEQ');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          firstname: 'Test',
          lastname: 'User',
          username: 'testuser',
          email: 'testuser@example.com'
        }));
        navigate('/home');
        return;
      }

      // For other users, try API
      const response = await axios.post('http://127.0.0.1:8000/api/user/login/', {
        username: userName,
        password: password,
      });

      if (response.data?.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('isAuthenticated', 'true');
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/home');
      } else {
        setErrors(prev => ({ ...prev, api: 'Invalid response from server' }));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrors(prev => ({ ...prev, api: 'Invalid username or password' }));
        } else if (error.response?.status === 404) {
          setErrors(prev => ({ ...prev, api: 'Server not found. Please try again later.' }));
        } else {
          const errorMessage = error.response?.data?.detail || 
                             error.response?.data?.message || 
                             'An error occurred during login. Please try again.';
          setErrors(prev => ({ ...prev, api: errorMessage }));
        }
      } else {
        setErrors(prev => ({ ...prev, api: 'Network error. Please check your connection.' }));
      }
    } finally {
      setIsSubmiting(false);
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

          {errors.api && (
            <Text color="red" size="sm" mb="md" ta="center" style={{ 
              backgroundColor: isDark ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)',
              padding: '0.5rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {errors.api}
            </Text>
          )}

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
    </AuthLayout>
  );
};

export default Login;