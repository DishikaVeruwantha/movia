import { Container, Typography, Box, Grid, Button } from "@mui/material"
import { useMovies } from "../contexts/MovieContext"
import MovieCard from "../components/MovieCard"
import { Link } from "react-router-dom"
import "./Favorites.css"

const Favorites = () => {
    const { favorites } = useMovies()

    return (
        <Container maxWidth="xl" className="favorites-container">
            <Typography variant="h4" component="h1" className="favorites-title">
                My Favorite Movies
            </Typography>

            {favorites.length === 0 ? (
                <Box className="empty-favorites">
                    <Typography variant="h6" paragraph>
                        You haven't added any movies to your favorites yet.
                    </Typography>
                    <Button component={Link} to="/" variant="contained" color="primary">
                        Browse Movies
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3} justifyContent="center" className="favorites-grid">
                    {favorites.map((movie) => (
                        <Grid item key={movie.id} xs={6} sm={4} md={3} lg={3}>
                            <MovieCard movie={movie} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default Favorites
