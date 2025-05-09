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















    return (
        <Container maxWidth="lg" className="details-container">
            <Paper elevation={3} className="details-paper">
                <Grid container spacing={4}>



                </Grid>


            </Paper>
        </Container>
    )
}

export default MovieDetails
