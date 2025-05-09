"use client"

//import relevant libraries and components
import {Container, Box, Tabs, Tab, useMediaQuery, useTheme} from "@mui/material"
import { useMovies } from "../contexts/MovieContext"
import MovieGrid from "../components/MovieGrid"
import FilterPanel from "../components/FilterPanel"
import "./Home.css"

// Home component
const Home = ({ tabValue, setTabValue }) => {
    // useMovies hook to get movie data and functions
    const { trendingMovies, searchResults, filterResults, lastSearch, loading, error, loadMoreResults, page, totalPages } = useMovies()
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
    // useMediaQuery hook to check if the screen size is mobile
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <Container maxWidth="xl" className="home-container">
            {/* Tabs for switching between Trending, Filter, and Search results */}
            <Box className="tabs-container">
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="movie tabs"
                    centered
                >
                    {/* Tab label adjusts for mobile screens */}
                    <Tab label={isMobile ? "Trending" : "Trending Movies"} />
                    <Tab label={isMobile ? "Filter" : "Filter Movies"} />
                    {searchResults.length > 0 && (
                        <Tab label={isMobile ? `Search (${lastSearch})` : `Search Results: ${lastSearch}`} />
                    )}
                </Tabs>
            </Box>

            {/* Conditional rendering based on selected tab */}
            {(() => {
                switch (tabValue) {
                    case 0:
                        // Tab 0: Trending Movies
                        return (
                            <MovieGrid
                                movies={trendingMovies}
                                loading={loading}
                                error={error}
                                title="Trending Movies"
                                emptyMessage="No trending movies available. Please try again later."
                                onLoadMore={() => loadMoreResults("trending")}
                                hasMore={page < totalPages}
                            />
                        );

                    case 1:
                        // Tab 1: Filter Panel and Filtered Movies
                        return (
                            <>
                                <FilterPanel />
                                <MovieGrid
                                    movies={filterResults}
                                    loading={loading}
                                    error={error}
                                    title="Filter Movies"
                                    emptyMessage="No movies found matching your search."
                                    onLoadMore={() => loadMoreResults("filter")}
                                    hasMore={page < totalPages}
                                />
                            </>
                        );

                    case 2:
                        // Tab 2: Search Results
                        return (
                            <>
                                <MovieGrid
                                    movies={searchResults}
                                    loading={loading}
                                    error={error}
                                    title={`Search Results for "${lastSearch}"`}
                                    emptyMessage="No movies found matching your search."
                                    onLoadMore={() => loadMoreResults("search")}
                                    hasMore={page < totalPages}
                                />
                            </>
                        );

                    default:
                        return null;
                }
            })()}

        </Container>
    )
}

export default Home
