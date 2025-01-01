import React, { useState, forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import axiosInstance from "../../api/axiosConfig";
import { UserProfile } from "../../types";
import { styled } from "@mui/material/styles";
import { Autocomplete } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { userService } from "../../services/userService";

interface EditProfileButtonProps {
  userData: UserProfile;
  onProfileUpdate: (data: UserProfile) => void;
  customTheme?: {
    bg: string;
    text: string;
  };
  id?: string;
}

const EditButton = styled(IconButton)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,64,129,0.1)"
      : "rgba(255,64,129,0.05)",
  color: theme.palette.mode === "dark" ? "#FF4081" : "#D81B60",
  borderRadius: 12,
  padding: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,64,129,0.2)"
      : "rgba(255,64,129,0.1)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,64,129,0.2)"
        : "rgba(255,64,129,0.1)",
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(30,30,30,0.95)"
        : "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 32px rgba(0,0,0,0.3)"
        : "0 8px 32px rgba(0,0,0,0.1)",
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.02)"
    }`,
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, rgba(40,40,40,0.9) 0%, rgba(50,50,50,0.9) 100%)"
      : "linear-gradient(145deg, rgba(245,245,245,0.9) 0%, rgba(250,250,250,0.9) 100%)",
  padding: theme.spacing(3),
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  fontWeight: 600,
}));

const FormContainer = styled("form")(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.02)",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.2)",
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FF4081",
        borderWidth: 2,
      },
    },
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,64,129,0.1)"
      : "rgba(255,64,129,0.05)",
  color: theme.palette.mode === "dark" ? "#FF4081" : "#D81B60",
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,64,129,0.2)"
      : "rgba(255,64,129,0.1)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,64,129,0.2)"
        : "rgba(255,64,129,0.1)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
}));

// Add type for form fields
type FormField = keyof Pick<
  UserProfile,
  | "firstname"
  | "lastname"
  | "nickname"
  | "email"
  | "phone_number"
  | "date_of_birth"
  | "country"
  | "city"
  | "is_gallery"
  | "profile_picture"
  | "Theme"
  | "Dark_light_theme"
  | "gallery_name"
  | "description"
  | "biography"
  | "favorite_painter"
  | "favorite_painting"
  | "favorite_painting_style"
  | "favorite_painting_technique"
  | "favorite_painting_to_own"
>;

const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  userData,
  onProfileUpdate,
  customTheme,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    firstname: userData.firstname || "",
    lastname: userData.lastname || "",
    nickname: userData.nickname || "",
    phone_number: userData.phone_number || "",
    date_of_birth: userData.date_of_birth || "",
    country: userData.country || "",
    city: userData.city || "",
    biography: userData.biography || "",
  });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const [paintingStyles] = useState([
    "Abstract",
    "Realism",
    "Impressionism",
    "Expressionism",
    "Surrealism",
    "Pop Art",
    "Minimalism",
    "Contemporary",
    "Modern",
    "Traditional",
    "Baroque",
    "Renaissance",
    "Cubism",
    "Art Nouveau",
    "Art Deco",
    "Gothic",
    "Romanticism",
    "Neoclassicism",
    "Post-Impressionism",
    "Pointillism",
    "Fauvism",
    "Abstract Expressionism",
    "Color Field",
    "Op Art",
    "Kinetic Art",
    "Installation Art",
    "Performance Art",
    "Digital Art",
    "Street Art",
    "Folk Art",
  ]);

  const [paintingTechniques] = useState([
    "Oil Painting",
    "Acrylic",
    "Watercolor",
    "Digital Art",
    "Mixed Media",
    "Pencil Drawing",
    "Charcoal",
    "Pastel",
    "Ink",
    "Sculpture",
    "Tempera",
    "Fresco",
    "Gouache",
    "Encaustic",
    "Spray Paint",
    "Linocut",
    "Woodcut",
    "Etching",
    "Lithography",
    "Screen Printing",
    "Collage",
    "Mosaic",
    "Glass Art",
    "Ceramic",
    "Metal Work",
    "Photography",
    "3D Printing",
    "Textile Art",
    "Paper Art",
    "Installation",
  ]);

  const [famousPainters] = useState([
    "Leonardo da Vinci",
    "Vincent van Gogh",
    "Pablo Picasso",
    "Claude Monet",
    "Rembrandt",
    "Michelangelo",
    "Salvador Dalí",
    "Gustav Klimt",
    "Frida Kahlo",
    "Andy Warhol",
    "Georgia O'Keeffe",
    "Johannes Vermeer",
    "Paul Cézanne",
    "Wassily Kandinsky",
    "Henri Matisse",
    "Jackson Pollock",
    "Edvard Munch",
    "René Magritte",
    "Diego Rivera",
    "Gustav Courbet",
  ]);

  const [famousPaintings] = useState([
    "Mona Lisa - Leonardo da Vinci",
    "The Starry Night - Vincent van Gogh",
    "The Persistence of Memory - Salvador Dalí",
    "The Scream - Edvard Munch",
    "Girl with a Pearl Earring - Johannes Vermeer",
    "The Birth of Venus - Sandro Botticelli",
    "The Night Watch - Rembrandt",
    "Water Lilies - Claude Monet",
    "The Kiss - Gustav Klimt",
    "Guernica - Pablo Picasso",
    "The Last Supper - Leonardo da Vinci",
    "The Creation of Adam - Michelangelo",
    "The Garden of Earthly Delights - Hieronymus Bosch",
    "Las Meninas - Diego Velázquez",
    "The Son of Man - René Magritte",
    "Campbell's Soup Cans - Andy Warhol",
    "The Great Wave off Kanagawa - Hokusai",
    "American Gothic - Grant Wood",
    "The Card Players - Paul Cézanne",
    "The Hay Wain - John Constable",
  ]);

  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({
    firstname: userData.firstname || "",
    lastname: userData.lastname || "",
    nickname: userData.nickname || "",
    phone_number: userData.phone_number || "",
    date_of_birth: userData.date_of_birth || "",
    country: userData.country || "",
    city: userData.city || "",
    biography: userData.biography || "",
    favorite_painter: userData.favorite_painter || "",
    favorite_painting: userData.favorite_painting || "",
    favorite_painting_style: userData.favorite_painting_style || "",
    favorite_painting_technique: userData.favorite_painting_technique || "",
    favorite_painting_to_own: userData.favorite_painting_to_own || "",
  });

  const [countries, setCountries] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Fetch countries when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesList = await userService.getCountries();
        setCountries(countriesList);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback to empty array instead of throwing error
        setCountries([]);
        enqueueSnackbar('Failed to load countries. Please try again later.', { 
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    };

    fetchCountries();
  }, [enqueueSnackbar]);

  // Fetch cities when country changes
  useEffect(() => {
    const fetchCities = async () => {
      if (editedProfile.country) {
        try {
          const citiesList = await userService.getCitiesForCountry(editedProfile.country);
          setAvailableCities(citiesList);
        } catch (error) {
          console.error('Error fetching cities:', error);
          // Fallback to empty array instead of throwing error
          setAvailableCities([]);
          enqueueSnackbar('Failed to load cities. Please try again later.', { 
            variant: 'error',
            autoHideDuration: 3000
          });
        }
      } else {
        setAvailableCities([]);
      }
    };

    fetchCities();
  }, [editedProfile.country, enqueueSnackbar]);

  // Add console log for render
  console.log("Current countries in state:", countries);
  console.log("Current cities in state:", availableCities);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof UserProfile) => (value: any) => {
    if (field === "is_gallery") {
      // Ensure boolean type for is_gallery
      setEditedProfile((prev) => ({
        ...prev,
        [field]: Boolean(value)
      }));
    } else {
      setEditedProfile((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTextFieldChange =
    (field: keyof UserProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedProfile((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Handle basic info update
      if (activeTab === 0) {
        const formData = new FormData();

        const basicInfoFields: FormField[] = [
          "firstname",
          "lastname",
          "nickname",
          "email",
          "phone_number",
          "date_of_birth",
          "country",
          "city",
          "is_gallery",
          "profile_picture",
          "Theme",
          "Dark_light_theme",
          "gallery_name",
          "description",
          "biography",
        ];

        basicInfoFields.forEach((field) => {
          const value = editedProfile[field];
          if (value !== undefined && value !== null) {
            if (field === "profile_picture" && value instanceof File) {
              formData.append(field, value);
            } else if (field === "is_gallery") {
              formData.append(field, String(value));
            } else {
              formData.append(field, String(value));
            }
          }
        });

        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        await userService.updateUserProfile(parseInt(userId), formData);
      } 
      // Handle preferences update
      else if (activeTab === 1) {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID not found");

        const preferencesData = {
          favorite_painter: editedProfile.favorite_painter || "",
          favorite_painting: editedProfile.favorite_painting || "",
          favorite_painting_style: editedProfile.favorite_painting_style || "",
          favorite_painting_technique: editedProfile.favorite_painting_technique || "",
          favorite_painting_to_own: editedProfile.favorite_painting_to_own || "",
        };

        await userService.updateUserPreferences(
          parseInt(userId),
          preferencesData
        );
      }

      onProfileUpdate({
        ...userData,
        ...editedProfile,
      });

      enqueueSnackbar(
        `${activeTab === 0 ? "Basic info" : "Preferences"} updated successfully`, 
        { variant: "success" }
      );
      handleClose();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      enqueueSnackbar(
        error.message || `Failed to update ${activeTab === 0 ? "basic info" : "preferences"}`, 
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditedProfile(
        (prev) =>
          ({
            ...prev,
            profile_picture: file,
          } as UserProfile)
      ); // Type assertion to handle File type
    }
  };

  return (
    <>
      <EditButton onClick={handleOpen} id={id}>
        <EditIcon sx={{ fontSize: "1.25rem" }} />
      </EditButton>

      <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
            >
              <Tab label="Basic Info" />
              <Tab label="Preferences" />
            </Tabs>
          </Box>

          {activeTab === 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="First Name"
                  value={editedProfile.firstname}
                  onChange={handleTextFieldChange("firstname")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Last Name"
                  value={editedProfile.lastname}
                  onChange={handleTextFieldChange("lastname")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Nickname"
                  value={editedProfile.nickname}
                  onChange={handleTextFieldChange("nickname")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  value={editedProfile.phone_number}
                  onChange={handleTextFieldChange("phone_number")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  value={editedProfile.date_of_birth || ""}
                  onChange={handleTextFieldChange("date_of_birth")}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={editedProfile.country || null}
                  onChange={(_, newValue) => {
                    handleChange("country")(newValue || "");
                    handleChange("city")("");
                  }}
                  options={countries}
                  getOptionLabel={(option) => option || ""}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="outlined"
                      fullWidth
                      error={countries.length === 0}
                      helperText={countries.length === 0 ? "Failed to load countries" : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={editedProfile.city || null}
                  onChange={(_, newValue) => {
                    handleChange("city")(newValue || "");
                  }}
                  options={availableCities}
                  getOptionLabel={(option) => option || ""}
                  isOptionEqualToValue={(option, value) => option === value}
                  disabled={!editedProfile.country || countries.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      variant="outlined"
                      fullWidth
                      error={Boolean(editedProfile.country && availableCities.length === 0)}
                      helperText={
                        !editedProfile.country 
                          ? "Please select a country first"
                          : availableCities.length === 0 
                          ? "Failed to load cities" 
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={editedProfile.is_gallery ? "YES" : "NO"}
                  onChange={(_, newValue) => {
                    handleChange("is_gallery" as keyof UserProfile)(
                      newValue === "YES"
                    );
                  }}
                  options={["YES", "NO"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Is Gallery"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Biography"
                  value={editedProfile.biography}
                  onChange={handleTextFieldChange("biography")}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={editedProfile.favorite_painter || null}
                  onChange={(_, newValue) =>
                    handleChange("favorite_painter")(newValue)
                  }
                  options={famousPainters}
                  renderInput={(params) => (
                    <TextField {...params} label="Favorite Painter" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={editedProfile.favorite_painting || null}
                  onChange={(_, newValue) =>
                    handleChange("favorite_painting")(newValue)
                  }
                  options={famousPaintings}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Favorite Painting"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={editedProfile.favorite_painting_style || null}
                  onChange={(_, newValue) =>
                    handleChange("favorite_painting_style")(newValue)
                  }
                  options={paintingStyles}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Favorite Painting Style"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={editedProfile.favorite_painting_technique || null}
                  onChange={(_, newValue) =>
                    handleChange("favorite_painting_technique")(newValue)
                  }
                  options={paintingTechniques}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Favorite Painting Technique"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={editedProfile.favorite_painting_to_own || null}
                  onChange={(_, newValue) =>
                    handleChange("favorite_painting_to_own")(newValue)
                  }
                  options={famousPaintings}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Your Dream Painting to Own"
                      fullWidth
                    />
                  )}
                  freeSolo
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default EditProfileButton;
