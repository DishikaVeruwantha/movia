"use client"

import { Grid, Box, Typography, CircularProgress, Button } from "@mui/material"
import MovieCard from "./MovieCard"
import "./MovieGrid.css"

const MovieGrid = ({
                       movies,
                       loading,
                       error,
                       title,
                       emptyMessage = "No movies found",
                       onLoadMore = null,
                       hasMore = false,
                   }) => {
    if (loading && movies.length === 0) {
        return (
            <Box className="loading-container">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box className="error-container">
                <Typography color="error">{error}</Typography>
            </Box>
        )
    }

    if (movies.length === 0) {
        return (
            <Box className="empty-container">
                <Typography>{emptyMessage}</Typography>
            </Box>
        )
    }

    return (
        <Box className="movie-grid-container">
            {title && (
                <Typography variant="h4" component="h2" className="grid-title">
                    {title}
                </Typography>
            )}
            <Grid container spacing={3} className="movie-grid">
                {movies.map((movie) => (
                    <Grid item key={movie.id} xs={6} sm={4} md={3} lg={3}>
                        <MovieCard movie={movie} />
                    </Grid>
                ))}
            </Grid>

            {loading && (
                <Box className="loading-more-container">
                    <CircularProgress />
                </Box>
            )}

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
