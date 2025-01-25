import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Images
import bgImage from "./pic5.jpg";

function Title() {
  return (
    <Box component="header" position="relative">
      <Box component="nav" position="absolute" top="0" width="100%"> {/* Set top to 0 */}
        <Container maxWidth={false} sx={{ padding: 0 }}> {/* Remove maxWidth and padding */}
          <Grid container flexDirection="row" alignItems="center">
            <Box
              component="ul"
              display={{ xs: "none", lg: "flex" }}
              p={0}
              my={0}
              mx="auto"
              sx={{ listStyle: "none" }}
            ></Box>
            <Box
              component="ul"
              display={{ xs: "none", lg: "flex" }}
              p={0}
              m={0}
              sx={{ listStyle: "none" }}
            >
              <Box component="li">
                <Typography
                  component={Link}
                  href="#"
                  variant="button"
                  p={1}
                  onClick={(e) => e.preventDefault()}
                  sx={{ textDecoration: "none" }} // Remove underline from links
                >
                  <Box component="i" color="white" className="fab fa-twitter" />
                </Typography>
              </Box>
              <Box component="li">
                <Typography
                  component={Link}
                  href="#"
                  variant="button"
                  p={1}
                  onClick={(e) => e.preventDefault()}
                  sx={{ textDecoration: "none" }} // Remove underline from links
                >
                  <Box component="i" color="white" className="fab fa-facebook" />
                </Typography>
              </Box>
              <Box component="li">
                <Typography
                  component={Link}
                  href="#"
                  variant="button"
                  p={1}
                  onClick={(e) => e.preventDefault()}
                  sx={{ textDecoration: "none" }} // Remove underline from links
                >
                  <Box component="i" color="white" className="fab fa-instagram" />
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`, // Gradient and image
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%", // Set width to 150% of the parent container
          position: "relative", // Ensure proper positioning
          top: 0, // Ensure there's no space at the top
        }}
      >
        <Container maxWidth={false} sx={{ padding: 0 }}> {/* Remove maxWidth and padding */}
          <Grid
            container
            item
            xs={12} // Full width on all screen sizes
            flexDirection="column"
            justifyContent="center"
            sx={{
              maxWidth: "100%", // Ensure the Grid takes full width
              padding: { xs: 2, md: 4, lg: 6 }, // Add padding for better spacing
              textAlign: "center", // Center text inside
            }}
          >
            <Typography
              variant="h1"
              color="white"
              mb={3}
              sx={{
                fontSize: { xs: "2rem", md: "3rem", lg: "4rem" }, // Responsive font sizes
              }}
            >
              Art Shop
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{
                opacity: 0.8,
                fontSize: { xs: "1rem", md: "1.25rem", lg: "1.5rem" }, // Responsive font sizes
              }}
            >
              Welcome to our Art Shop, where creativity meets passion. Explore a world of unique
              artworks crafted by talented artists from around the globe.
            </Typography>
            <Stack direction="row" spacing={2} mt={4} justifyContent="center"> {/* Center buttons */}
            
            </Stack>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Title;
