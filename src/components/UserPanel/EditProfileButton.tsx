import React, { useState, forwardRef, useEffect, useRef } from "react";
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
import {
  Edit as EditIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosConfig";
import { UserProfile } from "../../types";
import { styled } from "@mui/material/styles";
import { Autocomplete } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { userService } from "../../services/userService";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { MEDIA_URL } from "../../services/api";

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
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  borderRadius: 12,
  padding: theme.spacing(1.2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.1)",
    transform: "translateY(-2px) scale(1.05)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255,255,255,0.1)"
        : "0 4px 12px rgba(0,0,0,0.1)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
    backdropFilter: "blur(20px)",
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#2F2F2F" : "#E0E0E0"
    }`,
    boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
    maxWidth: 800,
    margin: theme.spacing(2),
    "& .MuiDialogTitle-root": {
      background: theme.palette.mode === "dark" ? "#2C2C2C" : "#333333",
      padding: theme.spacing(2),
      "& .MuiTypography-root": {
        color: "#FFFFFF",
      },
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    },
    "& .MuiTabs-root": {
      minHeight: 48,
      "& .MuiTab-root": {
        color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
        opacity: 0.7,
        "&.Mui-selected": {
          color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
          opacity: 1,
        },
      },
      "& .MuiTabs-indicator": {
        backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
      },
    },
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(8px)",
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.mode === "dark" ? "#2C2C2C" : "#FFFFFF",
  padding: theme.spacing(3),
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  fontWeight: 600,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: theme.spacing(3),
    width: 40,
    height: 2,
    background: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    borderRadius: 2,
  },
}));

const FormContainer = styled("form")(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.02)",
    borderRadius: 12,
    "& fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)",
    },
    "&:hover fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.2)"
          : "rgba(0,0,0,0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    },
    "& input": {
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    },
  },
  "& .MuiInputLabel-root": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.7)"
        : "rgba(0,0,0,0.7)",
    "&.Mui-focused": {
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    },
  },
  "& .MuiFormHelperText-root": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.5)"
        : "rgba(0,0,0,0.5)",
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
  padding: theme.spacing(1.2, 3),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(255,255,255,0.2)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&.MuiButton-contained": {
    backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
    color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#E0E0E0" : "#000000",
    },
  },
  "&.MuiButton-outlined": {
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.3)"
        : "rgba(0,0,0,0.2)",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.05)",
    },
  },
}));

const AvatarUpload = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 160,
  height: 160,
  margin: "0 auto",
  marginBottom: theme.spacing(3),
  cursor: "pointer",
  "&:hover .upload-overlay": {
    opacity: 1,
  },
  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "scale(1.02)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "calc(100% + 20px)",
    height: "calc(100% + 20px)",
    transform: "translate(-50%, -50%)",
    border: `2px dashed ${
      theme.palette.mode === "dark" ? "#FFFFFF" : "#333333"
    }`,
    borderRadius: "50%",
    animation: "rotate 20s linear infinite",
    opacity: 0.2,
  },
  "@keyframes rotate": {
    "0%": {
      transform: "translate(-50%, -50%) rotate(0deg)",
    },
    "100%": {
      transform: "translate(-50%, -50%) rotate(360deg)",
    },
  },
}));

const UploadOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  backdropFilter: "blur(4px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "& .MuiSvgIcon-root": {
    fontSize: 40,
    color: "#FFFFFF",
    marginBottom: theme.spacing(1),
    animation: "bounce 1.5s infinite",
  },
  "@keyframes bounce": {
    "0%, 100%": {
      transform: "translateY(0)",
    },
    "50%": {
      transform: "translateY(-8px)",
    },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  fontSize: "3.5rem",
  backgroundColor: theme.palette.mode === "dark" ? "#2C2C2C" : "#333333",
  border: `4px solid ${theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF"}`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05) rotate(2deg)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: "#FFFFFF",
  "& .MuiTypography-root": {
    color: "#FFFFFF",
  },
  "& .MuiGrid-container": {
    marginTop: theme.spacing(2),
  },
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

const getInitials = (firstname: string = "", lastname: string = "") => {
  return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
};

const CropDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
    backdropFilter: "blur(20px)",
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#2F2F2F" : "#E0E0E0"
    }`,
    boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
    overflow: "hidden",
    maxWidth: 800,
    margin: theme.spacing(2),
    "& .MuiDialogTitle-root": {
      background: theme.palette.mode === "dark" ? "#2C2C2C" : "#333333",
      padding: theme.spacing(2),
      "& .MuiTypography-root": {
        color: "#FFFFFF",
      },
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(2),
      borderTop: `1px solid ${
        theme.palette.mode === "dark" ? "#2F2F2F" : "#E0E0E0"
      }`,
      backgroundColor: theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
    },
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(8px)",
  },
}));

const CropContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  "& .ReactCrop": {
    maxWidth: "100%",
    maxHeight: "70vh",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.02)",
    borderRadius: 16,
    border: `1px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)"
    }`,
    "& img": {
      maxHeight: "70vh",
      borderRadius: 16,
    },
  },
  "& .ReactCrop__crop-selection": {
    borderRadius: "50%",
    border: `2px solid ${
      theme.palette.mode === "dark" ? "#FFFFFF" : "#333333"
    }`,
    boxShadow: `0 0 0 9999px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.7)"
    }`,
  },
  "& .ReactCrop__drag-handle": {
    backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
    border: `2px solid ${
      theme.palette.mode === "dark" ? "#FFFFFF" : "#333333"
    }`,
    width: 12,
    height: 12,
  },
}));

const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  userData,
  onProfileUpdate,
  customTheme,
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    x: 5,
    y: 5,
    height: 90,
  });
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Single source of truth for form state
  const [formValues, setFormValues] = useState<UserProfile>({
    ...userData,
    profile_picture: userData.profile_picture || undefined,
  });

  // Remove duplicate states
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    userData.profile_picture ? String(userData.profile_picture) : null
  );

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

  const [fieldErrors, setFieldErrors] = useState<Record<FormField, string>>({});

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesList = await userService.getCountries();
        setCountries(countriesList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (formValues.country) {
        try {
          const citiesList = await userService.getCitiesForCountry(
            formValues.country
          );
          setAvailableCities(citiesList);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setAvailableCities([]);
      }
    };
    fetchCities();
  }, [formValues.country]);

  useEffect(() => {
    const handleProfilePictureUpdate = () => {
      const cachedUrl = localStorage.getItem("lastProfilePicture");
      if (cachedUrl) {
        setPreviewUrl(cachedUrl);
      }
    };

    window.addEventListener("profilePictureUpdate", handleProfilePictureUpdate);
    return () => {
      window.removeEventListener(
        "profilePictureUpdate",
        handleProfilePictureUpdate
      );
    };
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof UserProfile) => (value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTextFieldChange =
    (field: keyof UserProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(field)(event.target.value);
    };

  const handleProfilePictureSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Log form values before processing
      console.log("Form values before processing:", formValues);

      // Handle each field
      Object.entries(formValues).forEach(([key, value]) => {
        // Skip undefined/null values
        if (value === undefined || value === null) return;

        // Handle different field types
        if (key === "date_of_birth" && value) {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            formData.append(key, date.toISOString().split("T")[0]);
          }
        } else if (key === "profile_picture") {
          if (value instanceof File) {
            formData.append(key, value);
          }
          // Don't append if it's a string URL - the backend already has it
        } else if (key === "is_gallery") {
          // Ensure boolean is sent as string "true" or "false"
          formData.append(key, String(Boolean(value)));
        } else if (value !== "") {
          // Convert all other values to string
          formData.append(key, String(value));
        }
      });

      // Explicitly append required fields
      const requiredFields = [
        "firstname",
        "lastname",
        "nickname",
        "email",
        "phone_number",
        "country",
        "city",
        "biography",
        "description",
      ];

      requiredFields.forEach((field) => {
        if (formValues[field] && !formData.has(field)) {
          formData.append(field, String(formValues[field]));
        }
      });

      // Log FormData entries before sending
      console.log("FormData entries being sent:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await onProfileUpdate(formData);
      handleClose();

      // Show success message
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (error: any) {
      console.error("Error updating profile:", {
        error,
        formValues,
        response: error.response?.data,
      });

      // Show error message with details if available
      const errorMessage =
        error.response?.data?.details?.date_of_birth?.[0] ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update profile";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarSrc = () => {
    if (previewUrl) {
      return previewUrl;
    }
    if (
      userData?.profile_picture &&
      typeof userData.profile_picture === "string" &&
      userData.profile_picture.trim() !== ""
    ) {
      const profilePicUrl = userData.profile_picture.startsWith("http")
        ? userData.profile_picture
        : `${MEDIA_URL}/${userData.profile_picture.replace(/^\//, "")}`;
      localStorage.setItem("lastProfilePicture", profilePicUrl);
      return profilePicUrl;
    }
    const cachedUrl = localStorage.getItem("lastProfilePicture");
    if (cachedUrl) {
      return cachedUrl;
    }
    return "";
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !crop.width || !crop.height) return;

    try {
      const croppedBlob = await getCroppedImg(imageRef.current, crop);
      const file = new File([croppedBlob], "profile_picture.jpg", {
        type: "image/jpeg",
      });

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      setFormValues((prev) => ({
        ...prev,
        profile_picture: file,
      }));

      setCropDialogOpen(false);
      setTempImageUrl(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const validateDateOfBirth = (date: string): boolean => {
    if (!date) return true; // Optional field
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;

    // Check if date is not in the future
    if (d > new Date()) return false;

    // Check if date is not too far in the past (e.g., 120 years ago)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    if (d < minDate) return false;

    return true;
  };

  const handleDateChange =
    (field: keyof UserProfile) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (!value || validateDateOfBirth(value)) {
        handleChange(field)(value);
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: "Please enter a valid date",
        }));
      }
    };

  return (
    <>
      <EditButton onClick={handleOpen} id={id}>
        <EditIcon sx={{ fontSize: "1.25rem" }} />
      </EditButton>

      <StyledDialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        keepMounted
        disablePortal={false}
        aria-labelledby="edit-profile-dialog-title"
      >
        <DialogTitle id="edit-profile-dialog-title">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
              Edit Profile
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, mt: 1 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  minHeight: 48,
                },
              }}
            >
              <Tab label="Basic Info" />
              <Tab label="Preferences" />
            </Tabs>
          </Box>

          <TabPanel hidden={activeTab !== 0}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={600}
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
                      mb: 1,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    Profile Picture
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(0,0,0,0.7)",
                      maxWidth: 300,
                      mx: "auto",
                    }}
                  >
                    Click to upload a new profile picture
                  </Typography>
                  <AvatarUpload onClick={handleAvatarClick}>
                    <StyledAvatar
                      src={getAvatarSrc()}
                      alt={userData.firstname}
                      sx={{
                        width: 160,
                        height: 160,
                        fontSize: "3.5rem",
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2C2C2C" : "#333333",
                        border: `4px solid ${
                          theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF"
                        }`,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        transition:
                          "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        "&:hover": {
                          transform: "scale(1.05) rotate(2deg)",
                          boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                        },
                      }}
                    >
                      {!getAvatarSrc() &&
                        getInitials(
                          userData.firstname || "",
                          userData.lastname || ""
                        )}
                    </StyledAvatar>
                    <UploadOverlay className="upload-overlay">
                      <CloudUploadIcon />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#FFFFFF",
                          textAlign: "center",
                          px: 1,
                          fontWeight: 600,
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        Change Photo
                      </Typography>
                    </UploadOverlay>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/jpeg,image/png"
                      onChange={handleProfilePictureSelect}
                    />
                  </AvatarUpload>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="First Name"
                  value={formValues.firstname}
                  onChange={handleTextFieldChange("firstname")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Last Name"
                  value={formValues.lastname}
                  onChange={handleTextFieldChange("lastname")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Nickname"
                  value={formValues.nickname}
                  onChange={handleTextFieldChange("nickname")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  value={formValues.phone_number}
                  onChange={handleTextFieldChange("phone_number")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  value={formValues.date_of_birth || ""}
                  onChange={handleDateChange("date_of_birth")}
                  error={!!fieldErrors.date_of_birth}
                  helperText={fieldErrors.date_of_birth}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: new Date().toISOString().split("T")[0], // Today
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formValues.country || null}
                  onChange={(_, newValue) => {
                    handleChange("country")(newValue || "");
                    // Reset city when country changes
                    handleChange("city")("");
                  }}
                  options={countries || []}
                  getOptionLabel={(option) => option || ""}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formValues.city || null}
                  onChange={(_, newValue) => {
                    handleChange("city")(newValue || "");
                  }}
                  options={availableCities || []}
                  getOptionLabel={(option) => option || ""}
                  isOptionEqualToValue={(option, value) => option === value}
                  disabled={!formValues.country}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      variant="outlined"
                      fullWidth
                      helperText={
                        !formValues.country
                          ? "Please select a country first"
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formValues.is_gallery ? "YES" : "NO"}
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
                  value={formValues.biography}
                  onChange={handleTextFieldChange("biography")}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel hidden={activeTab !== 1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={formValues.favorite_painter || null}
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
                  value={formValues.favorite_painting || null}
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
                  value={formValues.favorite_painting_style || null}
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
                  value={formValues.favorite_painting_technique || null}
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
                  value={formValues.favorite_painting_to_own || null}
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
          </TabPanel>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              "&:hover": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              px: 3,
              backgroundColor:
                theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
              color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#E0E0E0" : "#000000",
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </StyledDialog>

      <CropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        maxWidth="md"
        fullWidth
        keepMounted
        disablePortal={false}
        aria-labelledby="crop-dialog-title"
      >
        <DialogTitle id="crop-dialog-title">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#FFFFFF",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Crop Profile Picture
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  mt: 0.5,
                }}
              >
                Drag to adjust the circular crop area
              </Typography>
            </Box>
            <IconButton
              onClick={() => setCropDialogOpen(false)}
              sx={{
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <CropContainer>
            {tempImageUrl && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                circularCrop
                aspect={1}
              >
                <img
                  ref={imageRef}
                  src={tempImageUrl}
                  alt="Crop preview"
                  style={{ maxWidth: "100%" }}
                />
              </ReactCrop>
            )}
          </CropContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button
            onClick={() => setCropDialogOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
              borderColor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              "&:hover": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCropComplete}
            sx={{
              borderRadius: 2,
              px: 3,
              backgroundColor:
                theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
              color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#E0E0E0" : "#000000",
              },
            }}
          >
            Apply Crop
          </Button>
        </DialogActions>
      </CropDialog>
    </>
  );
};

export default EditProfileButton;
