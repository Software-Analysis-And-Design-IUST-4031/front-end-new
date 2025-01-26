import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import bgImage from "./pic5.jpg";

function Title() {
  return (
    <Box component="header" position="relative">
      <Box component="nav" position="absolute" top="0" width="100%">
        <Container maxWidth={false} sx={{ padding: 0 }}>
          <Grid container flexDirection="row" alignItems="center" justifyContent="flex-end">
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
                  sx={{ textDecoration: "none", color: "white", "&:hover": { opacity: 0.8 } }}
                >
                  <Box component="i" className="fab fa-twitter" />
                </Typography>
              </Box>
              <Box component="li">
                <Typography
                  component={Link}
                  href="#"
                  variant="button"
                  p={1}
                  onClick={(e) => e.preventDefault()}
                  sx={{ textDecoration: "none", color: "white", "&:hover": { opacity: 0.8 } }}
                >
                  <Box component="i" className="fab fa-facebook" />
                </Typography>
              </Box>
              <Box component="li">
                <Typography
                  component={Link}
                  href="#"
                  variant="button"
                  p={1}
                  onClick={(e) => e.preventDefault()}
                  sx={{ textDecoration: "none", color: "white", "&:hover": { opacity: 0.8 } }}
                >
                  <Box component="i" className="fab fa-instagram" />
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          position: "relative",
          top: 0,
        }}
      >
        <Container maxWidth={false} sx={{ padding: 0 }}>
          <Grid
            container
            item
            xs={12}
            flexDirection="column"
            justifyContent="center"
            sx={{
              maxWidth: "100%",
              padding: { xs: 2, md: 4, lg: 6 },
              textAlign: "left",
            }}
          >
            <Typography
              variant="h1"
              color="white"
              mb={3}
              sx={{
                fontSize: { xs: "2rem", md: "3rem", lg: "4rem" },
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              zaferuni
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{
                opacity: 1,
                fontSize: { xs: "2rem", md: "1.5rem", lg: "1.5rem" },
                textShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              Welcome to our Art Shop, where creativity meets passion. 
            </Typography>
            <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
            </Stack>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Title;