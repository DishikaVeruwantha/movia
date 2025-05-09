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
            <Box className="tabs-container">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="movie tabs"
                    centered
                >
                    <Tab label="Trending Movies" />
                    <Tab label="Filter Movies" />
                    {searchResults.length > 0 && <Tab label={`Search Results: ${lastSearch}`} />}
                </Tabs>
            </Box>



        </Container>
    )
}

export default Home
