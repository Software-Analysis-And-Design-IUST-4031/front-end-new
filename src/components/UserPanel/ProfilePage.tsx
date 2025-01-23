import React, { useEffect, useState, useCallback } from "react";
import { useParams , useNavigate} from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { BackendPainting, Painting, UserProfile } from "../../types";
import { MEDIA_URL } from "../../services/api";
import api from "../../services/api";
import { PiChatsLight } from "react-icons/pi";
import {
  Container,
  Box,
  Typography,
  Grid,
  styled,
  Button,
  IconButton,
  alpha,
  CircularProgress,
  Avatar,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../Navbar";
import PaintingGrid from "./PaintingGrid";
import ThemeCustomizer from "./ThemeCustomizer";
import UploadPaintingDialog from "./UploadPaintingDialog";
import SideBar from "./SideBar";
import EditProfileButton from "./EditProfileButton";

const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0A0A0A" : "#FAFAFA",
  minHeight: "100vh",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at 50% 0%, rgba(255,64,129,0.03) 0%, rgba(0,0,0,0) 50%)"
      : "radial-gradient(circle at 50% 0%, rgba(255,64,129,0.02) 0%, rgba(0,0,0,0) 50%)",
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginTop: 64,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100vw",
    height: "100%",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(to bottom, rgba(255,64,129,0.03) 0%, rgba(0,0,0,0) 200px)"
        : "linear-gradient(to bottom, rgba(255,64,129,0.02) 0%, rgba(0,0,0,0) 200px)",
    pointerEvents: "none",
  },
}));

