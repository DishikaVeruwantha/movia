"use client"

import {Container, Box, Tabs, Tab, useMediaQuery, useTheme} from "@mui/material"
import { useMovies } from "../contexts/MovieContext"
import MovieGrid from "../components/MovieGrid"
import FilterPanel from "../components/FilterPanel"
import "./Home.css"

const Home = ({ tabValue, setTabValue }) => {
    const { trendingMovies, searchResults, filterResults, lastSearch, loading, error, loadMoreResults, page, totalPages } = useMovies()
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
                    <Tab label={isMobile ? "Trending" : "Trending Movies"} />
                    <Tab label={isMobile ? "Filter" : "Filter Movies"} />
                    {searchResults.length > 0 && (
                        <Tab label={isMobile ? `Search (${lastSearch})` : `Search Results: ${lastSearch}`} />
                    )}
                </Tabs>
            </Box>

            {(() => {
                switch (tabValue) {
                    case 0:
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
