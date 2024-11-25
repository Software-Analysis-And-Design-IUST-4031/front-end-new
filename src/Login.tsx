import { useState } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import '@mantine/core/styles.css';
import './Login.css'
import axios from 'axios'
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import { MantineProvider, Text, Grid, Box, PasswordInput, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom'

const Login = () => {
const [userName, setUserName] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({ userName: '', password: '' }); 
const [isSubmiting, setIsSubmiting] = useState(false);

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
  const navigate = useNavigate();
  if (!userName || !password) {
    const newErrors = {userName: userName ? '' : 'username is required!',
    password: password ? '' : 'password is required!'};
    setErrors(newErrors);
    return;
  }

  setIsSubmiting(true);
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/user/login/', {
        username: userName,
        password: password,
      } 
    );

    const access_token = response.data.access;
    localStorage.setItem('access_token', access_token);

    const message = JSON.stringify(response.data) || 'login successful!';
    alert(message);
    setTimeout(() => {navigate("/home")}, 3000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || 'Error occured during login!';
      alert(errorMessage);
      setTimeout(() => {setIsSubmiting(false)}, 3000);
    } 
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
                      right: -91
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
    </MantineProvider>
  );
}

export default Login