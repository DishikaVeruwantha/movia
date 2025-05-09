"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Chip,
    Rating,
    Divider,
    Button,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    useTheme,
    useMediaQuery,
} from "@mui/material"
import { Favorite, FavoriteBorder, AccessTime, CalendarToday, Language, AttachMoney } from "@mui/icons-material"
import { useMovies } from "../contexts/MovieContext"
import "./MovieDetails.css"

const MovieDetails = () => {
    const { id } = useParams()
    const { fetchMovieDetails, addToFavorites, removeFromFavorites, isFavorite } = useMovies()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const favorite = movie ? isFavorite(movie.id) : false
    const theme = useTheme()
    // eslint-disable-next-line
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    useEffect(() => {
        const getMovieDetails = async () => {
            setLoading(true)
            try {
                const details = await fetchMovieDetails(id)
                setMovie(details)
            } catch (err) {
                console.error("Error fetching movie details:", err)
                setError("Failed to load movie details. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        getMovieDetails()
    }, [])

    const handleFavoriteClick = () => {
        if (favorite) {
            removeFromFavorites(movie.id)
        } else {
            addToFavorites({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
            })
        }
    }

    const formatCurrency = (value) => {
        if (!value) return "N/A"
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value)
    }

    const getTrailerKey = () => {
        if (!movie || !movie.videos || !movie.videos.results) return null

        const trailer = movie.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube")

        return trailer ? trailer.key : null
    }

    if (loading) {
        return (
            <Box className="details-loading">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Container maxWidth="lg" className="details-container">
                <Alert severity="error">{error}</Alert>
            </Container>
        )
    }

    if (!movie) {
        return (
            <Container maxWidth="lg" className="details-container">
                <Alert severity="info">Movie not found.</Alert>
            </Container>
        )
    }

    const trailerKey = getTrailerKey()

    return (
        <Container maxWidth="lg" className="details-container">
            <Paper elevation={3} className="details-paper">
                <Grid container spacing={4}>
                    {/* Movie Poster */}
                    <Grid item xs={12} md={4} className="poster-outerContainer">
                        <Box className="poster-container">
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : "https://via.placeholder.com/500x750?text=No+Image"
                                }
                                alt={movie.title}
                                className="movie-poster-large"
                            />
                            <Button
                                variant={favorite ? "contained" : "outlined"}
                                color="primary"
                                startIcon={favorite ? <Favorite /> : <FavoriteBorder />}
                                onClick={handleFavoriteClick}
                                className="favorite-button-large"
                            >
                                {favorite ? "Remove from Favorites" : "Add to Favorites"}
                            </Button>
                        </Box>
                    </Grid>

                    {/* Movie Details */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" component="h1" className="movie-title-large">
                            {movie.title}
                            {movie.release_date && (
                                <Typography variant="h6" component="span" color="text.secondary" className="movie-year">
                                    ({new Date(movie.release_date).getFullYear()})
                                </Typography>
                            )}
                        </Typography>

                        <Box className="rating-container-large">
                            <Rating value={movie.vote_average / 2} precision={0.5} readOnly />
                            <Typography variant="body1" className="rating-value">
                                {movie.vote_average.toFixed(1)}/10
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="vote-count">
                                ({movie.vote_count} votes)
                            </Typography>
                        </Box>

                        <Box className="genres-container">
                            {movie.genres &&
                                movie.genres.map((genre) => (
                                    <Chip key={genre.id} label={genre.name} size="small" className="genre-chip" />
                                ))}
                        </Box>

                        <Box className="overview-container">
                            <Typography variant="body1" paragraph>
                                {movie.overview}
                            </Typography>
                        </Box>






                    </Grid>
                </Grid>


            </Paper>
        </Container>
    )
}

export default MovieDetails
