import { useState, useEffect } from "react"
import { TextInput, Select, Button, PasswordInput, Box, Grid, MantineProvider, Tabs} from '@mantine/core'
import { Navigate, useNavigate, Link } from "react-router-dom";
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
  const [favoritePainting, setFavoritePainting] = useState('');
  const [favoritePaintingstyle, setFavoritePaintingStyle] = useState('');
  const [favoritePaintingTech, setFavoritePaintingTech] = useState('');
  const [favoritePaintingOwn, setFavoritePaintingOwn] = useState('');
  const [biography, setBiography] = useState('');

  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    nickname: "",
    password: "",
    email: "",
    phone_number: "",
    country: "",
    city: "",
    date_of_birth: "",
    is_gallery: "NO",
  });

  const [favoriteData, setFavoritesData] = useState({
    favorite_painter: "",
    favorite_painting: "",
    favorite_painting_style: "",
    favorite_painting_technique: "",
    favorite_painting_to_own: "",
    biography: "",
  });

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleFavoritesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFavoritesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

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

  const handleFavoritePaintingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFavoritePainting(value);
  }

  const handleFavoritePaintingStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFavoritePaintingStyle(value);
  }

  const handleFavoritePaintingTechChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFavoritePaintingTech(value);
  }

  const handleFavoritePaintingOwnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFavoritePaintingOwn(value);
  }

  const handleBiographyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBiography(value);
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
          paddingTop: '0px',
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
                value={profileData.firstname}
                onChange={handleProfileChange}
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
                  value={profileData.lastname}
                  onChange={handleProfileChange}
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
                  value={profileData.nickname}
                  onChange={handleProfileChange}
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
                  value={profileData.password}
                  onChange={handleProfileChange}
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
                  value={profileData.email}
                  onChange={handleProfileChange}
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
                  value={profileData.phone_number}
                  onChange={handleProfileChange}
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
                value={profileData.country}
                onChange={handleProfileChange}
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
                value={profileData.city}
                onChange={handleProfileChange}
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
                  value={profileData.date_of_birth}
                  onChange={handleProfileChange}
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
                  value={profileData.is_gallery}
                  onChange={(value) => setProfileData({...profileData, is_gallery: value || "NO"})}
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
                  marginTop: '10px',
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
          <Grid justify='left' gutter={6}>
            <Grid.Col span={6}>
              <Link to="/Login" style={{
                color: 'blue',
                marginLeft: '5px',
                marginTop: '7px',
                textDecoration: 'underline',
                display: 'block',
                textAlign: 'left',
                left: -1
              }}>
                get back to user panel
              </Link>
            </Grid.Col>
          </Grid>
          </Tabs.Panel>
          <Tabs.Panel value="favorites" pt="lg">
          <Grid>
              <Grid.Col span={6}>
                <label>
                  <TextInput
                    label="favorite painter?"
                    type='text'
                    name="favorite_painter"
                    value={favoriteData.favorite_painter}
                    onChange={handleFavoritesChange}
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
                  label="favorite painting?"
                  type='text'
                  name="favorite painting"
                  value={favoriteData.favorite_painting}
                  onChange={handleFavoritesChange}
                  placeholder='favorite painting'
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
                  label="favorite painting style?"
                  type='text'
                  name="favorite painting style"
                  value={favoriteData.favorite_painting_style}
                  onChange={handleFavoritesChange}
                  placeholder='favorite painting style'
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
              <Grid.Col span={6}>
                <label>
                <TextInput 
                  label="favorite painting technique?"
                  type='text'
                  name="favorite painting technique"
                  value={favoriteData.favorite_painting_technique}
                  onChange={handleFavoritesChange}
                  placeholder='favorite painting technique'
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
                  label="favorite painting to own?"
                  type='text'
                  name="favorite painting to own"
                  value={favoriteData.favorite_painting_to_own}
                  onChange={handleFavoritesChange}
                  placeholder='The painting you like to own'
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
              <Grid.Col span={6}>
              <label>
                <TextInput 
                  label="Biography"
                  type='text'
                  name="biography"
                  value={favoriteData.biography}
                  onChange={handleFavoritesChange}
                  placeholder='biography'
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
                  marginTop: '10px',
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
          <Grid justify='left' gutter={6}>
            <Grid.Col span={6}>
              <Link to="/Login" style={{
                color: 'blue',
                marginLeft: '5px',
                marginTop: '7px',
                textDecoration: 'underline',
                display: 'block',
                textAlign: 'left',
                left: -1
              }}>
                get back to user panel
              </Link>
            </Grid.Col>
          </Grid>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </MantineProvider>
  );
}

export default ProfileEditor