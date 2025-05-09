"use client"

import { useState } from "react"
import { Container, Box, Tabs, Tab } from "@mui/material"
import { useMovies } from "../contexts/MovieContext"
import MovieGrid from "../components/MovieGrid"
import FilterPanel from "../components/FilterPanel"
import "./Home.css"

const Home = ({ tabValue, setTabValue }) => {
    const { trendingMovies, searchResults, filterResults, lastSearch, loading, error, loadMoreResults, page, totalPages } = useMovies()
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <Container maxWidth="xl" className="home-container">




        </Container>
    )
}

export default Home
