import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Stack,
  Paper,
  styled,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import PaletteIcon from "@mui/icons-material/Palette";
import BrushIcon from "@mui/icons-material/Brush";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CollectionsIcon from "@mui/icons-material/Collections";

interface Profile {
  fullName: string;
  username: string;
  avatarUrl: string;
  description: string;
  location: string;
  socialLinks: {
    twitter: string;
    pinterest: string;
  };
  favorite_painter?: string;
  favorite_painting?: string;
  favorite_painting_style?: string;
  favorite_painting_technique?: string;
  favorite_painting_to_own?: string;
}

interface ProfileHeaderProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
  onThemeClick: () => void;
}

const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 12px rgba(0,0,0,0.3)"
      : "0 4px 12px rgba(0,0,0,0.05)",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  cursor: "pointer",
  border: `4px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
  }`,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
  transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.04)",
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
    transform: "translateY(-2px)",
  },
  transition: "transform 0.2s ease-in-out",
}));

const MessageButton = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  color:
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.common.black,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.2)",
  },
}));

const FavoriteChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
  }`,
  "& .MuiChip-label": {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.15)"
        : "rgba(0,0,0,0.08)",
  },
}));

const FavoritesSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.05)"
      : "rgba(0,0,0,0.02)",
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
  }`,
}));

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onUpdate,
  onThemeClick,
}) => {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEditSubmit = () => {
    onUpdate(editedProfile);
    setEditDialogOpen(false);
  };

  const handleAvatarClick = () => {
    console.log("Avatar click - will implement file upload");
  };

  const renderFavorites = (
    items: string | undefined,
    icon: React.ReactNode,
    label: string
  ) => {
    if (!items) return null;
    const itemList = items.split(",").filter(Boolean);
    if (itemList.length === 0) return null;

    return (
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          {icon} {label}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {itemList.map((item, index) => (
            <FavoriteChip key={index} label={item.trim()} variant="outlined" />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <ProfileContainer>
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        <StyledAvatar
          src={profile.avatarUrl}
          onClick={handleAvatarClick}
          alt={profile.fullName}
        />

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark"
                      ? "common.white"
                      : "common.black",
                }}
              >
                {profile.fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                @{profile.username}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              sx={{ textTransform: "none" }}
            >
              Edit Profile
            </Button>
            <MessageButton
              variant="contained"
              onClick={() => {
                /* Add message handler */
              }}
              sx={{ textTransform: "none" }}
            >
              Message
            </MessageButton>
          </Box>

          {profile.description && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {profile.description}
            </Typography>
          )}

          {profile.location && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            </Box>
          )}

          <Stack direction="row" spacing={1}>
            {profile.socialLinks.twitter && (
              <SocialButton>
                <TwitterIcon />
              </SocialButton>
            )}
            {profile.socialLinks.pinterest && (
              <SocialButton>
                <PinterestIcon />
              </SocialButton>
            )}
          </Stack>

          <FavoritesSection>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Artistic Preferences
            </Typography>
            {renderFavorites(
              profile.favorite_painter,
              <PaletteIcon color="primary" />,
              "Favorite Painters"
            )}
            {renderFavorites(
              profile.favorite_painting,
              <CollectionsIcon color="secondary" />,
              "Favorite Paintings"
            )}
            {renderFavorites(
              profile.favorite_painting_style,
              <BrushIcon sx={{ color: "#FF9800" }} />,
              "Favorite Styles"
            )}
            {renderFavorites(
              profile.favorite_painting_technique,
              <ColorLensIcon sx={{ color: "#4CAF50" }} />,
              "Favorite Techniques"
            )}
            {renderFavorites(
              profile.favorite_painting_to_own,
              <FavoriteIcon sx={{ color: "#F44336" }} />,
              "Dream Collection"
            )}
          </FavoritesSection>
        </Box>
      </Box>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              value={editedProfile.fullName}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, fullName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={editedProfile.description}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  description: e.target.value,
                })
              }
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Location"
              value={editedProfile.location}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, location: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Twitter"
              value={editedProfile.socialLinks.twitter}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  socialLinks: {
                    ...editedProfile.socialLinks,
                    twitter: e.target.value,
                  },
                })
              }
              fullWidth
            />
            <TextField
              label="Pinterest"
              value={editedProfile.socialLinks.pinterest}
              onChange={(e) =>
                setEditedProfile({
                  ...editedProfile,
                  socialLinks: {
                    ...editedProfile.socialLinks,
                    pinterest: e.target.value,
                  },
                })
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileContainer>
  );
};

export default ProfileHeader;
