import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  styled,
  useTheme,
  Container,
  CircularProgress,
} from "@mui/material";
import { Painting } from "../../types/painting";
import paintingService from "../../services/paintingService";
import PaintingCard from "../Painting/PaintingCard";

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  color:
    theme.palette.mode === "dark"
      ? theme.palette.common.white
      : theme.palette.text.primary,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "200px",
}));

const SavedPaintings: React.FC = () => {
  const [savedPaintings, setSavedPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchSavedPaintings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching saved paintings...");
      const paintings = await paintingService.getSavedPaintings();
      console.log("Received saved paintings:", paintings);
      if (Array.isArray(paintings)) {
        setSavedPaintings(paintings);
      } else {
        console.error("Unexpected response format:", paintings);
        setError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching saved paintings:", error);
      setError(
        error.response?.data?.message || "Failed to load saved paintings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPaintings();
  }, []);

  const handleSaveChange = async (paintingId: number, isSaved: boolean) => {
    try {
      if (!isSaved) {
        console.log("Removing painting from saved list:", paintingId);
        setSavedPaintings((prev) =>
          prev.filter((p) => p.id !== paintingId.toString())
        );
      } else {
        // Refresh the list to get the latest data
        await fetchSavedPaintings();
      }
    } catch (error) {
      console.error("Error handling save change:", error);
      setError("Failed to update saved paintings");
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <EmptyState>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please try again later
        </Typography>
      </EmptyState>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {savedPaintings.length === 0 ? (
        <EmptyState>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color:
                theme.palette.mode === "dark" ? "common.white" : "text.primary",
            }}
          >
            No saved paintings yet
          </Typography>
          <Typography
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.7)"
                  : "text.secondary",
            }}
          >
            Your saved paintings will appear here
          </Typography>
        </EmptyState>
      ) : (
        <Grid container spacing={2}>
          {savedPaintings.map((painting) => (
            <Grid item xs={12} sm={6} md={4} key={painting.id}>
              <PaintingCard painting={painting} onSave={handleSaveChange} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SavedPaintings;
