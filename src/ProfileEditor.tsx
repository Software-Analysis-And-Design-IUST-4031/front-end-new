import { useState } from "react"
import { Drawer, ScrollArea, TextInput, Select, Popover, List, ListItem, Button, Radio, PasswordInput, Box, Grid, MantineProvider, Tabs} from '@mantine/core'
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
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isGallery, setIsGallery] = useState<string>('NO');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('profile-editor');

  const [favoritePainter, setFavoritePainter] = useState('');

  const handeOptionsSelect = (value: string | null) => {
    setSelectedValue(value);
    setOpened(false);
  }
 
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

  const handleDateOfBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDateOfBirth(value);
  }

  const handleFavoritePainterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFavoritePainter(value);
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
          marginBottom: '170px',
          padding: '20px 20px 20px 20px',
          paddingTop: '3px',
          paddingLeft: '15px',
          paddingRight: '15px',
          border: '2px solid rgba(0, 0, 0, 0.158)',
          borderRadius: '12px',
          backdropFilter: 'blur(5px) brightness(1)',
          WebkitBackdropFilter: 'blur(7px) brightness(1)',
          boxShadow: '10 4px 8px rbga(0, 0, 0, 10)'
        }}
      >
        <Tabs value={activeTab} onChange={setActiveTab} defaultValue="profile-editor" 
          styles={{
            list: {
              display: 'flex'
            },
            tab: {
              flex: 1,
              borderRadius: '0px',
              textAlign: 'center',
              color: 'white',
              backgroundColor: 'black',
              fontSize: '18px', 
              '&[data-active]': {
                backgroundColor: 'red',
                color: 'white'
              },
              '&:hover': {
                backgroundColor: 'red',
              }
            }
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="profile-editor">ProfileEditor</Tabs.Tab>
            <Tabs.Tab value="favorites">favorites</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile-editor" pt="lg">
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
                label='Country/Nationality'
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
            <Grid>
              <Grid.Col span={6}>
              <label>
                <TextInput
                  label='Date of Birth'
                  type='date'
                  name="dateofbirth"
                  value={dateOfBirth}
                  onChange={handleDateOfBirthChange}
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
              <Grid.Col span={6}>
              <label>
                <Select
                  label="Are you a gallery?"
                  placeholder="select YES or NO"
                  data={["YES", "NO"]}
                  value={selectedValue}
                  onChange={handeOptionsSelect}
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
            <Grid>
            <Grid.Col>
            <Button
                type='submit'
                variant='contained'
                fullWidth
                style={{
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
          </Tabs.Panel>
          <Tabs.Panel value="favorites" pt="lg">
          <Grid>
              <Grid.Col span={6}>
                <label>
                  <TextInput
                    label='Who is your favorite painter?'
                    type='text'
                    name="favorite_painter"
                    value={favoritePainter}
                    onChange={handleFavoritePainterChange}
                    placeholder="favorite painter"
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
            <Grid justify='center'>
            <Grid.Col>
            <Button
                type='submit'
                variant='contained'
                fullWidth
                style={{
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
          </Tabs.Panel>
        </Tabs>
      </Box>
    </MantineProvider>
  );
}

export default ProfileEditor