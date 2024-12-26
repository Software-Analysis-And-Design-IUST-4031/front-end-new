import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  styled,
  useTheme,
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
import { useAuth } from "../../context/AuthContext";
import { userService, UpdateProfileData } from "../../services/userService";
import { MEDIA_URL } from "../../services/api";
import { UserProfile, BackendPainting, Painting } from "../../types";
import Navbar from "../Navbar";
import PaintingGrid from "./PaintingGrid";
import ThemeCustomizer from "./ThemeCustomizer";
import UploadPaintingDialog from "./UploadPaintingDialog";
import { useSnackbar } from "notistack";
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

  const handleSidebarToggle = useCallback(() => {
    console.log("Toggling sidebar. Current state:", sidebarOpen);
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log("Sidebar state changed:", sidebarOpen);
  }, [sidebarOpen]);

  const transformPaintings = (
    backendPaintings: BackendPainting[]
  ): Painting[] => {
    if (!Array.isArray(backendPaintings)) {
      console.error("Invalid backendPaintings:", backendPaintings);
      return [];
    }

    return backendPaintings
      .map((painting) => {
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

        console.log("Processing painting:", {
          original: painting,
          transformedImageUrl: imageUrl,
          mediaUrl: MEDIA_URL,
          originalImage: painting.image,
          cleanedPath: painting.image
            ? painting.image.replace(/^\/?(media\/)?/, "")
            : null,
        });

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
        };
      })
      .filter(Boolean) as Painting[];
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
    if (!userId) {
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
      await userService.updateUserProfile(Number(userId), formData);
      const refreshedProfile = await userService.getUserProfile(Number(userId));
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
      if (!userId) {
        console.log("No userId available, skipping painting fetch");
        return;
      }

      try {
        if (activeTab === "posts") {
          setIsLoadingPaintings(true);
          console.log("Fetching paintings for userId:", userId);
          const [paintingsResponse, userLikes] = await Promise.all([
            userService.getUserPaintings(userId),
            userService.getUserLikes(userId),
          ]);
          console.log("Paintings response:", paintingsResponse);

          if (
            !paintingsResponse.paintings ||
            !Array.isArray(paintingsResponse.paintings)
          ) {
            console.error("Invalid paintings data:", paintingsResponse);
            setPaintings([]);
            return;
          }

          const transformedPaintings = transformPaintings(
            paintingsResponse.paintings
          );
          console.log("Transformed paintings:", transformedPaintings);
          setPaintings(transformedPaintings);
        } else {
          setIsLoadingSaved(true);
          // TODO: Implement saved paintings fetch when backend is ready
          setSavedPaintings([]);
        }
      } catch (error) {
        console.error("Error fetching paintings:", error);
      } finally {
        setIsLoadingPaintings(false);
        setIsLoadingSaved(false);
      }
    };

    fetchPaintings();
  }, [userId, activeTab]);

  const handleUpload = async (data: FormData) => {
    try {
      if (!userId) {
        console.error("No userId available for upload");
        return;
      }

      console.log("Starting painting upload...");
      const uploadedPainting = await userService.uploadPainting(data);
      console.log("Painting uploaded successfully:", uploadedPainting);

      // Fetch both updated paintings and likes after successful upload
      const [paintingsResponse, userLikes] = await Promise.all([
        userService.getUserPaintings(userId),
        userService.getUserLikes(userId),
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

      const transformedPaintings = transformPaintings(
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

  if (!userProfile) {
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
        userData={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
      <ContentWrapper maxWidth="lg">
        <ProfileCard>
          <Box sx={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
            {renderProfileAvatar(userProfile)}
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
                      {userProfile.firstname} {userProfile.lastname}
                    </NameTypography>
                    <EditProfileButton
                      userData={userProfile}
                      onProfileUpdate={handleProfileUpdate}
                    />
                  </Box>
                  <UsernameTypography>
                    @{userProfile.username}
                  </UsernameTypography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <ActionButton className="outlined" variant="outlined">
                    Follow
                  </ActionButton>
                  <ActionButton
                    variant="contained"
                    startIcon={<EmailOutlinedIcon />}
                  >
                    Message
                  </ActionButton>
                </Box>
              </Box>

              <BioTypography variant="body1">
                {userProfile.biography || "No biography added yet."}
              </BioTypography>

              {(userProfile.city || userProfile.country) && (
                <LocationBox>
                  <LocationOnIcon fontSize="small" />
                  <Typography variant="body2">
                    {[userProfile.city, userProfile.country]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                </LocationBox>
              )}

              <StatsContainer>
                <StatsItem>
                  <Typography variant="h5" fontWeight="600">
                    {userProfile.number_of_paintings || 0}
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
                    {userProfile.followers || 0}
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
                    {userProfile.following || 0}
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

              {userProfile.favorite_painter && (
                <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Favorite Painter: {userProfile.favorite_painter}
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
          <UploadButton
            startIcon={<AddIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Painting
          </UploadButton>
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
