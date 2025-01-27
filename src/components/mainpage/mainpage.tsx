import React, { useState } from "react";
import Title from "./title/title";
import Mygif1 from "./Animation/Animation";
import Paitings from "./paintings/Paintings";
import Painter from "./painters/painters";
import Navbar from "../Navbar";
import { Box } from "@mui/material";
import SideBar from "../UserPanel/SideBar";
import { useAuth } from "../../context/AuthContext";

const MainPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile } = useAuth();

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar onSidebarToggle={handleSidebarToggle} />
      {userProfile && (
        <SideBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userData={userProfile}
          onProfileUpdate={() => {}}
        />
      )}
      <Box sx={{ paddingTop: "64px" }}>
        {" "}
        {/* Add padding to account for fixed navbar */}
        <Title />
        <Painter />
        <Mygif1 />
        <Paitings />
      </Box>
    </Box>
  );
};

export default MainPage;
