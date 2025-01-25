import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Backdrop,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { UserProfile } from "../../types";
import EditProfileButton from "./EditProfileButton";
import { MEDIA_URL } from "../../services/api";

interface SideBarProps {
  open: boolean;
  onClose: () => void;
  userData: UserProfile;
  onProfileUpdate: (data: UserProfile) => void;
}

interface StyledBoxProps {
  isOpen: boolean;
  isMinimized: boolean;
}

const SideBarContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !["isOpen", "isMinimized"].includes(prop as string),
})<StyledBoxProps>(({ theme, isOpen, isMinimized }) => ({
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  width: isMinimized ? 60 : isOpen ? 280 : 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(16,20,24,0.97)"
      : "rgba(255,255,255,0.97)",
  borderRight: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(33,150,243,0.15)"
      : "rgba(33,150,243,0.1)"
  }`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  overflowX: "hidden",
  overflowY: "auto",
  zIndex: 1200,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  transform: isOpen ? "translateX(0)" : "translateX(-100%)",
  visibility: isOpen ? "visible" : "hidden",
  backdropFilter: "blur(24px)",
  boxShadow: isOpen
    ? theme.palette.mode === "dark"
      ? "0 0 40px rgba(0,0,0,0.5), 4px 0 24px rgba(33,150,243,0.2)"
      : "0 0 40px rgba(0,0,0,0.1), 4px 0 24px rgba(33,150,243,0.1)"
    : "none",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(33,150,243,0.4)"
        : "rgba(33,150,243,0.3)",
    borderRadius: "4px",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "200px",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg, rgba(33,150,243,0.1) 0%, rgba(16,20,24,0) 100%)"
        : "linear-gradient(180deg, rgba(33,150,243,0.05) 0%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  borderBottom: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(33,150,243,0.15)"
      : "rgba(33,150,243,0.1)"
  }`,
  marginBottom: theme.spacing(2),
  animation: "fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(145deg, rgba(16,20,24,0.7) 0%, rgba(23,28,33,0.7) 100%)"
      : "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(250,252,254,0.7) 100%)",
  borderRadius: 24,
  backdropFilter: "blur(12px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 24px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(33,150,243,0.1)"
      : "0 4px 24px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(33,150,243,0.05)",
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(-10px) scale(0.98)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0) scale(1)",
    },
  },
}));

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

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const UserEmail = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

const NavSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  animation: "slideIn 0.5s ease-out",
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translateX(-20px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  borderRadius: 16,
  width: "100%",
  justifyContent: "flex-start",
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
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
        ? "linear-gradient(45deg, rgba(33,150,243,0.15), rgba(33,150,243,0))"
        : "linear-gradient(45deg, rgba(33,150,243,0.1), rgba(33,150,243,0))",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(33,150,243,0.15)"
        : "rgba(33,150,243,0.1)",
    transform: "translateX(4px)",
    "&::before": {
      opacity: 1,
    },
  },
  "& .MuiSvgIcon-root": {
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    color: theme.palette.mode === "dark" ? "#90CAF9" : "#1976D2",
    filter: "drop-shadow(0 2px 4px rgba(33,150,243,0.2))",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "scale(1.2) rotate(8deg)",
    color: "#2196F3",
    filter: "drop-shadow(0 4px 8px rgba(33,150,243,0.3))",
  },
  "&.active": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(33,150,243,0.2)"
        : "rgba(33,150,243,0.15)",
    "&::before": {
      opacity: 1,
    },
    "& .MuiTypography-root": {
      fontWeight: 600,
      color: theme.palette.mode === "dark" ? "#90CAF9" : "#1976D2",
      textShadow: "0 2px 4px rgba(33,150,243,0.2)",
    },
  },
}));

const SideBar: React.FC<SideBarProps> = ({
  open,
  onClose,
  userData,
  onProfileUpdate,
}) => {
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const theme = useTheme();

  // Add useEffect to update avatarKey when profile picture changes
  React.useEffect(() => {
    if (userData?.profile_picture) {
      setAvatarKey((prev) => prev + 1);
    }
  }, [userData?.profile_picture]);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

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

      // Store in localStorage for persistence
      localStorage.setItem("lastProfilePicture", profilePicUrl);

      return (
        <UserAvatar
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
        <UserAvatar key={avatarKey} src={cachedUrl} alt={userData.username} />
      );
    }

    // Only show initials if there's no profile picture and no cached URL
    return (
      <UserAvatar key={avatarKey}>
        {getInitials(userData.firstname || "", userData.lastname || "")}
      </UserAvatar>
    );
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton onClick={toggleMinimize}>
            {minimized ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {!minimized && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {!minimized && (
          <UserSection>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderUserAvatar(userData)}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {userData.firstname} {userData.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <EditProfileButton
                userData={userData}
                onProfileUpdate={onProfileUpdate}
              />
            </Box>
          </UserSection>
        )}

        <NavSection>
          <Tooltip title="Home" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/")}>
              <HomeIcon />
              {!minimized && <Typography>Home</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Profile" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/profile")}>
              <PersonIcon />
              {!minimized && <Typography>Profile</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Messages" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/chat")}>
              <ChatIcon />
              {!minimized && <Typography>Messages</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Favorites" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/favorites")}>
              <FavoriteIcon />
              {!minimized && <Typography>Favorites</Typography>}
            </NavButton>
          </Tooltip>

          <Tooltip title="Settings" placement={minimized ? "right" : "top"}>
            <NavButton onClick={() => handleNavigation("/settings")}>
              <SettingsIcon />
              {!minimized && <Typography>Settings</Typography>}
            </NavButton>
          </Tooltip>
        </NavSection>
      </SideBarContainer>
    </>
  );
};

export default SideBar;
