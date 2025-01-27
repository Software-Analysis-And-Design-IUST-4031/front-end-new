import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  Box,
  IconButton,
  Avatar,
  Typography,
  Backdrop,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { MEDIA_URL } from "../../services/api";
import FavoritesDialog from "../UserPanel/FavoritesDialog";
import FavoriteIcon from "@mui/icons-material/Favorite";

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: "2.5rem",
  backgroundColor: theme.palette.mode === "dark" ? "#1976D2" : "#2196F3",
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: `
    0 4px 14px rgba(33,150,243,0.3),
    0 0 0 2px ${theme.palette.background.paper},
    0 0 0 4px ${
      theme.palette.mode === "dark"
        ? "rgba(33,150,243,0.3)"
        : "rgba(33,150,243,0.2)"
    }
  `,
  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.08) rotate(5deg)",
    boxShadow: `
      0 6px 20px rgba(33,150,243,0.4),
      0 0 0 4px ${theme.palette.background.paper},
      0 0 0 8px ${
        theme.palette.mode === "dark"
          ? "rgba(33,150,243,0.4)"
          : "rgba(33,150,243,0.3)"
      }
    `,
  },
}));

const SideBarContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  right: 0,
  height: "100vh",
  width: 300,
  backgroundColor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
  borderLeft: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  zIndex: 1200,
  transition: "transform 0.3s ease-in-out",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  overflowY: "auto",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  textTransform: "none",
  fontWeight: 600,
  width: "100%",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
  }`,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.08)",
    transform: "translateY(-2px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(255,255,255,0.1)"
        : "0 4px 12px rgba(0,0,0,0.1)",
  },
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
}));

interface SideBarProps {
  open: boolean;
  onClose: () => void;
  userData: UserProfile;
  onProfileUpdate: (data: UserProfile) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  open,
  onClose,
  userData,
  onProfileUpdate,
}) => {
  const [avatarKey, setAvatarKey] = useState(0);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);
  const theme = useTheme();

  const getInitials = (firstname: string, lastname: string) => {
    const firstInitial = firstname ? firstname[0].toUpperCase() : "";
    const lastInitial = lastname ? lastname[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const renderUserAvatar = (userData: UserProfile) => {
    if (
      userData.profile_picture &&
      typeof userData.profile_picture === "string" &&
      userData.profile_picture.trim() !== ""
    ) {
      const profilePicUrl = userData.profile_picture.startsWith("http")
        ? userData.profile_picture
        : `${MEDIA_URL}/${userData.profile_picture.replace(/^\//, "")}`;

      return (
        <UserAvatar
          key={avatarKey}
          src={`${profilePicUrl}?t=${Date.now()}`}
          alt={userData.username}
        />
      );
    }

    // Only show initials if there's no profile picture
    return (
      <UserAvatar key={avatarKey}>
        {getInitials(userData.firstname || "", userData.lastname || "")}
      </UserAvatar>
    );
  };

  // Update avatarKey when userData changes
  useEffect(() => {
    setAvatarKey((prev) => prev + 1);
  }, [userData.profile_picture]);

  return (
    <>
      <Backdrop
        open={open && !minimized}
        onClick={onClose}
        sx={{
          zIndex: 1100,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />
      <SideBarContainer
        isOpen={open}
        isMinimized={minimized}
        sx={{
          boxShadow: open ? theme.shadows[8] : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {renderUserAvatar(userData)}
        <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
          {userData.firstname} {userData.lastname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userData.email}
        </Typography>

        <Box sx={{ width: "100%", mt: 3 }}>
          <ActionButton
            startIcon={<FavoriteIcon />}
            onClick={() => setFavoritesOpen(true)}
          >
            My Favorites
          </ActionButton>
        </Box>

        <FavoritesDialog
          open={favoritesOpen}
          onClose={() => setFavoritesOpen(false)}
          userProfile={userData}
        />
      </SideBarContainer>
    </>
  );
};

export default SideBar;
