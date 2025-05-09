//import relevant libraries and components
import { Container, Typography, Box, Grid, Button } from "@mui/material"
import { useMovies } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCard"
import { Link } from "react-router-dom"
import "./Favorites.css"

// Favorites component
const Favorites = () => {
    // useMovies hook to get the favorites
    const { favorites } = useMovies()

    return (
        <Container maxWidth="xl" className="favorites-container">
            {/* Page title for the Favorites section */}
            <Typography variant="h4" component="h1" className="favorites-title">
                My Favorite Movies
            </Typography>

            {/* Conditional rendering based on whether there are favorite movies */}
            {favorites.length === 0 ? (
                // If no favorites, show empty state message and a button to navigate back to the main movie page
                <Box className="empty-favorites">
                    <Typography variant="h6" paragraph>
                        You haven't added any movies to your favorites yet.
                    </Typography>
                    <Button component={Link} to="/" variant="contained" color="primary">
                        Browse Movies
                    </Button>
                </Box>
            ) : (
                // If there are favorites, display them in a responsive grid
                <Grid container spacing={3} justifyContent="center" className="favorites-grid">
                    {favorites.map((movie) => (
                        <Grid item key={movie.id} xs={6} sm={4} md={3} lg={3}>
                            {/* Reuse MovieCard component for each favorite movie */}
                            <MovieCard movie={movie} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default Favorites
