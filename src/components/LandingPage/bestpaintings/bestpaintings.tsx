import React, { useState, useEffect } from 'react';
import PostCard from './card';
import { Box, Container, Typography, CircularProgress, useTheme, IconButton, useMediaQuery } from '@mui/material';
import axios from '../../../api/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

interface Painting {
    painting_id: string;
    title: string;
    description: string;
    image: string | null;
    creation_date: string;
    price: number;
}

interface ApiResponse {
    paintings: Painting[];
    pagination: {
        totalPages: number;
    };
}

const StyledSwiper = styled(Swiper)`
    padding: 32px 16px;
    margin: -32px -16px;

    .swiper-slide {
        height: auto;
        border-radius: 30px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: scale(0.8) rotate(-8deg) translateY(10%);
        opacity: 0.3;
        filter: blur(2px);
        
        &.swiper-slide-active {
            transform: scale(1.02) rotate(0deg) translateY(0);
            opacity: 1;
            z-index: 2;
            filter: blur(0);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        &.swiper-slide-prev {
            transform: scale(0.85) rotate(-15deg) translateX(5%) translateY(5%);
            opacity: 0.6;
            filter: blur(1px);
        }
        
        &.swiper-slide-next {
            transform: scale(0.85) rotate(15deg) translateX(-5%) translateY(5%);
            opacity: 0.6;
            filter: blur(1px);
        }
    }

    .swiper-pagination {
        position: relative;
        margin-top: 30px;
    }

    .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        background: ${({ theme }) => theme.palette.primary.main};
        opacity: 0.3;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 4px;

        &-active {
            opacity: 1;
            width: 30px;
            background: linear-gradient(45deg, 
                ${({ theme }) => theme.palette.primary.main}, 
                ${({ theme }) => theme.palette.secondary.main}
            );
        }
    }

    .swiper-button-prev,
    .swiper-button-next {
        color: transparent;
        width: 50px;
        height: 50px;
        background: ${({ theme }) => theme.palette.background.paper};
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        
        &:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        &::after {
            font-size: 18px;
            color: ${({ theme }) => theme.palette.text.primary};
        }

        &.swiper-button-disabled {
            opacity: 0.5;
        }
    }
`;

const StyledBox = styled(Box)`
    .MuiCard-root {
        border-radius: 30px;
        overflow: hidden;
        backdrop-filter: blur(10px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

const ScrollIndicator = styled(motion.div)`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`;

const BestPaintings: React.FC = () => {
    const [posts, setPosts] = useState<Painting[]>([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const getImageUrl = (imagePath: string | null): string => {
        if (!imagePath) return ''; // Return empty string or a default image URL
        return imagePath.startsWith('http') ? imagePath : `${axios.defaults.baseURL}${imagePath}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/painting/paintings/sorted-by-likes/', {
                params: { page: 1, limit: 10 }, // Increased limit for smooth sliding
            });

            const paintingsWithImages = response.data.paintings.map((painting: Painting) => ({
                ...painting,
                image: getImageUrl(painting.image),
            }));

            setPosts(paintingsWithImages);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShare = (id: string) => {
        console.log('Share painting:', id);
    };

    const scrollToNext = () => {
        const nextSection = document.getElementById('next-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut'
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                delay: 0.2
            }
        }
    };

    return (
        <Box
            id="best-paintings-section"
            component="section"
            sx={{
                position: 'relative',
                py: 10,
                backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.9)'
                    : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
            }}
        >
            <Container maxWidth="lg">
                <motion.div variants={titleVariants}>
                    <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{
                            mb: 6,
                            fontWeight: 800,
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)'
                                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: theme.palette.mode === 'dark'
                                ? '0 0 20px rgba(255, 255, 255, 0.1)'
                                : '0 0 20px rgba(33, 150, 243, 0.1)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Featured Artworks
                    </Typography>
                </motion.div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '400px'
                                }}
                            >
                                <CircularProgress 
                                    size={40}
                                    sx={{
                                        color: theme.palette.primary.main,
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round',
                                        }
                                    }}
                                />
                            </Box>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <StyledBox>
                                <StyledSwiper
                                    effect="coverflow"
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView={isMobile ? 1 : "auto"}
                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 200,
                                        modifier: 2.5,
                                    }}
                                    pagination={{ 
                                        clickable: true,
                                        dynamicBullets: true,
                                    }}
                                    navigation={true}
                                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true,
                                    }}
                                    speed={800}
                                    loop={posts.length > 3}
                                    style={{ 
                                        width: '100%',
                                        paddingBottom: '50px'
                                    }}
                                >
                                    {posts.map((post) => (
                                        <SwiperSlide
                                            key={post.painting_id}
                                            style={{ 
                                                width: isMobile ? '100%' : '300px',
                                                height: '400px',
                                            }}
                                        >
                                            <PostCard post={post} onShare={handleShare} />
                                        </SwiperSlide>
                                    ))}
                                </StyledSwiper>
                            </StyledBox>
                        </motion.div>
                    )}
                </AnimatePresence>

                <ScrollIndicator
                    animate={{ y: [0, 10, 0] }}
                    transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    onClick={scrollToNext}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 1,
                            opacity: 0.8,
                        }}
                    >
                        Scroll for more
                    </Typography>
                    <IconButton
                        size="small"
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                                backgroundColor: theme.palette.background.paper,
                            }
                        }}
                    >
                        <KeyboardDoubleArrowDownIcon />
                    </IconButton>
                </ScrollIndicator>
            </Container>
        </Box>
    );
};

export default BestPaintings;
