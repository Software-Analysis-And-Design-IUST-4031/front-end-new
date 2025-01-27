import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Dialog, DialogContent, Box, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { PaintingGridProps } from "./PaintingGrid.types";
import { paintingService } from "../../services/paintingService";

const PaintingGrid: React.FC<PaintingGridProps> = ({ paintings, onLike }) => {
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(
    null
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const theme = useTheme();

  useEffect(() => {
    if (selectedPainting) {
      checkSavedStatus(selectedPainting.id);
    }
  }, [selectedPainting]);

  const checkSavedStatus = async (paintingId: number) => {
    try {
      const saved = await paintingService.checkIfPaintingSaved(paintingId);
      setIsSaved(saved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSave = async (paintingId: number) => {
    try {
      if (isSaved) {
        await paintingService.unsavePainting(paintingId);
      } else {
        await paintingService.savePainting(paintingId);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  };

  return (
    <>
      {/* ... existing grid code ... */}

      <Dialog
        open={!!selectedPainting}
        onClose={() => setSelectedPainting(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, bgcolor: "background.paper" }}>
          {selectedPainting && (
            <Box sx={{ position: "relative" }}>
              {/* ... existing image and content ... */}

              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  display: "flex",
                  gap: 1,
                  zIndex: 1,
                }}
              >
                <IconButton
                  onClick={() =>
                    selectedPainting && handleSave(selectedPainting.id)
                  }
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.9)",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(255,255,255,1)",
                    },
                  }}
                >
                  {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>

                <IconButton
                  onClick={() =>
                    selectedPainting && onLike(selectedPainting.id)
                  }
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.9)",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(255,255,255,1)",
                    },
                  }}
                >
                  <FavoriteIcon
                    color={selectedPainting.is_liked ? "error" : "inherit"}
                  />
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaintingGrid;
