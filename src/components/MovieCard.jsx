"use client"
// import relevant libraries and components
import { useNavigate } from "react-router-dom"
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, IconButton, Chip, Rating } from "@mui/material"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { useMovies } from "../contexts/MovieContext"
import "./MovieCard.css"

// MovieCard component
const MovieCard = ({ movie, showRating = true }) => {

    // useNavigate hook to navigate between routes
    const navigate = useNavigate()
    // useMovies hook to access movie context
    const { addToFavorites, removeFromFavorites, isFavorite } = useMovies()
    // check if the movie is already a favorite
    const favorite = isFavorite(movie.id)

    // handleCardClick function to navigate to the movie details page
    const handleCardClick = () => {
        navigate(`/movie/${movie.id}`)
    }

    // handleFavoriteClick function to add or remove the movie from favorites
    const handleFavoriteClick = (e) => {
        e.stopPropagation()
        if (favorite) {
            removeFromFavorites(movie.id)
        } else {
            addToFavorites(movie)
        }
    }

    return (
        // render the movie card
        <Card className="movie-card">
            {/* Clickable area of the card that triggers navigation or modal */}
            <CardActionArea onClick={handleCardClick} className="movie-card-action">
                {/* Movie poster image; shows placeholder if poster is unavailable */}
                <CardMedia
                    component="img"
                    height="300"
                    image={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Movie poster from TMDb
                            : "https://via.placeholder.com/500x750?text=No+Image" // Fallback image
                    }
                    alt={movie.title} // Accessible image description
                    className="movie-poster"
                />
                {/* Card content: title and metadata */}
                <CardContent className="movie-card-content">
                    {/* Movie title, truncated if too long */}
                    <Typography gutterBottom variant="h6" component="div" noWrap className="movie-title">
                        {movie.title}
                    </Typography>
                    {/* Container for year and rating */}
                    <Box className="movie-info">
                        {/* Chip showing the release year */}
                        <Chip
                            label={movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                            size="small"
                            color="primary"
                            variant="outlined"
                            className="year-chip"
                        />
                        {/* Conditionally render rating if showRating is true */}
                        {showRating && (
                            <Box className="rating-container">
                                {/* Star rating (converted from 10-point scale to 5) */}
                                <Rating value={movie.vote_average / 2} precision={0.5} size="small" readOnly />
                                {/* Numeric rating value beside stars */}
                                <Typography variant="body2" className="rating-text">
                                    {movie.vote_average.toFixed(1)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
            {/* Favorite icon button; toggles favorite status */}
            <IconButton
                className={`favorite-button ${favorite ? "favorited" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                {/* Toggle between filled and outlined heart icon */}
                {favorite ? <Favorite className="favorite-icon" /> : <FavoriteBorder className="favorite-icon-outline" />}
            </IconButton>
        </Card>
    )
}

export default MovieCard
