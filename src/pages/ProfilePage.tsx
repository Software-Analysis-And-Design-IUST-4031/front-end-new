import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import { BackendPainting, UserProfile } from "../types";

const ProfilePage: React.FC = () => {
  const { userId: profileId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userProfile, userId: authUserId } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [paintings, setPaintings] = useState<BackendPainting[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if viewing own profile
  const isOwnProfile = Number(profileId) === authUserId;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;

      setIsLoadingData(true);
      setError(null);

      try {
        // If viewing own profile, use existing userProfile data
        if (isOwnProfile && userProfile) {
          setProfileData(userProfile);
        } else {
          // Fetch the profile data for other users
          const fetchedProfile = await userService.getUserProfile(Number(profileId));
          setProfileData(fetchedProfile);
        }

        // Fetch paintings for the profile
        const paintingsData = await userService.getUserPaintings(profileId);
        setPaintings(paintingsData.paintings);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProfileData();
  }, [profileId, isOwnProfile, userProfile]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || isLoadingData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
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
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {profileData && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1">
                {isOwnProfile ? 
                  `Welcome, ${profileData.firstname || profileData.username}!` : 
                  `${profileData.firstname || profileData.username}'s Profile`}
              </Typography>
              
              {isOwnProfile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {/* Add your edit profile handler */}}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Box>
              <Typography variant="body1" gutterBottom>
                Username: {profileData.username}
              </Typography>
              {/* Only show email if it's own profile */}
              {isOwnProfile && (
                <Typography variant="body1" gutterBottom>
                  Email: {profileData.email}
                </Typography>
              )}
              {profileData.biography && (
                <Typography variant="body1" gutterBottom>
                  Biography: {profileData.biography}
                </Typography>
              )}

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                {isOwnProfile ? 'Your Paintings' : 'Paintings'} ({paintings.length})
              </Typography>
              
              {/* Paintings display remains the same */}
              {paintings.length > 0 ? (
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 2,
                }}>
                  {paintings.map((painting) => (
                    <Box
                      key={painting.painting_id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1">
                        {painting.title}
                      </Typography>
                      <Typography variant="body2">
                        {painting.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No paintings yet</Typography>
              )}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProfilePage;
