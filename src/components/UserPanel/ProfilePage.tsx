import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { BackendPainting, Painting, UserProfile } from "../../types";
import { MEDIA_URL } from "../../services/api";
import api from "../../services/api";
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
  Dialog,
  Paper,
  Chip,
  Badge,
  Divider,
  Tooltip,
  TooltipProps,
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
import { useParams, useNavigate } from "react-router-dom";

const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#0A0A0A" : "#FAFAFA",
  minHeight: "100vh",
  backgroundImage:
    theme.palette.mode === "dark"
      ? `
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%),
        radial-gradient(circle at 80% 10%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)
      `
      : `
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%),
        radial-gradient(circle at 80% 10%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)
      `,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "400px",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  },
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginTop: 64,
  position: "relative",
  animation: "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(30px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const ProfileCard = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, #141414 0%, #1A1A1A 100%)"
      : "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 100%)",
  borderRadius: 32,
  padding: theme.spacing(5),
  marginBottom: theme.spacing(4),
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)"
      : "0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.03)",
  backdropFilter: "none",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.03)"
  }`,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 40px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)"
        : "0 12px 40px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)"
        : "linear-gradient(90deg, transparent, rgba(0,0,0,0.02), transparent)",
    transform: "translateX(-100%)",
    animation: "shimmer 6s infinite",
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
  fontSize: "2.5rem",
  backgroundColor: theme.palette.mode === "dark" ? "#2C2C2C" : "#333333",
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: `
    0 4px 14px ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)"
    },
    0 0 0 2px ${theme.palette.background.paper},
    0 0 0 4px ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.1)"
    }
  `,
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.08) rotate(5deg)",
    boxShadow: `
      0 6px 20px ${
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.3)"
          : "rgba(0,0,0,0.3)"
      },
      0 0 0 4px ${theme.palette.background.paper},
      0 0 0 8px ${
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.2)"
          : "rgba(0,0,0,0.2)"
      }
    `,
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  backgroundColor: "transparent",
  borderRadius: 14,
  padding: 12,
  border: `1.5px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    transform: "scale(0)",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "50%",
  },
  "&:hover": {
    backgroundColor: "transparent",
    transform: "translateY(-2px)",
    border: `1.5px solid ${
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.2)"
    }`,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 20px rgba(0, 0, 0, 0.3)"
        : "0 4px 20px rgba(0, 0, 0, 0.15)",
    "&::before": {
      transform: "scale(1.5)",
    },
    "& .MuiSvgIcon-root": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  "&:active": {
    transform: "translateY(0)",
    boxShadow: "none",
  },
  "& .MuiSvgIcon-root": {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "1.25rem",
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
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255,255,255,0.2)"
        : "0 4px 12px rgba(0,0,0,0.2)",
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

const TabButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  backgroundColor: "transparent",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
  },
  "&.active": {
    backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
    color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255,255,255,0.2)"
        : "0 4px 12px rgba(0,0,0,0.2)",
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
  }`,
  "& .MuiChip-deleteIcon": {
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.7)"
        : "rgba(0,0,0,0.7)",
    "&:hover": {
      color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
    color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
    boxShadow:
      theme.palette.mode === "dark" ? "0 0 0 2px #1E1E1E" : "0 0 0 2px #FFFFFF",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.1)",
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  borderColor:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
}));

const StyledTooltip = styled((props: TooltipProps) => <Tooltip {...props} />)(
  ({ theme }) => ({
    "& .MuiTooltip-tooltip": {
      backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#333333",
      color: theme.palette.mode === "dark" ? "#000000" : "#FFFFFF",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 4px 12px rgba(255,255,255,0.2)"
          : "0 4px 12px rgba(0,0,0,0.2)",
      fontSize: 12,
      borderRadius: 8,
    },
  })
);

const UploadSection = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: 24,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(26, 26, 26, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.05)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  width: 320,
  zIndex: 100,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.4)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
  transform: "translateY(0)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 40px rgba(0, 0, 0, 0.5)"
        : "0 12px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const UploadTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  letterSpacing: "-0.3px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  },
}));

const UploadDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2.5),
  fontSize: "0.875rem",
  lineHeight: 1.5,
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  border: `2px dashed ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(0, 0, 0, 0.15)"
  }`,
  borderRadius: 14,
  padding: "12px 24px",
  width: "100%",
  fontSize: "0.9rem",
  fontWeight: 600,
  letterSpacing: "0.3px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(45deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06))"
        : "linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.04))",
    transform: "translateX(-100%)",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover": {
    borderStyle: "solid",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.03)",
    transform: "translateY(-2px)",
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.25)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 20px rgba(0, 0, 0, 0.3)"
        : "0 4px 20px rgba(0, 0, 0, 0.15)",
    "&::before": {
      transform: "translateX(100%)",
    },
    "& .MuiSvgIcon-root": {
      transform: "scale(1.1) rotate(180deg)",
    },
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem",
    marginRight: theme.spacing(1),
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

const NameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  fontWeight: 800,
  letterSpacing: "-0.5px",
  fontSize: "2.25rem",
  marginBottom: theme.spacing(1),
  transition: "color 0.3s ease",
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
  const {
    userProfile: loggedInProfile,
    userId: loggedInUserId,
    isLoading,
    updateProfile,
  } = useAuth();
  const { userId: urlUserId } = useParams();
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [savedPaintings, setSavedPaintings] = useState<Painting[]>([]);
  const [isLoadingPaintings, setIsLoadingPaintings] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const navigate = useNavigate();

  // Determine which profile to show
  const isOwnProfile = !urlUserId || Number(urlUserId) === loggedInUserId;
  const userProfile = isOwnProfile ? loggedInProfile : viewedProfile;
  const userId = isOwnProfile ? loggedInUserId : Number(urlUserId);

  // Fetch other user's profile if needed
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!urlUserId || Number(urlUserId) === loggedInUserId) {
        return;
      }

      try {
        const profile = await userService.getUserProfile(Number(urlUserId));
        setViewedProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        enqueueSnackbar("Failed to load user profile", { variant: "error" });
      }
    };

    fetchUserProfile();
  }, [urlUserId, loggedInUserId]);

  const handleSidebarToggle = useCallback(() => {
    console.log("Toggling sidebar. Current state:", sidebarOpen);
    setSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log("Sidebar state changed:", sidebarOpen);
  }, [sidebarOpen]);

  const transformPaintings = async (backendPaintings: PaintingWithAuthor[]) => {
    try {
      const transformedPaintings = await Promise.all(
        backendPaintings.map(async (painting) => {
          // Get author details if not already included
          let authorData = painting.artist_name;
          if (!authorData && painting.artist) {
            try {
              const userDetails = await userService.getUserProfile(
                painting.artist
              );
              authorData = `${userDetails.firstname} ${userDetails.lastname}`;
            } catch (error) {
              console.error("Error fetching author details:", error);
              authorData = "Unknown Artist";
            }
          }

          // Use the likes and is_liked values directly from the backend painting data
          const transformed: Painting = {
            id: painting.painting_id.toString(),
            imageUrl: painting.image
              ? painting.image.startsWith("http")
                ? painting.image
                : `${MEDIA_URL}/${painting.image.replace(/^\//, "")}`
              : "https://via.placeholder.com/400x400?text=No+Image",
            title: painting.title || "Untitled",
            description: painting.description || "No description",
            price: painting.price || "0",
            likes: painting.likes || 0,
            isLiked: painting.is_liked || false,
            isSaved: false, // TODO: Implement saved status
            createdAt: painting.creation_date || new Date().toISOString(),
            style: painting.style || "Unknown",
            material: painting.material || "Unknown",
            horizontalDepth: painting.horizontal_depth || "Unknown",
            verticalDepth: painting.vertical_depth || "Unknown",
            author: authorData
              ? {
                  id: painting.artist?.toString() || "0",
                  username: "",
                  name: authorData,
                  avatarUrl: "",
                }
              : undefined,
          };

          return transformed;
        })
      );

      console.log("Transformed paintings:", transformedPaintings);
      return transformedPaintings;
    } catch (error) {
      console.error("Error transforming paintings:", error);
      throw error;
    }
  };

  const getInitials = (firstname: string, lastname: string) => {
    const firstInitial = firstname ? firstname[0].toUpperCase() : "";
    const lastInitial = lastname ? lastname[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const handlePaintingAction = async (action: string, paintingId: string) => {
    if (action === "like") {
      // Find the painting in state
      const targetPainting = paintings.find((p) => p.id === paintingId);
      if (!targetPainting) return;

      try {
        // Optimistic update
        setPaintings((prevPaintings: Painting[]) =>
          prevPaintings.map(
            (painting: Painting): Painting =>
              painting.id === paintingId
                ? {
                    ...painting,
                    isLiked: !painting.isLiked,
                    likes: painting.likes + (painting.isLiked ? -1 : 1),
                  }
                : painting
          )
        );

        // Call the API
        if (targetPainting.isLiked) {
          await userService.unlikePainting(parseInt(paintingId));
          enqueueSnackbar("Painting unliked!", { variant: "success" });
        } else {
          await userService.likePainting(parseInt(paintingId));
          enqueueSnackbar("Painting liked!", { variant: "success" });
        }
      } catch (error: any) {
        console.error("Error toggling like:", error);
        // Revert the optimistic update on error
        setPaintings((prevPaintings: Painting[]) =>
          prevPaintings.map(
            (painting: Painting): Painting =>
              painting.id === paintingId
                ? {
                    ...painting,
                    isLiked: targetPainting.isLiked,
                    likes: targetPainting.likes,
                  }
                : painting
          )
        );
        enqueueSnackbar(error.message || "Failed to toggle like", {
          variant: "error",
        });
      }
    } else if (action === "save") {
      // ... existing save logic ...
    }
  };

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    if (!userId) return;

    try {
      console.log("Starting profile update with data:", updatedProfile);

      // If updatedProfile is already FormData, use it directly
      let formData: FormData;
      if (updatedProfile instanceof FormData) {
        formData = updatedProfile;
      } else {
        // Create new FormData if it's a regular object
        formData = new FormData();
        Object.entries(updatedProfile).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "boolean") {
              formData.append(key, String(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
      }

      // Log what's being sent
      console.log("Sending FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // First update the profile
      await userService.updateUserProfile(Number(userId), formData);
      console.log("Profile update successful, fetching updated profile...");

      // Then fetch the updated profile
      const refreshedProfile = await userService.getUserProfile(Number(userId));
      console.log("Fetched updated profile:", refreshedProfile);

      // Update the profile in context
      updateProfile(refreshedProfile);
      console.log("Updated profile in context");

      // Force avatar refresh in all components
      setAvatarKey((prev) => prev + 1);

      // Update localStorage with new profile picture if it exists
      if (
        refreshedProfile.profile_picture &&
        typeof refreshedProfile.profile_picture === "string"
      ) {
        const profilePicUrl = refreshedProfile.profile_picture.startsWith(
          "http"
        )
          ? refreshedProfile.profile_picture
          : `${MEDIA_URL}/${refreshedProfile.profile_picture.replace(
              /^\//,
              ""
            )}`;
        localStorage.setItem("lastProfilePicture", profilePicUrl);
      }

      // Show success message
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (error: any) {
      console.error("Error updating profile:", {
        error,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update profile";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleMessageClick = async (username: string) => {
    try {
      // Try to create a chat with the user
      const chatData = await userService.createChat(username);
      navigate("/chat", { state: { username } });
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.detail?.includes("already exists")
      ) {
        // If chat already exists, just navigate to it
        navigate("/chat", { state: { username } });
      } else {
        console.error("Error creating chat:", error);
        enqueueSnackbar("Failed to start chat. Please try again.", {
          variant: "error",
        });
      }
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

          // First try with the with-author endpoint
          try {
            // Get fresh data from the backend
            const paintingsResponse =
              await userService.getUserPaintingsWithAuthor(userId);
            console.log("Paintings response with author:", paintingsResponse);

            if (
              !paintingsResponse.paintings ||
              !Array.isArray(paintingsResponse.paintings)
            ) {
              throw new Error("Invalid paintings data");
            }

            // Get fresh like status for each painting
            const paintingsWithLikes = await Promise.all(
              paintingsResponse.paintings.map(async (painting) => {
                const likesCount = await userService.GetlikePainting(
                  painting.painting_id
                );
                const isLiked = await userService.checkUserLikedPainting(
                  userId,
                  painting.painting_id
                );
                return {
                  ...painting,
                  likes: likesCount,
                  is_liked: isLiked,
                };
              })
            );

            const transformedPaintings = await transformPaintings(
              paintingsWithLikes
            );
            console.log(
              "Transformed paintings with fresh like data:",
              transformedPaintings
            );
            setPaintings(transformedPaintings);
          } catch (error) {
            console.error(
              "Error fetching paintings with author, falling back to regular endpoint:",
              error
            );

            // Fallback to regular paintings endpoint with the same like status check
            const paintingsResponse = await userService.getUserPaintings(
              userId
            );
            console.log("Paintings response from fallback:", paintingsResponse);

            if (
              !paintingsResponse.paintings ||
              !Array.isArray(paintingsResponse.paintings)
            ) {
              console.error("Invalid paintings data:", paintingsResponse);
              setPaintings([]);
              return;
            }

            // Get fresh like status for each painting
            const paintingsWithLikes = await Promise.all(
              paintingsResponse.paintings.map(async (painting) => {
                const likesCount = await userService.GetlikePainting(
                  painting.painting_id
                );
                const isLiked = await userService.checkUserLikedPainting(
                  userId,
                  painting.painting_id
                );
                return {
                  ...painting,
                  likes: likesCount,
                  is_liked: isLiked,
                };
              })
            );

            const transformedPaintings = await transformPaintings(
              paintingsWithLikes
            );
            console.log(
              "Transformed paintings from fallback with fresh like data:",
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
        enqueueSnackbar("Failed to load paintings", { variant: "error" });
      } finally {
        setIsLoadingPaintings(false);
        setIsLoadingSaved(false);
      }
    };

    fetchPaintings();
  }, [userId, activeTab, enqueueSnackbar]);

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

  const renderProfileAvatar = (userData: UserProfile) => {
    if (
      userData.profile_picture &&
      typeof userData.profile_picture === "string" &&
      userData.profile_picture.trim() !== ""
    ) {
      const profilePicUrl = userData.profile_picture.startsWith("http")
        ? userData.profile_picture
        : `${MEDIA_URL}/${userData.profile_picture.replace(/^\//, "")}`;

      // Store in localStorage for persistence
      localStorage.setItem("lastProfilePicture", profilePicUrl);

      return (
        <ProfileAvatar
          key={avatarKey}
          src={profilePicUrl}
          alt={userData.username}
        />
      );
    }

    // Try to get from localStorage if no current picture
    const cachedUrl = localStorage.getItem("lastProfilePicture");
    if (cachedUrl) {
      return (
        <ProfileAvatar
          key={avatarKey}
          src={cachedUrl}
          alt={userData.username}
        />
      );
    }

    // Only show initials if there's no profile picture and no cached URL
    return (
      <ProfileAvatar key={avatarKey}>
        {getInitials(userData.firstname || "", userData.lastname || "")}
      </ProfileAvatar>
    );
  };

  // Update avatarKey when userProfile changes
  useEffect(() => {
    if (userProfile?.profile_picture) {
      setAvatarKey((prev) => prev + 1);
    }
  }, [userProfile?.profile_picture]);

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
      {isOwnProfile && (
        <SideBar
          key={avatarKey}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
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
                    {isOwnProfile && (
                      <EditProfileButton
                        userData={userProfile}
                        onProfileUpdate={handleProfileUpdate}
                      />
                    )}
                  </Box>
                  <UsernameTypography>
                    @{userProfile.username}
                  </UsernameTypography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {!isOwnProfile && (
                    <>
                      <ActionButton className="outlined" variant="outlined">
                        Follow
                      </ActionButton>
                      <ActionButton
                        className="outlined"
                        variant="outlined"
                        startIcon={<EmailOutlinedIcon />}
                        onClick={() => handleMessageClick(userProfile.username)}
                      >
                        Message
                      </ActionButton>
                    </>
                  )}
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
            justifyContent: "center",
            mb: 4,
            borderBottom: `1px solid ${
              theme.palette.mode === "dark" ? "#2A2A2A" : "#EFEFEF"
            }`,
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>

        {isOwnProfile && (
          <UploadSection>
            <UploadTitle>
              <AddIcon /> Share Your Artwork
            </UploadTitle>
            <UploadDescription>
              Showcase your paintings to the world. Upload high-quality images
              of your artwork.
            </UploadDescription>
            <UploadButton
              startIcon={<AddIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Painting
            </UploadButton>
          </UploadSection>
        )}

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
