import React, { useState } from "react";
import { Box, Container, IconButton, Typography, Grid, TextField, Button, Link, CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import blackLogo from "../assets/black_on_trans.png";
import loginBg from "../assets/Login.png";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    // Handle signup logic here
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <ArrowBack />
      </IconButton>

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "background.paper",
            borderRadius: 4,
            p: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            margin: "0 auto",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: "120px",
              height: "120px",
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={blackLogo}
              alt="Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Sign Up
          </Typography>

          <Box component="form" sx={{ width: "100%", mt: 1 }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  label="First Name"
                  name="firstname"
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  label="Last Name"
                  name="lastname"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              onClick={handleSignup}
              disabled={loading}
              sx={{
                mt: 1,
                mb: 1,
                py: 1,
                fontSize: "1rem",
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>

            <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
              Already have an account?{" "}
            </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Link>
            
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage; 