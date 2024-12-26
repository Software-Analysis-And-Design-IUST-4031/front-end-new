import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import Navbar from "./Header/Header";
import DescriptionSection from "./description/description";
import Footer from "./footer/footer";
import MyLottieAnimation1 from "./animation/Animation1";
import MyLottieAnimation2 from "./animation/Animation2";
import Features from "./features/Features";
import Painter from "./bestpainters/bestpainters";
import BestPaintings from "./bestpaintings/bestpaintings";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {showAnimation ? (
        <MyLottieAnimation1 />
      ) : (
        <>
          <Navbar />
          <DescriptionSection />
          <MyLottieAnimation2 />
          <Painter />
          <Features />
          <BestPaintings />
          <Box sx={{ position: "relative", zIndex: 1, p: 2, mt: 2 }}>
            <img
              src={
                theme.palette.mode === "dark"
                  ? "/assets/white_on_trans.png"
                  : "/assets/black_on_trans.png"
              }
              alt="Logo"
              style={{
                width: "1200px",
                height: "auto",
                marginLeft: "20px",
                filter:
                  theme.palette.mode === "dark"
                    ? "brightness(0) invert(1)"
                    : "none",
                transition: "transform 0.3s ease-in-out",
                objectFit: "contain",
                maxWidth: "90vw",
              }}
            />
          </Box>
          <Box
            component="footer"
            sx={{
              py: 6,
              px: 2,
              mt: "auto",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.87)"
                  : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderTop: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)"
              }`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 -4px 20px rgba(0,0,0,0.4)"
                  : "0 -4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Container maxWidth="lg">
              <Grid container spacing={4} justifyContent="space-between">
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    About Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Discover and share amazing artwork with our growing
                    community of artists and art enthusiasts.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Contact Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: support@artgallery.com
                    <br />
                    Phone: +1 234 567 8900
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <IconButton color="primary">
                      <FacebookIcon />
                    </IconButton>
                    <IconButton color="primary">
                      <TwitterIcon />
                    </IconButton>
                    <IconButton color="primary">
                      <InstagramIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 4 }}
              >
                &copy; {new Date().getFullYear()} Art Gallery. All rights
                reserved.
              </Typography>
            </Container>
          </Box>
        </>
      )}
    </div>
  );
};

export default LandingPage;
