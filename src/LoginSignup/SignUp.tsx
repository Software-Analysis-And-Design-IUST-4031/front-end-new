import { useState, useEffect, SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@mantine/core/styles.css';
import './SignUp.css';
import './auth.css';
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import { Text, Grid, Box, PasswordInput, TextInput } from '@mantine/core';
import AuthLayout from './AuthLayout';
import { useColorMode } from '../App';
import { Snackbar, Alert } from "@mui/material";

const SignUp = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({firstName: '', lastName: '', userName: '', email: '', password: '', confirmPassword: ''});
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { mode } = useColorMode();
  const isDark = mode === 'dark';

  const handleAlertClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'cliclaway') {
      return;
    }
    setOpen(false);
  }

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      firstName: value.trim() === '' ? 'first name is required!' : '',
    }));
  }

  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLastName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      lastName: value.trim() === '' ? 'last name is required!' : '',
    }));
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

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: value.trim() === '' ? 'confirm password is required!' : '',
    }));
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: value.trim() === '' ? 'email address is required!' : '',
    }));
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

    if (!firstName || !lastName || !userName || !password || !confirmPassword || !email) {
      const newErrors = {firstName: firstName ? '' : 'first name is required!', lastName: lastName ? '' : 'last name is required!',
        userName: userName ? '' : 'username is required!', email: email ? '' : 'email address is required!',
        password: password ? '' : 'password is required!', confirmPassword: confirmPassword ? '' : 'confirm password is required!'
      };
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/register/', {

          firstname: firstName,
          lastname: lastName,
          username: userName,
          password: password, 
          confirm_password: confirmPassword,
          email: email,
        } 
      );

      setOpen(true);
      setSeverity('success');
      setMessage('Signup successful! Redirecting to login...');
      setIsSubmiting(false);
      // Navigate immediately but let the success message be visible briefly
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data || 'Error occurred during signup!';
        setSeverity('error');
        setMessage(errorMessage);
        setOpen(true);
      } else if (error.request) {
        // The request was made but no response was received
        setSeverity('error');
        setMessage('No response received from server');
        setOpen(true);
      } else {
        // Something happened in setting up the request that triggered an Error
        setSeverity('error');
        setMessage(error.message || 'An unexpected error occurred');
        setOpen(true);
      }
      setTimeout(() => {setIsSubmiting(false)}, 3000);
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
                    textAlign: "left",
                    marginLeft: '0px',
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
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
                    textAlign: "left",
                    color: isDark ? '#FFFFFF' : '#1A1B1E',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem',
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
                    textAlign: "left",
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
                    textAlign: "left",
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
                    textAlign: "left",
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
                    textAlign: "left",
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
      <Snackbar open={open} autoHideDuration={5000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleAlertClose} severity={severity} sx={{width: '235px', height: '90px', textAlign: 'center'}}>
            {message}
          </Alert>
        </Snackbar>
    </AuthLayout>
  );
};

export default SignUp;