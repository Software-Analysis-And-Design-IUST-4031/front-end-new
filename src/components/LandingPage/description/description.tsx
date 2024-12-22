import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';

const DescriptionSection: React.FC = () => {
    const theme = useTheme();

    return (
        <Box
            component="section"
            sx={{
                py: 8,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
                mt: 6,
                mb: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: '800px',
                        mx: 'auto',
                        px: 3,
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 4,
                            background: theme.palette.mode === 'dark'
                                ? 'linear-gradient(45deg, #fff 30%, #e0e0e0 90%)'
                                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Welcome to Zaferuni
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#424242',
                            lineHeight: 1.8,
                            fontWeight: 400,
                        }}
                    >
                        With the expansion of digital technologies and the growing importance of online platforms
                        for buying and selling products, the idea of designing an online store for artworks was developed.
                        In this project, users can showcase their paintings and artworks for sale or search for artworks to purchase.
                        Each artwork on the site is accompanied by a dedicated description that explains its style and features.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default DescriptionSection;
