import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  console.log("HomePage - isAuthenticated:", isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("HomePage - token:", token);
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        <Box sx={{ textAlign: "center" }}>Welcome to Home Page</Box>
      </Container>
    </Box>
  );
};

export default HomePage;
