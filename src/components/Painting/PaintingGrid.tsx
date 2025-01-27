import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useAuth } from "../../contexts/AuthContext";
import paintingService from "../../services/paintingService";

interface PaintingDialogProps {
  painting: any;
  open: boolean;
  onClose: () => void;
  onSaveChange?: (saved: boolean) => void;
}

const PaintingDialog: React.FC<PaintingDialogProps> = ({
  painting,
  open,
  onClose,
  onSaveChange,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (painting && user) {
        try {
          const [likedStatus, savedStatus] = await Promise.all([
            paintingService.checkIfLiked(user.user_id, painting.id),
            paintingService.checkIfPaintingSaved(painting.id),
          ]);
          setLiked(likedStatus);
          setSaved(savedStatus);
        } catch (error) {
          console.error("Error checking painting status:", error);
        }
      }
    };
    checkStatus();
  }, [painting, user]);

  const handleLike = async () => {
    if (!painting || loading || !user) return;
    setLoading(true);
    try {
      if (liked) {
        await paintingService.unlikePainting(painting.id);
      } else {
        await paintingService.likePainting(painting.id);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!painting || loading || !user) return;
    setLoading(true);
    try {
      if (saved) {
        await paintingService.unsavePainting(painting.id);
      } else {
        await paintingService.savePainting(painting.id);
      }
      setSaved(!saved);
      if (onSaveChange) {
        onSaveChange(!saved);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>{/* Your existing dialog content */}</DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <IconButton
          onClick={handleLike}
          disabled={loading || !user}
          sx={{
            color: liked ? "error.main" : "inherit",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton
          onClick={handleSave}
          disabled={loading || !user}
          sx={{
            color: saved ? "primary.main" : "inherit",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaintingDialog;
