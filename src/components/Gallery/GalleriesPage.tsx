// import React, { memo, Suspense, lazy, useEffect, useState } from "react";
// import {
//   Box,
//   Grid,
//   Container,
//   Typography,
//   useTheme,
//   CircularProgress,
//   Pagination,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar";
// import { useAuth } from "../../context/AuthContext";
// import axios from "axios";

// const Gallery = lazy(() => import("./gallery"));

// interface Artist {
//   id: number;
//   username: string;
// }

// interface PaintingData {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   artist: {
//     id: number;
//     username: string;
//   };
// }

// interface PaintingResponse {
//   paintings: PaintingData[];
//   pagination: {
//     page: number;
//     limit: number;
//     totalPages: number;
//     totalPaintings: number;
//   };
// }

// interface GalleryInterface {
//   cover_image: string;
//   description: string;
//   gallery_name: string;
//   number_of_paintings: number;
//   number_of_artists: number;
//   owner_id: number;
//   onClick?: () => void;
// }

// const LoadingFallback = () => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "100vh",
//       width: "100%",
//       position: "fixed",
//       top: 0,
//       left: 0,
//       background: "rgba(0,0,0,0.1)",
//       backdropFilter: "blur(8px)",
//       zIndex: 1200,
//     }}
//   >
//     <CircularProgress />
//   </Box>
// );

// const GalleriesPage: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [data, setData] = useState<GalleryInterface[]>([]);
//   const [currentData, setCurrentData] = useState<GalleryInterface[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 3;
//   const totalPages = Math.ceil(data.length / itemsPerPage);
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   // Handle page change
//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     page: number
//   ) => {
//     setCurrentPage(page);
//   };

//   const truncateString = (str: string): string =>
//     str.length > 40 ? str.slice(0, 40) + "..." : str;

//   // Authentication check
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login", { replace: true });
//     }
//   }, [navigate]);

//   // Fetch paintings and group them into galleries
//   useEffect(() => {
//     const fetchGalleries = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get<PaintingResponse>(
//           "https://zaferuni.liara.run/api/painting/paintings/sorted-by-likes/"
//         );
//         const data = response.data as PaintingResponse;

//         if (!data || !data.paintings) {
//           throw new Error("Invalid data format from server");
//         }

//         // Transform the paintings data into gallery format
//         const paintingsData = data.paintings;
//         const galleryMap = new Map<number, GalleryInterface>();

//         paintingsData.forEach((painting: PaintingData) => {
//           if (!painting.artist || typeof painting.artist.id === "undefined") {
//             return; // Skip invalid paintings
//           }

//           const artistId = painting.artist.id;
//           if (!galleryMap.has(artistId)) {
//             galleryMap.set(artistId, {
//               owner_id: artistId,
//               gallery_name: `${painting.artist.username}'s Gallery`,
//               description: `Collection of artworks by ${painting.artist.username}`,
//               cover_image: painting.image.startsWith("http")
//                 ? painting.image
//                 : `https://zaferuni.liara.run${painting.image}`,
//               number_of_paintings: 1,
//               number_of_artists: 1,
//             });
//           } else {
//             const gallery = galleryMap.get(artistId)!;
//             gallery.number_of_paintings++;
//           }
//         });

//         setData(Array.from(galleryMap.values()));
//         setError(false);
//       } catch (err) {
//         console.error("Error fetching galleries:", err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGalleries();
//   }, []);

//   // Paginate data
//   useEffect(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
//     setCurrentData(paginatedData);
//   }, [currentPage, data, itemsPerPage]);

//   const handleGalleryClick = (ownerId: number) => {
//     navigate(`/profile/${ownerId}`);
//   };

//   if (loading) return <LoadingFallback />;

//   return (
//     <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
//       <Navbar />
//       <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           align="center"
//           sx={{ mb: 4 }}
//         >
//           Art Galleries
//         </Typography>

//         {error ? (
//           <Typography color="error" align="center">
//             Error loading galleries. Please try again later.
//           </Typography>
//         ) : (
//           <>
//             <Grid container spacing={4} justifyContent="center">
//               {currentData.map((gallery, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={index}>
//                   <Suspense fallback={<LoadingFallback />}>
//                     <Gallery
//                       cover_image={gallery.cover_image}
//                       description={truncateString(gallery.description)}
//                       gallery_name={gallery.gallery_name}
//                       number_of_paintings={gallery.number_of_paintings}
//                       number_of_artists={gallery.number_of_artists}
//                       owner_id={gallery.owner_id}
//                       index={index}
//                       onclick_gallery={() =>
//                         handleGalleryClick(gallery.owner_id)
//                       }
//                     />
//                   </Suspense>
//                 </Grid>
//               ))}
//             </Grid>

//             {data.length > itemsPerPage && (
//               <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//                 <Pagination
//                   count={totalPages}
//                   page={currentPage}
//                   onChange={handlePageChange}
//                   color="primary"
//                   size="large"
//                 />
//               </Box>
//             )}
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default GalleriesPage;
import React, { memo, Suspense, lazy, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  useTheme,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
// import '../Themes.css';

const Gallery = lazy(() => import("./gallery"));

interface GalleryInterface {
  cover_image: string;
  description: string;
  gallery_name: string;
  number_of_paintings: number;
  number_of_artists: number;
  owner_id: number;
  onClick?: () => void;
}

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      background: "rgba(0,0,0,0.1)",
      backdropFilter: "blur(8px)",
      zIndex: 1200,
    }}
  >
    <CircularProgress />
  </Box>
);

const GalleriesPage: any = () => {
  //   const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<GalleryInterface[]>([]);
  const [currentData, setCurrentData] = useState<GalleryInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const truncateString = (str: string): string =>
    str.length > 40 ? str.slice(0, 40) + "..." : str;

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Fetch galleries
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response: any = await axios.get(
          "https://zaferuni.liara.run/api/galleries"
        );
        const baseURL = "https://zaferuni.liara.run/";
        response.data = response.data.map((gallery: GalleryInterface) => ({
          ...gallery,
          cover_image: `${baseURL}${gallery.cover_image}`,
        }));
        setData(response.data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Paginate data
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
    setCurrentData(paginatedData);
  }, [data, currentPage]);

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

      <Container maxWidth="xl" sx={{ pt: 8, pb: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6, p: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 2,
              //   color: theme.palette.text.primary,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              //   animation: 'fadeIn 0.8s ease-out forwards',
            }}
          >
            Art Galleries
          </Typography>
          {/* <Typography
            variant="h6"
            sx={{
            //   color: theme.palette.text.secondary,
              maxWidth: '800px',
              margin: '0 auto',
              fontWeight: 400,
            //   animation: 'fadeIn 0.8s ease-out 0.2s forwards',
            }}
          >
            Explore our curated collection of exceptional artworks from talented artists around the world.
          </Typography> */}
        </Box>

        {error ? (
          <Grid container justifyContent="center">
            <Typography variant="h4">Cannot display galleries</Typography>
          </Grid>
        ) : (
          <>
            <Grid container spacing={4} justifyContent="center">
              <Suspense fallback={<LoadingFallback />}>
                {currentData.map((gallery, index) => (
                  <Grid item key={index}>
                    <Gallery
                      {...gallery}
                      description={truncateString(gallery.description)}
                      index={index}
                      onclick_gallery={() =>
                        navigate(`/profile/${gallery.owner_id}`)
                      }
                    />
                  </Grid>
                ))}
              </Suspense>
            </Grid>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
            >
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
      </Container>
    </Box>
  );
};

export default GalleriesPage;
