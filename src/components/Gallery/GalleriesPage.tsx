import React, { memo, Suspense, lazy, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  useTheme,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
// import '../Themes.css';

const Gallery = lazy(() => import("./gallery"));

interface GalleryInterface {
  cover_image: string;
  description: string;
  gallery_name: string;
  number_of_paintings: number;
  number_of_artists: number;
  owner_id: number;
  onClick?: () => void;
}

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      background: "rgba(0,0,0,0.1)",
      backdropFilter: "blur(8px)",
      zIndex: 1200,
    }}
  >
    <CircularProgress />
  </Box>
);

const GalleriesPage: any = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<GalleryInterface[]>([]);
  const [currentData, setCurrentData] = useState<GalleryInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const truncateString = (str: string): string => {
    if (!str) return "No description available";
    return str.length > 40 ? str.slice(0, 40) + "..." : str;
  };

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Fetch galleries
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response: any = await axios.get(
          "https://zaferuni.liara.run/api/galleries",
          {
            headers: {
              "Content-Type": "application/json",
              // Remove Authorization header since endpoint is AllowAny
            },
          }
        );

        const baseURL = "https://zaferuni.liara.run/";

        // Check if response.data exists and is an array
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid response format:", response);
          throw new Error("Invalid response format from server");
        }

        // Add null check for cover_image
        const processedData = response.data.map(
          (gallery: GalleryInterface) => ({
            ...gallery,
            cover_image: gallery.cover_image
              ? `${baseURL}${gallery.cover_image}`
              : "https://via.placeholder.com/800x600?text=No+Image",
            description: gallery.description || "No description available",
            gallery_name: gallery.gallery_name || "Untitled Gallery",
          })
        );

        setData(processedData);
        setError(false);
      } catch (err: any) {
        console.error("Error fetching galleries:", err);
        setError(true);
        setData([]); // Reset data on error
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Paginate data
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
    setCurrentData(paginatedData);
  }, [data, currentPage, itemsPerPage]);

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <LoadingFallback />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Navbar />

      <Container maxWidth="xl" sx={{ pt: 8, pb: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6, p: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color:
                theme.palette.mode === "dark"
                  ? "#ffffff"
                  : theme.palette.text.primary,
            }}
          >
            Art Galleries
          </Typography>
        </Box>

        {error ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error loading galleries
            </Typography>
            <Typography color="text.secondary">
              Please try again later or contact support if the problem persists.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={4} justifyContent="center">
              <Suspense fallback={<LoadingFallback />}>
                {currentData.map((gallery, index) => (
                  <Grid item key={index}>
                    <Gallery
                      {...gallery}
                      description={truncateString(gallery.description)}
                      index={index}
                      onclick_gallery={() =>
                        navigate(`/profile/${gallery.owner_id}`)
                      }
                    />
                  </Grid>
                ))}
              </Suspense>
            </Grid>

            {data.length > 0 && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={4}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default GalleriesPage;
