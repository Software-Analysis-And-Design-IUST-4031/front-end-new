import React, { useState, useEffect } from "react";
import "./paintings.css";
import PostCard from "../../LandingPage/bestpaintings/card";
import { Box, Pagination, CircularProgress } from "@mui/material";

interface Painting {
  painting_id: string;
  title: string;
  description: string;
  image: string | null;
  creation_date: string;
  price: number;
}

const itemsPerPage = 4;

const Paintings: React.FC = () => {
  const [posts, setPosts] = useState<Painting[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data instead of API call for testing
        const mockPaintings: Painting[] = [
          {
            painting_id: "1",
            title: "Abstract Art",
            description: "A beautiful painting.",
            image: "https://via.placeholder.com/150",
            creation_date: "2024-12-01",
            price: 500,
          },
          {
            painting_id: "2",
            title: "Mountain View",
            description: "An amazing landscape.",
            image: "https://via.placeholder.com/150",
            creation_date: "2024-12-01",
            price: 750,
          },
          {
            painting_id: "3",
            title: "Portrait of a Woman",
            description: "A stunning portrait.",
            image: "https://via.placeholder.com/150",
            creation_date: "2024-12-01",
            price: 1000,
          },
          {
            painting_id: "4",
            title: "Color Explosion",
            description: "Vibrant and colorful.",
            image: "https://via.placeholder.com/150",
            creation_date: "2024-12-01",
            price: 400,
          },
        ];
        setPosts(mockPaintings);
      } catch (err) {
        console.error("Error fetching paintings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPaintings = posts.filter((painting) => {
    const searchLower = search.toLowerCase();
    return (
      painting.title.toLowerCase().includes(searchLower) ||
      painting.description.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <section className="paintings-section">
      {/* Search Input */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search "
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to the first page when searching
          }}
          className="filter-input"
        />
      </div>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="paintings-grid">
            {currentPaintings.map((post) => (
              <PostCard
                key={post.painting_id}
                post={post}
                onShare={() => null}
              />
            ))}
          </div>

          <Box mt={3} display="flex" justifyContent="center">
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
    </section>
  );
};

export default Paintings;
