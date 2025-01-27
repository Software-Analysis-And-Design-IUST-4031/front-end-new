import React, { useState, useEffect } from "react";
import "./painters.css";
import { Box, CircularProgress, Alert } from "@mui/material";
import PaintingGrid from "../../UserPanel/PaintingGrid";
import { Painting } from "../../../types";

const Painter: React.FC = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://zaferuni.liara.run/api/users/search/"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        // Transform the API data into the Painting format
        const mappedPaintings = data.results.map((user: any) => ({
          id: user.user_id.toString(),
          imageUrl: user.profile_picture || "DEFAULT_IMAGE_URL",
          title: `${user.firstname} ${user.lastname}`,
          description: user.description || "",
          price: "N/A",
          likes: 0,
          isLiked: false,
          isSaved: false,
          createdAt: new Date().toISOString(),
          style: user.favorite_painting_style || "",
          material: "",
          horizontalDepth: "",
          verticalDepth: "",
          author: {
            id: user.user_id.toString(),
            username: user.username,
            name: `${user.firstname} ${user.lastname}`,
            avatarUrl: user.profile_picture,
            bio: user.description,
            email: user.email,
          },
        }));

        setPaintings(mappedPaintings);
      } catch (err) {
        console.error("Error fetching painters:", err);
        setError("Failed to load painters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = (action: string, paintingId: string) => {
    // Handle actions like like, save, etc.
    console.log(`Action ${action} on painting ${paintingId}`);
  };

  return (
    <section className="painter-section">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <PaintingGrid paintings={paintings} onAction={handleAction} />
        </Box>
      )}
    </section>
  );
};

export default Painter;
