import React from 'react';
import { Box, Container, Typography, IconButton, useTheme, Link } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                py: 4,
                backgroundColor: isDark ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <EmailIcon />
                        <Typography>
                            <Link href="mailto:info@zaferuni.com" color="inherit" underline="hover">
                                info@zaferuni.com
                            </Link>
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <LanguageIcon />
                        <Typography>
                            <Link href="https://zaferuni.liara.run/" target="_blank" color="inherit" underline="hover">
                                zaferuni.liara.run
                            </Link>
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <InstagramIcon />
                        <Typography>
                            <Link href="https://instagram.com/zaferuni" target="_blank" color="inherit" underline="hover">
                                @zaferuni
                            </Link>
                        </Typography>
                    </Box>
                </Box>

                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                        mt: 2,
                        opacity: 0.7,
                    }}
                >
                    {new Date().getFullYear()} Zaferuni. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
