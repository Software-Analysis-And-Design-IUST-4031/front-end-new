import React, { useState, useEffect } from "react";
import PostCard from "./cardpainters";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  useTheme,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import axios from "../../../api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Painter {
  user_id: string;
  username: string;
  profile_picture: string;
  total_likes: number;
}

interface ApiResponse {
  users: Painter[];
  pagination: {
    totalPages: number;
  };
}

const StyledSwiper = styled(Swiper)`
  padding: 50px 0;

  .swiper-slide {
    width: auto;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.5;
    transform: scale(0.85);

    &.swiper-slide-active {
      opacity: 1;
      transform: scale(1);
      z-index: 2;
    }

    &.swiper-slide-prev,
    &.swiper-slide-next {
      opacity: 0.7;
      transform: scale(0.9);
    }
  }

  .swiper-pagination {
    position: relative;
    margin-top: 20px;
  }

  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.palette.primary.main};
    opacity: 0.5;
    transition: all 0.3s ease;

    &-active {
      opacity: 1;
      width: 20px;
      border-radius: 5px;
    }
  }
`;

const TrophyIcon = styled(motion(EmojiEventsIcon))`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.palette.warning.main};
`;

const ScrollButton = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  cursor: pointer;
  z-index: 2;
`;

const ScrollText = styled(Typography)`
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.875rem;
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, #fff 30%, #e0e0e0 90%)"
      : "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StyledArrowIcon = styled(KeyboardArrowDownIcon)`
  font-size: 36px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const scrollVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const itemsPerPage = 10;

const Painter: React.FC = () => {
  const [posts, setPosts] = useState<Painter[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const fetchPainters = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        "/api/painting/user/top-painters/",
        {
          params: { page: 1, limit: itemsPerPage },
        }
      );

      const paintersWithImages = response.data.users.map((user: Painter) => ({
        ...user,
        profile_picture: user.profile_picture,
      }));

      setPosts(paintersWithImages);
    } catch (err) {
      console.error("Error fetching painters", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPainters();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const trophyVariants = {
    initial: { rotate: -30, scale: 0 },
    animate: {
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const handleScrollClick = () => {
    const bestPaintingsSection = document.getElementById(
      "best-paintings-section"
    );
    if (bestPaintingsSection) {
      bestPaintingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      component={motion.div}
      ref={ref}
      id="next-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      sx={{
        py: 8,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.9)",
        borderRadius: 4,
        mt: 4,
        overflow: "hidden",
        position: "relative",
        backdropFilter: "blur(10px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(255, 255, 255, 0.1)"
            : "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)"
                  : "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Top Painters
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Discover our most talented and popular artists showcasing their
            unique styles and creative visions
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <StyledSwiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              spaceBetween={30}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              modules={[Pagination, Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={posts.length > 3}
            >
              {posts.map((post) => (
                <SwiperSlide key={post.user_id} style={{ width: "auto" }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <PostCard post={post} />
                  </Box>
                </SwiperSlide>
              ))}
            </StyledSwiper>

            <ScrollButton
              onClick={handleScrollClick}
              variants={scrollVariants}
              initial="initial"
              animate="animate"
            >
              <ScrollText>View Featured Artworks</ScrollText>
              <StyledArrowIcon />
            </ScrollButton>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Painter;
