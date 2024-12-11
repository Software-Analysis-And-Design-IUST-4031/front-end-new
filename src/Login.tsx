import { useState, SyntheticEvent } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import '@mantine/core/styles.css';
import './Login.css'
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import { MantineProvider, Text, Grid, Box, PasswordInput, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom'
import { Snackbar, Alert } from "@mui/material"
import userService from './services/userService';

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

interface ErrorResponse {
  message: string;
}

const Login = () => {
const navigate = useNavigate();
const [open, setOpen] = useState(false);
const [severity, setSeverity] = useState<'success' | 'error'>('success');
const [message, setMessage] = useState('');
const [userName, setUserName] = useState('');
const [password, setPassword] = useState('');
const [isSubmiting, setIsSubmiting] = useState(false);
const [errors, setErrors] = useState({ userName: '', password: '' }); 
const [visible, setVisible] = useState(false);

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

const handleSubmit = async (event: SyntheticEvent) => {
  event.preventDefault();
  setIsSubmiting(true);

  try {
    const response = await userService.login({
      username: userName,
      password: password
    });

    // Set success message
    
    // Store user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.user.user_id.toString());
    
    // Navigate immediately
    const userId = response.user.user_id;
    console.log('Token:', response.token);
    console.log('User ID:', userId);
    console.log('Navigating to:', `user/${userId}/home`);
    setSeverity('success');
    setMessage(`${userId}`);
    setOpen(true);

    
    // Navigate without timeout
    navigate(`user/${userId}/home`, { replace: true });
  } catch (error) {
    const errorMessage = (error as any)?.response?.data?.message || 'Error occurred during login!';
    setSeverity('error');
    setMessage(errorMessage);
    setOpen(true);
    setIsSubmiting(false);
  }
};

  return (
    <MantineProvider>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundSize: 'cover',
          margin: '0 auto',
          marginBottom: '100px',
          padding: '10px 10px 10px 10px',
          paddingTop: '0px',
          paddingLeft: '1px',
          paddingRight: '0px',
          border: '2px solid rgba(0, 0, 0, 0.158)',
          borderRadius: '12px',
          backdropFilter: 'blur(5px) brightness(1)',
          WebkitBackdropFilter: 'blur(7px) brightness(1)',
          boxShadow: '10 4px 8px rbga(0, 0, 0, 10)'
        }}
      >
        <form className='login-form' onSubmit={handleSubmit}>
        <h1>Login</h1>
          <Grid justify='left'>
            <Grid.Col span={8}>
              <label>
                <TextInput 
                  label='Username'
                  type='text'
                  name="user_name"
                  value={userName}
                  onChange={handleUsernameChange}
                  placeholder='enter your username'
                  error={errors.userName}
                  styles={{
                    input: {
                      width: '257px',
                      borderRadius: '7px'
                    },
                    label: {
                      fontSize: '15px',
                      fontWeight: '550',
                      marginBottom: '7px'
                    }}}
                />
              </label>
            </Grid.Col>
          </Grid>
          <Grid justify='left'>
          <Grid.Col span={8}>
              <label>
                <PasswordInput
                  label="Password"
                  placeholder="enter your password"
                  defaultValue="secret"
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  withAsterisk
                  styles={{
                    input: {
                      width: '257px',
                      borderRadius: '7px'
                    },
                    label: {
                      fontSize: '15px',
                      fontWeight: '550',
                      marginBottom: '7px',
                      marginLeft: '0px'
                    },
                    visibilityToggle: {
                      color: 'white',
                      backgroundColor: 'black',
                      right: -1
                    }
                  }}
                  visibilityToggleButtonProps={({ reveal, size }: {reveal: boolean; size: number}) => reveal ? <EyeOff size={size}/> : <EyeCheck size={size}/>}
                />
              </label>
            </Grid.Col>
          </Grid>
          <Grid justify='center'>
            <Grid.Col>
            <Button
                type='submit'
                variant='contained'
                disabled={isSubmiting}
                fullWidth
                sx={{
                  color: 'white',
                  backgroundColor: ' black',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black'
                  },
                  mt: 0.25,
                  py: 0.7,
                  borderRadius: '7px'
                }}
              > 
                login
              </Button>
            </Grid.Col>
          </Grid>
          <Grid justify='left' gutter={0}>
              <Text size='md' style={{
                color: 'black',
                fontWeight: 'normal'
                }}>
                Don't have an account ? 
              </Text>
              <Link to="/SignUp" style={{
                color: 'blue',
                marginLeft: '5px',
                textDecoration: 'underline',
                display: 'block',
                textAlign: 'right'
              }}>
                SignUp
              </Link>
          </Grid>
        </form>
      </Box>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleAlertClose} severity={severity} sx={{width: '235px', height: '90px', textAlign: 'center'}}>
            {message}
          </Alert>
        </Snackbar>
    </MantineProvider>
  );
}

export default Login
