import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  Box,
  IconButton,
  Avatar,
  Typography,
  Backdrop,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { MEDIA_URL } from "../../services/api";

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
        }}
      >
        {/* ... rest of the component ... */}
        {renderUserAvatar(userData)}
        {/* ... rest of the component ... */}
      </SideBarContainer>
    </>
  );
};

export default SideBar;
