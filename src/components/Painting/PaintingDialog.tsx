import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../context/AuthContext";
import paintingService from "../../services/paintingService";
import { useSnackbar } from "notistack";
import LikeButton from "./LikeButton";

interface PaintingDialogProps {
  painting: any;
  open: boolean;
  onClose: () => void;
}

const PaintingDialog: React.FC<PaintingDialogProps> = ({
  painting,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const checkStatus = async () => {
      if (painting && user) {
        try {
          const isSaved = await paintingService.checkIfPaintingSaved(
            painting.id
          );
          setSaved(isSaved);
        } catch (error) {
          console.error("Error checking painting status:", error);
        }
      }
    };
    checkStatus();
  }, [painting, user]);

  const handleSave = async () => {
    if (!user || loading) return;

    try {
      setLoading(true);
      if (saved) {
        await paintingService.unsavePainting(painting.id);
        setSaved(false);
      } else {
        await paintingService.savePainting(painting.id);
        setSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!painting) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
          backgroundImage: "none",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.9)",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.8)"
                  : "rgba(255,255,255,1)",
            },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ position: "relative" }}>
          <img
            src={painting.image}
            alt={painting.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleSave}
              disabled={loading}
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.6)"
                    : "rgba(255,255,255,0.9)",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(0,0,0,0.8)"
                      : "rgba(255,255,255,1)",
                },
              }}
            >
              {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            <Box
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.6)"
                    : "rgba(255,255,255,0.9)",
                borderRadius: "50%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LikeButton paintingId={painting.id} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            {painting.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {painting.description}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PaintingDialog;
