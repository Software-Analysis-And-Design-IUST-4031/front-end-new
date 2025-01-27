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
import Navbar from "../Navbar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { userService } from "../../services/userService";
import SideBar from "../UserPanel/SideBar";
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

const GalleriesPage: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<GalleryInterface[]>([]);
  const [currentData, setCurrentData] = useState<GalleryInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentData);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const navigate = useNavigate();
  const { isAuthenticated, userProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleClickGallery = (user_id: number) => {
    userService.getUserProfileGallery(user_id);
    // navigate(`/profile/${user_id}`);
  };

  const truncateString = (str: string): string =>
    str.length > 40 ? str.slice(0, 40) + "..." : str;

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
          "https://zaferuni.liara.run/api/galleries"
        );
        const baseURL = "https://zaferuni.liara.run/";
        response.data = response.data.map((gallery: GalleryInterface) => ({
          ...gallery,
          cover_image: gallery.cover_image
            ? `${baseURL}${gallery.cover_image}`
            : null,
          gallery_name: gallery.gallery_name || "Untitled Gallery",
          description: gallery.description || "No description available",
          onclick_gallery: handleClickGallery(gallery.owner_id),
        }));
        setData(response.data);
        setError(false);
      } catch (err) {
        setError(true);
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
  }, [currentPage, data]);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Navbar onSidebarToggle={handleSidebarToggle} />
      {userProfile && (
        <SideBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userProfile}
          onProfileUpdate={() => {}}
        />
      )}

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
          {/* <Typography
            variant="h6"
            sx={{
            //   color: theme.palette.text.secondary,
              maxWidth: '800px',
              margin: '0 auto',
              fontWeight: 400,
            //   animation: 'fadeIn 0.8s ease-out 0.2s forwards',
            }}
          >
            Explore our curated collection of exceptional artworks from talented artists around the world.
          </Typography> */}
        </Box>

        {error ? (
          <Grid container justifyContent="center">
            <Typography variant="h4">Cannot display galleries</Typography>
          </Grid>
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default GalleriesPage;
