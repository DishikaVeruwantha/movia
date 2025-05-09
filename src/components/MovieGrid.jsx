"use client"
// importing relevant libraries and components
import { Grid, Box, Typography, CircularProgress, Button } from "@mui/material"
import MovieCard from "./MovieCard"
import "./MovieGrid.css"

// MovieGrid component
const MovieGrid = ({
                       movies,
                       loading,
                       error,
                       title,
                       emptyMessage = "No movies found",
                       onLoadMore = null,
                       hasMore = false,
                   }) => {
    // check if the movies array is empty and loading is true
    if (loading && movies.length === 0) {
        return (
            <Box className="loading-container">
                <CircularProgress />
            </Box>
        )
    }

    // check if there is an error
    if (error) {
        return (
            <Box className="error-container">
                <Typography color="error">{error}</Typography>
            </Box>
        )
    }

    // check if the movies array is empty
    if (movies.length === 0) {
        return (
            <Box className="empty-container">
                <Typography>{emptyMessage}</Typography>
            </Box>
        )
    }

    return (
        <Box className="movie-grid-container">
            {/* Optional title for the grid */}
            {title && (
                <Typography variant="h4" component="h2" className="grid-title">
                    {title}
                </Typography>
            )}
            {/* Responsive grid layout for movie cards */}
            <Grid container spacing={3} justifyContent="center" className="movie-grid">
                {movies.map((movie) => (
                    <Grid item key={movie.id} xs={6} sm={4} md={3} lg={3}>
                        <MovieCard movie={movie} />
                    </Grid>
                ))}
            </Grid>

            {/* Loading spinner for "Load More" or infinite scroll behavior */}
            {loading && (
                <Box className="loading-more-container">
                    <CircularProgress />
                </Box>
            )}

            {/* Optional "Load More" button if more movies are available */}
            {onLoadMore && hasMore && (
                <Box className="load-more-container">
                    <Button variant="contained" onClick={onLoadMore} disabled={loading} className="load-more-button">
                        Load More
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default MovieGrid
