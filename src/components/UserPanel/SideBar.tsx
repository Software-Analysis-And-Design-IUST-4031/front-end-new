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
  width: isMinimized ? 80 : isOpen ? 280 : 0,
  height: "100vh",
  backgroundColor: theme.palette.mode === "dark" ? "#111111" : "#FFFFFF",
  borderRight: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflowX: "hidden",
  overflowY: "auto",
  zIndex: 1200,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  transform: isOpen ? "translateX(0)" : "translateX(-100%)",
  visibility: isOpen ? "visible" : "hidden",
  boxShadow: isOpen
    ? theme.palette.mode === "dark"
      ? "0 0 20px rgba(0,0,0,0.5)"
      : "0 0 20px rgba(0,0,0,0.1)"
    : "none",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
    borderRadius: "4px",
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3, 2),
  gap: theme.spacing(1),
  borderBottom: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
  width: "100%",
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: "2.5rem",
  backgroundColor: theme.palette.mode === "dark" ? "#333333" : "#f5f5f5",
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: `
    0 4px 14px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)"
    },
    0 0 0 2px ${theme.palette.background.paper},
    0 0 0 4px ${
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)"
    }
  `,
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `
      0 6px 20px ${
        theme.palette.mode === "dark" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)"
      },
      0 0 0 2px ${theme.palette.background.paper},
      0 0 0 4px ${
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.2)"
          : "rgba(0,0,0,0.2)"
      }
    `,
  },
}));

const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.mode === "dark" ? "#FFFFFF" : theme.palette.text.primary,
  textAlign: "center",
  marginTop: theme.spacing(2),
}));

const UserEmail = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  textAlign: "center",
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "0 8px",
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
  padding: theme.spacing(1.5),
  borderRadius: 12,
  width: "100%",
  justifyContent: "flex-start",
  color: theme.palette.text.primary,
  backgroundColor: "transparent",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
    transform: "translateX(4px)",
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    transition: "transform 0.2s ease",
  },
  "&:hover .MuiSvgIcon-root": {
    transform: "scale(1.1)",
  },
  "&.active": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.08)",
    "& .MuiTypography-root": {
      fontWeight: 600,
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
            {renderUserAvatar(userData)}
            <Box sx={{ width: "100%" }}>
              <UserName>
                {userData.firstname} {userData.lastname}
              </UserName>
              <UserEmail>{userData.email}</UserEmail>
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
