import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useAuth } from "../../context/AuthContext";
import paintingService from "../../services/paintingService";
import PaintingDialog from "./PaintingDialog";

interface PaintingCardProps {
  painting: any;
  onAction?: (action: string, paintingId: string) => void;
}

const PaintingCard: React.FC<PaintingCardProps> = ({ painting, onAction }) => {
  const [liked, setLiked] = useState(painting.is_liked || false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (painting && user) {
        try {
          const isSaved = await paintingService.checkIfPaintingSaved(
            painting.id
          );
          setSaved(isSaved);
        } catch (error) {
          console.error("Error checking saved status:", error);
        }
      }
    };
    checkSavedStatus();
  }, [painting, user]);

  const handleSave = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dialog from opening
    if (!user) {
      setError("Please log in to save paintings");
      return;
    }

    try {
      setLoading(true);
      if (saved) {
        await paintingService.unsavePainting(painting.id);
        setSaved(false);
      } else {
        await paintingService.savePainting(painting.id);
        setSaved(true);
      }
      if (onAction) {
        onAction("save", painting.id);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      setError("Failed to save/unsave painting");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dialog from opening
    if (onAction) {
      onAction("like", painting.id);
      setLiked(!liked);
    }
  };

  return (
    <>
      <Card
        onClick={() => setDialogOpen(true)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: theme.palette.mode === "dark" ? "#1A1A1A" : "#FFFFFF",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 6px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 6px 12px rgba(0, 0, 0, 0.3)"
                : "0 6px 12px rgba(0, 0, 0, 0.15)",
          },
          cursor: "pointer",
        }}
      >
        <CardMedia
          component="img"
          image={painting.image}
          alt={painting.title}
          sx={{
            height: 0,
            paddingTop: "100%",
            position: "relative",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
            zIndex: 2,
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
          <IconButton
            onClick={handleLike}
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
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {painting.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {painting.description}
          </Typography>
        </CardContent>
      </Card>

      <PaintingDialog
        painting={painting}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PaintingCard;
