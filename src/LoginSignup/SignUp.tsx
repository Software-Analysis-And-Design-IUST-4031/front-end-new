import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import '@mantine/core/styles.css';
import './SignUp.css';
import './auth.css';
import axios from 'axios';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import { Text, Grid, Box, PasswordInput, TextInput } from '@mantine/core';
import AuthLayout from './AuthLayout';
import { useColorMode } from '../App';

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    firstName: '', 
    lastName: '', 
    userName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    api: ''
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  // Only redirect to home if user is already authenticated
  useEffect(() => {
    return () => {
      // Cleanup authentication check on unmount
      setIsSubmiting(false);
    };
  }, []);

  const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFirstName(value);
    setErrors(prev => ({ ...prev, firstName: '', api: '' }));
  }

  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLastName(value);
    setErrors(prev => ({ ...prev, lastName: '', api: '' }));
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
    setErrors(prev => ({ ...prev, userName: '', api: '' }));
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: '', confirmPassword: '', api: '' }));
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors(prev => ({ ...prev, confirmPassword: '', api: '' }));
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: '', api: '' }));
  }

  const validateForm = () => {
    const newErrors = {
      firstName: firstName ? '' : 'First name is required!',
      lastName: lastName ? '' : 'Last name is required!',
      userName: userName ? '' : 'Username is required!',
      email: email ? '' : 'Email address is required!',
      password: password ? '' : 'Password is required!',
      confirmPassword: confirmPassword ? '' : 'Confirm password is required!',
      api: ''
    };

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address!';
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
      const response = await axios.post('http://127.0.0.1:8000/api/user/register/', {
        firstname: firstName,
        lastname: lastName,
        username: userName,
        password: password, 
        confirm_password: confirmPassword,
        email: email,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('isAuthenticated', 'true');
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/home');
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (typeof errorData === 'object' && errorData !== null) {
          // Handle field-specific errors
          const newErrors = { ...errors };
          for (const [key, value] of Object.entries(errorData)) {
            if (key in newErrors) {
              newErrors[key as keyof typeof errors] = Array.isArray(value) ? value[0] : value as string;
            }
          }
          setErrors(newErrors);
        } else {
          // Handle general error
          setErrors(prev => ({ 
            ...prev, 
            api: error.response?.data?.detail || 'Error occurred during signup!' 
          }));
        }
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
          maxWidth: '600px',
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
          sx={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            color: isDark ? '#909296' : '#495057',
            padding: '0.5rem',
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          ←
        </Button>

        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: isDark ? '#FFFFFF' : '#1A1B1E'
        }}>
          Sign Up
        </h1>

        {errors.api && (
          <Text color="red" size="sm" mb="md" ta="center">
            {errors.api}
          </Text>
        )}

        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label='First Name'
                type='text'
                name="first_name"
                value={firstName}
                onChange={handleFirstnameChange}
                error={errors.firstName}
                placeholder="Enter your first name"
                disabled={isSubmiting}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`,
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228BE6'
                    }
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

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput 
                label='Last Name'
                type='text'
                name="last_name"
                value={lastName}
                onChange={handleLastnameChange}
                error={errors.lastName}
                placeholder='Enter your last name'
                disabled={isSubmiting}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`,
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228BE6'
                    }
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

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput 
                label='Username'
                type='text'
                name="user_name"
                value={userName}
                onChange={handleUsernameChange}
                error={errors.userName}
                placeholder='Choose a username'
                disabled={isSubmiting}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`,
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228BE6'
                    }
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

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput 
                label='Email'
                type='email'
                name="email"
                value={email}
                onChange={handleEmailChange}
                error={errors.email}
                placeholder='Enter your email'
                disabled={isSubmiting}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`,
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228BE6'
                    }
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

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <PasswordInput
                label="Password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                placeholder='Create a password'
                disabled={isSubmiting}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`,
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228BE6'
                    }
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

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <PasswordInput
                label="Confirm Password"
                name="confirm_password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword}
                placeholder='Confirm your password'
                disabled={isSubmiting}
                styles={{
                  input: {
                    backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    border: `1px solid ${isDark ? '#373A40' : '#CED4DA'}`,
                    borderRadius: '8px',
                    '&:focus': {
                      borderColor: '#228BE6'
                    }
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
                {isSubmiting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Box>
    </AuthLayout>
  );
};

export default SignUp;