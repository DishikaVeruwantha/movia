"use client"

import { useNavigate } from "react-router-dom"
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, IconButton, Chip, Rating } from "@mui/material"
import { Favorite, FavoriteBorder } from "@mui/icons-material"
import { useMovies } from "../contexts/MovieContext"
import "./MovieCard.css"

const MovieCard = ({ movie, showRating = true }) => {
    const navigate = useNavigate()
    const { addToFavorites, removeFromFavorites, isFavorite } = useMovies()
    const favorite = isFavorite(movie.id)

    const handleCardClick = () => {
        navigate(`/movie/${movie.id}`)
    }

    const handleFavoriteClick = (e) => {
        e.stopPropagation()
        if (favorite) {
            removeFromFavorites(movie.id)
        } else {
            addToFavorites(movie)
        }
    }

    return (
        <Card className="movie-card">
            <CardActionArea onClick={handleCardClick} className="movie-card-action">
                <CardMedia
                    component="img"
                    height="300"
                    image={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="movie-poster"
                />
                <CardContent className="movie-card-content">
                    <Typography gutterBottom variant="h6" component="div" noWrap className="movie-title">
                        {movie.title}
                    </Typography>
                    <Box className="movie-info">
                        <Chip
                            label={movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                            size="small"
                            color="primary"
                            variant="outlined"
                            className="year-chip"
                        />
                        {showRating && (
                            <Box className="rating-container">
                                <Rating value={movie.vote_average / 2} precision={0.5} size="small" readOnly />
                                <Typography variant="body2" className="rating-text">
                                    {movie.vote_average.toFixed(1)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
            <IconButton
                className={`favorite-button ${favorite ? "favorited" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                {favorite ? <Favorite className="favorite-icon" /> : <FavoriteBorder className="favorite-icon-outline" />}
            </IconButton>
        </Card>
    )
}

export default MovieCard
