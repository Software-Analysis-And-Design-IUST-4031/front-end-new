import { useState } from "react"
import { Drawer, ScrollArea, TextInput, Stack, Button, PasswordInput, Box, Grid, MantineProvider, Tabs} from '@mantine/core'
//import { Navigate, useNavigate } from "react-router-dom";
import { EyeCheck, EyeOff, GitFork } from 'tabler-icons-react';

const ProfileEditor = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>('profile-editor');

  const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFirstName(value);
  }

  const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLastName(value);
  }

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNickName(value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
  }

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhoneNumber(value);
  }

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCountry(value);
  }

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCity(value);
  }

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
        <Tabs value={activeTab} onChange={setActiveTab} defaultValue="profile-editor">
          <Tabs.List>
            <Tabs.Tab value="profile-editor">ProfilEditor</Tabs.Tab>
            <Tabs.Tab value="favoites">favoites</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile-editor" pt="ml">
            <Grid>
            <Grid.Col span={6}>
            <label>
              <TextInput
                label='Firstname'
                type='text'
                name="first_name"
                value={firstName}
                onChange={handleFirstnameChange}
                placeholder="enter your new first name"
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
                  placeholder='enter your new last name'
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
                />
              </label>
            </Grid.Col>
            </Grid>
            <Grid>
            <Grid.Col span={6}>
              <label>
              <TextInput 
                  label='Nickname'
                  type='text'
                  name="nick_name"
                  value={nickName}
                  onChange={handleNicknameChange}
                  placeholder='enter your nickname'
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
                />
              </label>
            </Grid.Col>
            <Grid.Col span={6}>
              <label>
                <PasswordInput
                  label="Password"
                  placeholder="enter your new password"
                  defaultValue="secret"
                  value={password}
                  onChange={handlePasswordChange}
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
                      right: -1
                    }
                  }}
                  visibilityToggleButtonProps={({ reveal, size }: {reveal: boolean; size: number}) => reveal ? <EyeOff size={size}/> : <EyeCheck size={size}/>}
                />
              </label>
            </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <label>
                <TextInput
                  label='Email' 
                  type='email'
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder='enter your new email address'
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
                />
              </label>
            </Grid.Col>
            <Grid.Col span={6}>
                <label>
                <TextInput
                  label='PhoneNumber' 
                  type='tel'
                  name="phonenumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder='enter your phone number'
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
                />
              </label>
            </Grid.Col>
            </Grid>
            <Grid>
            <Grid.Col span={6}>
            <label>
              <TextInput
                label='Country'
                type='text'
                name="country"
                value={country}
                onChange={handleCountryChange}
                placeholder="enter your country"
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
              />
              </label>
            </Grid.Col>
            <Grid.Col span={6}>
            <label>
              <TextInput
                label='City'
                type='text'
                name="city"
                value={city}
                onChange={handleCityChange}
                placeholder="enter your city"
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
              />
              </label>
            </Grid.Col>
            </Grid>
          </Tabs.Panel>
          <Tabs.Panel value="favorites" pt="ml">
            First
          </Tabs.Panel>
        </Tabs>
      </Box>
    </MantineProvider>
  );
}

export default ProfileEditor