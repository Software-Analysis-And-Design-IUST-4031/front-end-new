import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import BrushIcon from "@mui/icons-material/Brush";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupsIcon from "@mui/icons-material/Groups";
import Paper from "@mui/material/Paper";

const FeatureCard = styled(motion(Paper))`
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 30px;
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "linear-gradient(169deg, rgba(45,45,45,0.6) 0%, rgba(25,25,25,0.8) 100%)"
      : "linear-gradient(169deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.9) 100%)"};
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 30px;
    padding: 1.5px;
    background: linear-gradient(
      45deg,
      ${({ theme }) => alpha(theme.palette.primary.main, 0.3)},
      ${({ theme }) => alpha(theme.palette.secondary.main, 0.3)}
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);

    &::before {
      opacity: 1;
    }
  }
`;

const IconWrapper = styled(Box)`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 24px;
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
      : "linear-gradient(45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))"};
  box-shadow: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)"};

  svg {
    font-size: 40px;
    color: ${({ theme }) => theme.palette.primary.main};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

export default function Features() {
  const theme = useTheme();
  const features = [
    {
      icon: <BrushIcon />,
      title: "Digital Art Creation",
      description:
        "Create stunning digital artworks with our advanced tools and features.",
    },
    {
      icon: <StorefrontIcon />,
      title: "Art Marketplace",
      description:
        "Buy and sell original digital art in a secure and vibrant marketplace.",
    },
    {
      icon: <GroupsIcon />,
      title: "Artist Community",
      description:
        "Connect with fellow artists, share ideas, and grow together.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      component="section"
      sx={{
        py: 10,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.9)"
            : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #fff 30%, #e0e0e0 90%)"
                  : "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Why Choose Us
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(0,0,0,0.6)",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Discover the unique features that make our platform the perfect
            place for digital artists
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <FeatureCard elevation={0}>
                    <IconWrapper>{feature.icon}</IconWrapper>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.6)",
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
