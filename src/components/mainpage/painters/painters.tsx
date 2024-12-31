import React, { useState, useEffect } from "react";
import "./painters.css";
import PostCard from "./cpainter";
import { Box, Pagination, CircularProgress, Alert } from "@mui/material";

interface Post {
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  description: string;
  image: string;
  favorite_painting: string;
  favorite_painting_style: number;
  favorite_painter: string;
  city: string;
  country: string;
}

const itemsPerPage = 4;

const Painter: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://zaferuni.liara.run/api/users/search/"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const mappedPosts = data.results.map((user: any) => ({
          user_id: user.user_id.toString(),
          username: user.username,
          firstname: user.firstname || "null",
          lastname: user.lastname || "null",
          description: user.description || "null",
          image: user.profile_picture || "DEFAULT_IMAGE_URL",
          favorite_painting: user.favorite_painting || "",
          favorite_painting_style: user.favorite_painting_style || 0,
          favorite_painter: user.favorite_painter || "null",
          city: user.city || "null",
          country: user.country || "null",
        }));

        setPosts(mappedPosts);
      } catch (err) {
        console.error("Error fetching painters:", err);
        setError("Failed to load painters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search through all fields: username, firstname, lastname, description, city, country, favorite painting, favorite painter
  const filteredPaintings = posts.filter(
    (post) =>
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.favorite_painting
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      post.favorite_painter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPaintings = filteredPaintings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section className="painter-section">
      {/* Search Bar */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="filter-input"
        />
      </div>

      {/* Painter Cards */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <>
          <div className="painter-grid">
            {filteredPaintings.length > 0 ? (
              <PostCard posts={currentPaintings} />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
              >
                <Alert severity="info">No results found</Alert>
              </Box>
            )}
          </div>

          {/* Pagination */}
          {filteredPaintings.length > 0 && (
            <Box mt={3} display="flex" justifyContent="center">
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
    </section>
  );
};

export default Painter;