const ProfileCard = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(30,30,30,0.9) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.9) 100%)",
  borderRadius: 32,
  padding: theme.spacing(5),
  marginBottom: theme.spacing(4),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.06)",
  backdropFilter: "blur(20px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)"
  }`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,64,129,0.03), transparent)",
    transform: "translateX(-100%)",
    animation: "shimmer 5s infinite",
  },
  "@keyframes shimmer": {
    "100%": {
      transform: "translateX(100%)",
    },
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#2A2A2A" : "#F5F5F5",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  fontSize: "2.5rem",
  fontWeight: 700,
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#F5F5F5",
  borderRadius: 16,
  padding: 12,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#2A2A2A" : "#EBEBEB",
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  "&:active": {
    transform: "translateY(0) scale(0.95)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: "12px 28px",
  textTransform: "none",
  fontWeight: 600,
  backgroundColor: theme.palette.mode === "dark" ? "#2A2A2A" : "#F5F5F5",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#3A3A3A" : "#EBEBEB",
  },
  "&.outlined": {
    borderColor: theme.palette.mode === "dark" ? "#3A3A3A" : "#E0E0E0",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.05)",
    },
  },
}));
const TabButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderRadius: "4px 4px 0 0",
  padding: theme.spacing(2, 4),
  '&[data-active="true"]': {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    borderBottom: `2px solid ${
      theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"
    }`,
  },
}));

const NameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  fontWeight: "bold",
  letterSpacing: "-0.5px",
  fontSize: "2rem",
  marginBottom: theme.spacing(1),
}));

const UsernameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  letterSpacing: "0.2px",
  fontSize: "1rem",
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(6),
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  borderRadius: 16,
}));

const StatsItem = styled(Box)(({ theme }) => ({
  textAlign: "center",
  "& .MuiTypography-h5": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
  },
  "& .MuiTypography-body2": {
    color: theme.palette.text.secondary,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontSize: "0.75rem",
  },
}));

const BioTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  borderRadius: 12,
}));

const LocationBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(0,0,0,0.02)",
  padding: theme.spacing(1, 2),
  borderRadius: 12,
  width: "fit-content",
}));

const UploadButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#2A2A2A" : "#FFFFFF",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  position: "relative",
  overflow: "hidden",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#3A3A3A" : "#F5F5F5",
  },
}));

interface AuthorDetails {
  user_id?: number;
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  profile_picture?: string;
  biography?: string;
}

interface PaintingWithAuthor extends BackendPainting {
  author?: AuthorDetails;
  artist_details?: AuthorDetails;
}

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { userProfile, userId, isLoading, updateProfile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [savedPaintings, setSavedPaintings] = useState<Painting[]>([]);
  const [isLoadingPaintings, setIsLoadingPaintings] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId2} = useParams();
  const [userProfile2 , setUserProfile2] = useState<any>() ;
  const [userId3 , setUserId3] = useState<number>(0);
  const navigate = useNavigate();



    useEffect(() => {  
    // console.log("userid " + userId);
    // console.log("profile " + userProfile);
    // console.log("userId2 " + userId2);
    // console.log("userprofile2 " + userProfile2);
    const fetchUserProfile = async () => {  
      if (userId2) {  
        try {  
          setUserId3(parseInt(userId2));
          const profile : any = await userService.getUserProfile(parseInt(userId2)); // Get profile for the userId  
          setUserProfile2(profile); // Update the profile state  
        } catch (error) {  
          console.error('Error fetching user profile:', error);  
        }   
      }   
      else 
      {
        let user__id = localStorage.getItem("userId");
        if (user__id)
        {
          try {  
            setUserId3(parseInt(user__id));
            const profile : any = await userService.getUserProfile(parseInt(user__id)); // Get profile for the userId  
            setUserProfile2(profile); // Update the profile state  
          } catch (error) {  
            console.error('Error fetching user profile:', error);  
          }  
        }

        // if (userProfile && userId)
        // {
        //   setUserId3(userId);
        //   setUserProfile2(userProfile);
        // }

      }
    };  
    
    fetchUserProfile();  
    console.log("userid " + userId);
    console.log("profile " + userProfile);
    console.log("userId2 " + userId2);
    console.log("userprofile2 " + userProfile2);

  }, [userId2]); // Add userId2 as a dependenc
  const userIdFromStorage = localStorage.getItem("userId");
  const handleSidebarToggle = useCallback(() => {
    console.log("Toggling sidebar. Current state:", sidebarOpen);
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log("Sidebar state changed:", sidebarOpen);
  }, [sidebarOpen]);

  const transformPaintings = async (
    backendPaintings: BackendPainting[]
  ): Promise<Painting[]> => {
    if (!Array.isArray(backendPaintings)) {
      console.error("Invalid backendPaintings:", backendPaintings);
      return [];
    }

    return Promise.all(
      backendPaintings.map(async (painting) => {
        if (!painting) {
          console.error("Invalid painting object:", painting);
          return null;
        }

        // Construct the image URL
        let imageUrl =
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02ODM6Qj9DQDY1NT9GPzE/RU1NW2NbYFRkZGQ+Smxsb2v/2wBDARUXFx4aHiUeHiVrOjQ6a2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2v/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="; // Default gray image
        if (painting.image) {
          // Check if it's a base64 image
          if (painting.image.startsWith("data:")) {
            imageUrl = painting.image;
          } else {
            // Remove any leading slashes and 'media/' from the path
            const cleanPath = painting.image.replace(/^\/?(media\/)?/, "");
            imageUrl = painting.image.startsWith("http")
              ? painting.image
              : `${MEDIA_URL}/media/${cleanPath}`;
          }
        }

        // Try to get author information from the backend
        let authorInfo;
        try {
          const authorResponse = await api.get<PaintingWithAuthor>(
            `/painting/${painting.painting_id}/with-author/`
          );
          const paintingWithAuthor = authorResponse.data;
          const authorData =
            paintingWithAuthor.author || paintingWithAuthor.artist_details;
          console.log("Author data for painting:", {
            paintingId: painting.painting_id,
            authorData,
            rawPainting: authorResponse.data,
          });

          if (
            authorData &&
            (authorData.firstname || authorData.lastname || authorData.username)
          ) {
            authorInfo = {
              id: String(
                authorData.user_id || authorData.id || painting.artist || ""
              ),
              username: authorData.username || "anonymous",
              name:
                `${authorData.firstname || ""} ${
                  authorData.lastname || ""
                }`.trim() || "Unknown Artist",
              avatarUrl: authorData.profile_picture || undefined,
              bio: authorData.biography || undefined,
              email: authorData.email,
            };
          } else if (painting.artist) {
            // If we have an artist ID but no details, try to fetch the user profile
            const artistProfile = await userService.getUserProfile(
              painting.artist
            );
            authorInfo = {
              id: String(artistProfile.user_id || ""),
              username: artistProfile.username || "anonymous",
              name:
                `${artistProfile.firstname || ""} ${
                  artistProfile.lastname || ""
                }`.trim() || "Unknown Artist",
              avatarUrl: artistProfile.profile_picture?.toString() || undefined,
              bio: artistProfile.biography || undefined,
              email: artistProfile.email,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching author data for painting ${painting.painting_id}:`,
            error
          );
          if (painting.artist) {
            try {
              const artistProfile = await userService.getUserProfile(
                painting.artist
              );
              authorInfo = {
                id: String(artistProfile.user_id || ""),
                username: artistProfile.username || "anonymous",
                name:
                  `${artistProfile.firstname || ""} ${
                    artistProfile.lastname || ""
                  }`.trim() || "Unknown Artist",
                avatarUrl:
                  artistProfile.profile_picture?.toString() || undefined,
                bio: artistProfile.biography || undefined,
                email: artistProfile.email,
              };
            } catch (profileError) {
              console.error(
                `Error fetching artist profile for ID ${painting.artist}:`,
                profileError
              );
              authorInfo = {
                id: String(painting.artist || ""),
                username: "anonymous",
                name: "Unknown Artist",
                avatarUrl: undefined,
                bio: undefined,
                email: undefined,
              };
            }
          } else {
            authorInfo = {
              id: "",
              username: "anonymous",
              name: "Unknown Artist",
              avatarUrl: undefined,
              bio: undefined,
              email: undefined,
            };
          }
        }

        return {
          id: String(painting.painting_id || ""),
          imageUrl,
          title: painting.title || "Untitled",
          description: painting.description || "",
          price: painting.price || "",
          year: String(painting.year || ""),
          style: painting.style || "",
          material: painting.material || "",
          horizontalDepth: painting.horizontal_depth || "",
          verticalDepth: painting.vertical_depth || "",
          likes: painting.likes || 0,
          isLiked: painting.is_liked || false,
          isSaved: false,
          createdAt: painting.creation_date || new Date().toISOString(),
          author: authorInfo,
        };
      })
    ).then((results) => results.filter(Boolean) as Painting[]);
  };

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const handlePaintingAction = async (action: string, paintingId: string) => {
    if (action === "delete") {
      if (!userId) {
        enqueueSnackbar("Please log in to delete paintings", {
          variant: "error",
        });
        return;
      }

      try {
        setIsDeleting(true);
        await userService.deletePainting(paintingId);
        setPaintings((prevPaintings) =>
          prevPaintings.filter((p) => p.id !== paintingId)
        );
        enqueueSnackbar("Painting deleted successfully", {
          variant: "success",
        });
      } catch (error: any) {
        console.error("Error deleting painting:", error);
        enqueueSnackbar(error || "Failed to delete painting", {
          variant: "error",
        });
      } finally {
        setIsDeleting(false);
      }
    } else if (action === "like") {
      // ... other actions
    }
  };

  const handleProfileUpdate = async (data: UserProfile) => {
    if (!userId3) {
      enqueueSnackbar("User ID not found", { variant: "error" });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "profile_picture" && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Now userId is guaranteed to be a number
      await userService.updateUserProfile(Number(userId3), formData);
      const refreshedProfile = await userService.getUserProfile(Number(userId3));
      if (refreshedProfile) {
        updateProfile(refreshedProfile);
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };

  useEffect(() => {
    const fetchPaintings = async () => {
      if (!userId3) {
        console.log("No userId available, skipping painting fetch");
        return;
      }

      try {
        if (activeTab === "posts") {
          setIsLoadingPaintings(true);
          console.log("Fetching paintings for userId:", userId);

          // First try with the with-author endpoint
          try {
            const [paintingsResponse, userLikes] = await Promise.all([
              userService.getUserPaintingsWithAuthor(userId3),
              userService.getUserLikes(userId3),
            ]);
            console.log("Paintings response with author:", paintingsResponse);

            if (
              !paintingsResponse.paintings ||
              !Array.isArray(paintingsResponse.paintings)
            ) {
              throw new Error("Invalid paintings data");
            }

            const transformedPaintings = await transformPaintings(
              paintingsResponse.paintings
            );
            console.log("Transformed paintings:", transformedPaintings);
            setPaintings(transformedPaintings);
          } catch (error) {
            console.error(
              "Error fetching paintings with author, falling back to regular endpoint:",
              error
            );

            // Fallback to regular paintings endpoint
            const [paintingsResponse, userLikes] = await Promise.all([
              userService.getUserPaintings(userId3),
              userService.getUserLikes(userId3),
            ]);
            console.log("Paintings response from fallback:", paintingsResponse);

            if (
              !paintingsResponse.paintings ||
              !Array.isArray(paintingsResponse.paintings)
            ) {
              console.error("Invalid paintings data:", paintingsResponse);
              setPaintings([]);
              return;
            }

            const transformedPaintings = await transformPaintings(
              paintingsResponse.paintings
            );
            console.log(
              "Transformed paintings from fallback:",
              transformedPaintings
            );
            setPaintings(transformedPaintings);
          }
        } else {
          setIsLoadingSaved(true);
          // TODO: Implement saved paintings fetch when backend is ready
          setSavedPaintings([]);
        }
      } catch (error) {
        console.error("Error fetching paintings:", error);
        enqueueSnackbar("Failed to load paintings. Please try again later.", {
          variant: "error",
        });
      } finally {
        setIsLoadingPaintings(false);
        setIsLoadingSaved(false);
      }
    };

    fetchPaintings();
  }, [userId3, activeTab]);

  const handleUpload = async (data: FormData) => {
    try {
      if (!userId3) {
        console.error("No userId available for upload");
        return;
      }

      console.log("Starting painting upload...");
      const uploadedPainting = await userService.uploadPainting(data);
      console.log("Painting uploaded successfully:", uploadedPainting);

      // Fetch both updated paintings and likes after successful upload
      const [paintingsResponse, userLikes] = await Promise.all([
        userService.getUserPaintings(userId3),
        userService.getUserLikes(userId3),
      ]);
      console.log("Updated paintings after upload:", paintingsResponse);

      if (
        !paintingsResponse.paintings ||
        !Array.isArray(paintingsResponse.paintings)
      ) {
        console.error(
          "No paintings array in response after upload:",
          paintingsResponse
        );
        return;
      }

      const transformedPaintings = await transformPaintings(
        paintingsResponse.paintings
      );
      console.log("Setting new paintings:", transformedPaintings);
      setPaintings(transformedPaintings);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Failed to upload painting:", error);
    }
  };

  const renderProfileAvatar = (profile: UserProfile) => {
    if (typeof profile.profile_picture === "string") {
      return (
        <Avatar
          src={profile.profile_picture}
          alt={profile.username}
          sx={{ width: 120, height: 120 }}
        />
      );
    }

    // If no profile picture or it's a File object, show initials
    return (
      <Avatar
        sx={{
          width: 120,
          height: 120,
          bgcolor: theme.palette.primary.main,
          fontSize: "2.5rem",
          fontWeight: 500,
        }}
      >
        {getInitials(profile.firstname, profile.lastname)}
      </Avatar>
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userProfile2) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Failed to load profile</Typography>
      </Box>
    );
  }

  return (
    <MainContainer>
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <SideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userProfile2}
        onProfileUpdate={handleProfileUpdate}
      />
      <ContentWrapper maxWidth="lg">
        <ProfileCard>
          <Box sx={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
            {renderProfileAvatar(userProfile2)}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <NameTypography>
                      {userProfile2.firstname} {userProfile2.lastname}
                    </NameTypography>
                    <EditProfileButton
                      userData={userProfile2}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  </Box>
                  <UsernameTypography>
                    @{userProfile2.username}
                  </UsernameTypography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <ActionButton className="outlined" variant="outlined">
                    Follow
                  </ActionButton>
                  {/* <ActionButton
                    variant="contained"
                    startIcon={<EmailOutlinedIcon />}
                  >
                    Message
                  </ActionButton> */}
                    { userIdFromStorage && parseInt(userIdFromStorage) !== userId3 &&
                      <ActionButton
                        variant="contained"
                        startIcon={<EmailOutlinedIcon />}
                        onClick={async () => {
                          try {
                            // Assuming 'username' is available in your component's props or state
                            await userService.startChat(userProfile2.username);
                            // navigate('/chatpage') ;
                            navigate('/chatpage', { state: { username: userProfile2.username } });
                            alert('Chat started successfully!');
                          } catch (error) {
                            // navigate('/chatpage') ;
                            navigate('/chatpage', { state: { username: userProfile2.username } });
                          }
                        }}
                      >
                        Message
                      </ActionButton>
                    }
                    { userIdFromStorage && parseInt(userIdFromStorage) === userId3 &&
                      <ActionButton
                        variant="contained"
                        onClick = {() => navigate('/chatpage')}
                      >
                        <PiChatsLight style={{ fontSize: '2rem' }} />
                      </ActionButton>
                    }
                </Box>
              </Box>

              <BioTypography variant="body1">
                {userProfile2.biography || "No biography added yet."}
              </BioTypography>

              {(userProfile2.city || userProfile2.country) && (
                <LocationBox>
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="body2">
                    {[userProfile2.city, userProfile2.country]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                </LocationBox>
              )}

              <StatsContainer>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile2.number_of_paintings || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    posts
                  </Typography>
                </StatsItem>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile2.followers || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    followers
                  </Typography>
                </StatsItem>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile2.following || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    following
                  </Typography>
                </StatsItem>
              </StatsContainer>

              {userProfile2.favorite_painter && (
                <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Favorite Painter: {userProfile2.favorite_painter}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </ProfileCard>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            borderBottom: `1px solid ${
              theme.palette.mode === "dark" ? "#2A2A2A" : "#EFEFEF"
            }`,
            pb: 1,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
            }}
          >
            <TabButton
              onClick={() => setActiveTab("posts")}
              data-active={activeTab === "posts"}
            >
              Posts
            </TabButton>
            <TabButton
              onClick={() => setActiveTab("saved")}
              data-active={activeTab === "saved"}
            >
              Saved
            </TabButton>
          </Box>
          <Box sx={{ visibility: "hidden" }}>
            <TabButton>Posts</TabButton>
          </Box>
          { userIdFromStorage && parseInt(userIdFromStorage) === userId3 &&
          (
          <UploadButton
            startIcon={<AddIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Painting
          </UploadButton>
          )
          }
        </Box>

        {(isLoadingPaintings && activeTab === "posts") ||
        (isLoadingSaved && activeTab === "saved") ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : activeTab === "saved" ? (
          savedPaintings.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                gap: 2,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6">No saved paintings yet</Typography>
              <Typography variant="body2">
                Your saved paintings will appear here
              </Typography>
            </Box>
          ) : (
            <PaintingGrid
              paintings={savedPaintings}
              onAction={handlePaintingAction}
            />
          )
        ) : (
          <PaintingGrid paintings={paintings} onAction={handlePaintingAction} />
        )}

        <UploadPaintingDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleUpload}
        />
      </ContentWrapper>
    </MainContainer>
  );
};
export default ProfilePage;
