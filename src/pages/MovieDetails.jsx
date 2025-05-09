"use client"
// import relevant libraries and components
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

// MovieDetails component
const MovieDetails = () => {
    // useMovies hook to get movie data and functions
    const { id } = useParams()
    const { fetchMovieDetails, addToFavorites, removeFromFavorites, isFavorite } = useMovies()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const favorite = movie ? isFavorite(movie.id) : false
    const theme = useTheme()
    // eslint-disable-next-line
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    // Fetch movie details when the component mounts
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
        // eslint-disable-next-line
    }, [])

    // Handle favorite button click
    const handleFavoriteClick = () => {
        // Check if the movie is already a favorite
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

    // Format currency function
    const formatCurrency = (value) => {
        // Check if the value is null or undefined
        if (!value) return "N/A"
        // Check if the value is a number
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value)
    }

    // Get trailer key function
    const getTrailerKey = () => {
        // Check if the movie object and its videos property exist
        if (!movie || !movie.videos || !movie.videos.results) return null

        // Find the trailer video from the movie's videos
        const trailer = movie.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube")

        // Check if a trailer was found
        return trailer ? trailer.key : null
    }

    // Conditional rendering based on loading, error, and movie state
    if (loading) {
        return (
            <Box className="details-loading">
                <CircularProgress />
            </Box>
        )
    }

    // If there's an error, show an error message
    if (error) {
        return (
            <Container maxWidth="lg" className="details-container">
                <Alert severity="error">{error}</Alert>
            </Container>
        )
    }

    // If movie is not found, show a message
    if (!movie) {
        return (
            <Container maxWidth="lg" className="details-container">
                <Alert severity="info">Movie not found.</Alert>
            </Container>
        )
    }

    // Render the movie details
    const trailerKey = getTrailerKey()

    return (
        <Container maxWidth="lg" className="details-container">
            {/* Main paper wrapper with elevation for card-like appearance */}
            <Paper elevation={3} className="details-paper">
                <Grid container spacing={4}>
                    {/* Movie Poster Section */}
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
                            {/* Button to add/remove movie from favorites */}
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

                    {/* Movie Details Section */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" component="h1" className="movie-title-large">
                            {movie.title}
                            {movie.release_date && (
                                <Typography variant="h6" component="span" color="text.secondary" className="movie-year">
                                    ({new Date(movie.release_date).getFullYear()})
                                </Typography>
                            )}
                        </Typography>

                        {/* Rating and vote info */}
                        <Box className="rating-container-large">
                            <Rating value={movie.vote_average / 2} precision={0.5} readOnly />
                            <Typography variant="body1" className="rating-value">
                                {movie.vote_average.toFixed(1)}/10
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className="vote-count">
                                ({movie.vote_count} votes)
                            </Typography>
                        </Box>

                        {/* Genre chips */}
                        <Box className="genres-container">
                            {movie.genres &&
                                movie.genres.map((genre) => (
                                    <Chip key={genre.id} label={genre.name} size="small" className="genre-chip" />
                                ))}
                        </Box>

                        {/* Movie overview */}
                        <Box className="overview-container">
                            <Typography variant="body1" paragraph>
                                {movie.overview}
                            </Typography>
                        </Box>

                        {/* Additional metadata: runtime, release date, language, budget */}
                        <Grid container spacing={2} className="movie-meta">
                            <Grid item xs={6} sm={3}>
                                <Box className="meta-item">
                                    <AccessTime fontSize="small" className="meta-icon" />
                                    <Typography variant="body2">{movie.runtime ? `${movie.runtime} min` : "N/A"}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box className="meta-item">
                                    <CalendarToday fontSize="small" className="meta-icon" />
                                    <Typography variant="body2">
                                        {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "N/A"}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box className="meta-item">
                                    <Language fontSize="small" className="meta-icon" />
                                    <Typography variant="body2">
                                        {movie.original_language ? movie.original_language.toUpperCase() : "N/A"}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box className="meta-item">
                                    <AttachMoney fontSize="small" className="meta-icon" />
                                    <Typography variant="body2">{formatCurrency(movie.budget)}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Divider for visual separation */}
                        <Divider className="details-divider" />

                        {/* Cast Section */}
                        <Typography variant="h6" className="section-title">
                            Top Cast
                        </Typography>
                        <List className="cast-list">
                            {movie.credits && movie.credits.cast ? (
                                movie.credits.cast.slice(0, 6).map((person) => (
                                    <ListItem key={person.id} className="cast-item">
                                        <ListItemAvatar>
                                            <Avatar
                                                src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : null}
                                                alt={person.name}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={person.name}
                                            secondary={person.character}
                                            primaryTypographyProps={{ noWrap: true }}
                                            secondaryTypographyProps={{ noWrap: true }}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2">No cast information available</Typography>
                            )}
                        </List>
                    </Grid>
                </Grid>

                {/* Trailer Section if available */}
                {trailerKey && (
                    <Box className="trailer-section">
                        <Typography variant="h6" className="section-title">
                            Trailer
                        </Typography>
                        <Box className="trailer-container">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${trailerKey}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="trailer-iframe"
                            ></iframe>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    )
}

export default MovieDetails
