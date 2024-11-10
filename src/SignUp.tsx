import { useState } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import '@mantine/core/styles.css';
import './SignUp.css'
import { EyeCheck, EyeOff } from 'tabler-icons-react';
import { MantineProvider, Text, Grid, Box, PasswordInput, TextInput } from '@mantine/core';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({firstName: '', lastName: '', userName: '', email: '', password: '', confirmPassword: ''});

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

  const [isPasswordVisible] = useState(false);
 
  return (
    <MantineProvider>
      <Box 
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyItems: 'center',
          backgroundSize: 'cover',
          margin: '0 auto',
          marginBottom: '100px',
          padding: '20px 20px 20px 20px',
          paddingTop: '1px',
          paddingLeft: '20px',
          paddingRight: '20px',
          border: '2px solid rgba(0, 0, 0, 0.158)',
          borderRadius: '12px',
          backdropFilter: 'blur(5px) brightness(1)',
          WebkitBackdropFilter: 'blur(7px) brightness(1)',
          boxShadow: '10 4px 8px rbga(0, 0, 0, 10)'
        }}
      >
        <h1>Sign Up</h1>
        <form className='form'>
          <Grid>
            <Grid.Col span={6}>
            <label>
              <TextInput
                label='Firstname'
                type='text'
                name="first_name"
                value={firstName}
                onChange={handleFirstnameChange}
                error={errors.firstName}
                placeholder="enter your first name"
                labelProps={{ className:'label-aligned'}}
                styles={{
                  input: {
                    width: '230px',
                    borderRadius: '7px'
                  },
                  label: {
                    fontSize: '15px',
                    fontWeight: '550',
                    marginBottom: '5px',
                    textAlign: "left",
                    marginLeft: '0px'
                  }
                }} 
                required
              />
              </label>
            </Grid.Col>
            <Grid.Col span={6}>
              <label>
                <TextInput 
                  label='Lastname'
                  type='text'
                  name="last_name"
                  value={lastName}
                  onChange={handleLastnameChange}
                  error={errors.lastName}
                  placeholder='enter your last name'
                  labelProps={{ className:'label-aligned'}}
                  styles={{
                    input: {
                      width: '230px',
                      borderRadius: '7px'
                    },
                    label: {
                      fontSize: '15px',
                      fontWeight: '550',
                      marginBottom: '5px',
                      textAlign: "left",
                      marginLeft: '0px'
                    }}}
                  required
                />
              </label>
            </Grid.Col>
          </Grid>
          <Grid justify='left'>
            <Grid.Col span={6}>
              <label>
              <TextInput 
                  label='Username'
                  type='text'
                  name="user_name"
                  value={userName}
                  onChange={handleUsernameChange}
                  error={errors.userName}
                  placeholder='enter your username'
                  styles={{
                    input: {
                      width: '230px',
                      borderRadius: '7px'
                    },
                    label: {
                      fontSize: '15px',
                      fontWeight: '550',
                      marginBottom: '5px'
                    }}}
                  required
                />
              </label>
            </Grid.Col>
            <Grid.Col span={6}>
            <label>
            <TextInput
              label='Email' 
              type='email'
              name="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.email} 
              placeholder='enter your email address'
              styles={{
                input: {
                  width: '230px',
                  borderRadius: '7px'
                },
                label: {
                  fontSize: '15px',
                  fontWeight: '550', 
                  marginBottom: '5px'
                }}}
              required
            />
          </label>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
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
                      width: '230px',
                      borderRadius: '7px'
                    },
                    label: {
                      fontSize: '15px',
                      fontWeight: '550',
                      marginBottom: '5px',
                      marginLeft: '0px'
                    },
                    visibilityToggle: {
                      color: 'white',
                      backgroundColor: 'black',
                      right: -6
                    }
                  }}
                  visibilityToggleButtonProps={({ reveal, size }: {reveal: boolean; size: number}) => reveal ? <EyeOff size={size}/> : <EyeCheck size={size}/>}
                  required
                />
              </label>
            </Grid.Col>
            <Grid.Col span={6}>
              <label>
                <PasswordInput 
                  label="Confirm Password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.confirmPassword} 
                  placeholder='repeat your password'
                  withAsterisk
                  styles={{
                    input: {
                      width: '230px',
                      borderRadius: '7px'
                    },                
                    label: {
                      fontSize: '15px',
                      fontWeight: '550',
                      marginBottom: '5px',
                      marginLeft: '0px',
                      paddingLeft: '0px'
                    },
                    root: {
                      marginLeft: '0px',
                      paddingLeft: '0px'
                    },
                    visibilityToggle: {
                      color: 'white',
                      backgroundColor: 'black',
                      right: -7
                    }
                  }}
                  visibilityToggleButtonProps={({ reveal, size }: {reveal: boolean; size: number}) => reveal ? <EyeOff size={size}/> : <EyeCheck size={size}/>}
                  required
                />
              </label>
            </Grid.Col>
          </Grid>
          <Grid justify='center'>
            <Grid.Col>
            <Button
                variant='contained'
                fullWidth
                sx={{
                  color: 'white',
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black'
                  },
                  mt: 0.25,
                  py: 0.7,
                  borderRadius: '7px'
                }}
              > 
                submit
              </Button>
            </Grid.Col>
          </Grid>
          <Grid justify='left' gutter={0}>
              <Text size='md' style={{
                color: 'black',
                fontWeight: 'normal'
                }}>
                Already have an account ?
              </Text>
            <Grid.Col span={1}>
              <Link to="/Login" style={{
                color: 'blue',
                marginLeft: '5px',
                textDecoration: 'underline',
                display: 'block',
                textAlign: 'left',
                left: -1
              }}>
                Login
              </Link>
            </Grid.Col>
          </Grid>
        </form>
      </Box>
    </MantineProvider>
  );
}

export default SignUp