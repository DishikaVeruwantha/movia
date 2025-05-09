"use client"
//import relevant libraries
import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

// create a context for movies
const MovieContext = createContext()
// create a custom hook to use the MovieContext
export const useMovies = () => useContext(MovieContext)

// create a provider component
export const MovieProvider = ({ children }) => {
    // create state variables to manage movie data
    const [trendingMovies, setTrendingMovies] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [filterResults, setFilterResults] = useState([])
    const [favorites, setFavorites] = useState(() => {
        // Get the favorites from local storage
        const savedFavorites = localStorage.getItem("favorites")
        return savedFavorites ? JSON.parse(savedFavorites) : []
    })
    const [lastSearch, setLastSearch] = useState(() => {
        // Get the last search from local storage
        const savedSearch = localStorage.getItem("lastSearch")
        // Check if the saved search is an object
        if (savedSearch && typeof savedSearch === "string") {
            return savedSearch
        } else {
            return ""
        }
    })
    const [lastFilter, setLastFilter] = useState(() => {
        // Get the last filter from local storage
        const savedFilter = localStorage.getItem("lastFilter")
        // Check if the saved filter is an object
        if (savedFilter && typeof savedFilter === "string") {
            return savedFilter
        } else {
            return ""
        }
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [genres, setGenres] = useState([])

    // Get the API key and base URL from environment variables
    const API_KEY = process.env.REACT_APP_API_KEY
    const BASE_URL = process.env.REACT_APP_BASE_URL

    // Save the favorites, last filter and last search to local storage whenever they change
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }, [favorites])

    useEffect(() => {
        localStorage.setItem("lastFilter", lastFilter)
    }, [lastFilter])

    useEffect(() => {
        localStorage.setItem("lastSearch", lastSearch)
    }, [lastSearch])

    // Fetch genres and trending movies when the component mounts
    useEffect(() => {
        // Fetch genres when component mounts
        fetchGenres()
        // Fetch trending movies when component mounts
        fetchTrendingMovies()
        // eslint-disable-next-line
    }, [])

    // Fetch genres when the component mounts
    const fetchGenres = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
            setGenres(response.data.genres)
        } catch (error) {
            console.error("Error fetching genres:", error)
            setError("Failed to fetch genres. Please try again later.")
        }
    }

    // Fetch trending movies
    const fetchTrendingMovies = async (page = 1) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`)

            // Check if the page is 1, if so, set the trending movies to the response data else append to the existing data
            if (page === 1) {
                setTrendingMovies(response.data.results)
            } else {
                setTrendingMovies((prev) => [...prev, ...response.data.results])
            }

            setTotalPages(response.data.total_pages)
            setPage(page)
        } catch (error) {
            console.error("Error fetching trending movies:", error)
            setError("Failed to fetch trending movies. Please try again later.")
        } finally {
            // Set loading to false
            setLoading(false)
        }
    }

    // Search movies
    const searchMovies = async (query, page = 1) => {
        if (!query) return

        setLoading(true)
        setError(null)
        // Set the last search to the query
        setLastSearch(query)

        try {
            const response = await axios.get(
                `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`,
            )

            // Check if the page is 1, if so, set the search results to the response data else append to the existing data
            if (page === 1) {
                setSearchResults(response.data.results)
            } else {
                setSearchResults((prev) => [...prev, ...response.data.results])
            }

            setTotalPages(response.data.total_pages)
            setPage(page)
        } catch (error) {
            console.error("Error searching movies:", error)
            setError("Failed to search movies. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    // Fetch movie details
    const fetchMovieDetails = async (movieId) => {
        setLoading(true)
        setError(null)
        try {
            // Fetch movie details, credits and videos in parallel
            const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
                axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
                axios.get(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`),
                axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`),
            ])

            return {
                ...movieResponse.data,
                credits: creditsResponse.data,
                videos: videosResponse.data,
            }
        } catch (error) {
            console.error("Error fetching movie details:", error)
            setError("Failed to fetch movie details. Please try again later.")
            return null
        } finally {
            setLoading(false)
        }
    }

    // Add movie to favorites
    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            // Check if the movie is already in favorites
            if (prev.some((m) => m.id === movie.id)) {
                return prev
            }
            return [...prev, movie]
        })
    }

    // Remove movie from favorites
    const removeFromFavorites = (movieId) => {
        // Check if the movie is already in favorites
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
    }

    // Check if movie is in favorites
    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId)
    }

    // Load more results based on the type
    const loadMoreResults = (type) => {
        // Check if the page is less than total pages
        if (page < totalPages) {
            // Check the type and call the appropriate function
            if(type==="search") {
                searchMovies(lastSearch, page + 1)
            }else if(type==="filter") {
                console.log(lastFilter)
                filterMovies(lastFilter, page + 1)
            }else if(type==="trending") {
                fetchTrendingMovies(page + 1)
            }
        }
    }

    // Filter movies based on the filters
    const filterMovies = async (filters, page = 1) => {
        setLoading(true)
        setError(null)
        // Set the last filter to the filters
        setLastFilter(filters)

        try {
            // Construct the URL with filters
            let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}`

            // Add filters to the URL
            if (filters.year) {
                url += `&primary_release_year=${filters.year}`
            }

            // Add genre filter
            if (filters.genre) {
                url += `&with_genres=${filters.genre}`
            }

            // Add rating filter
            if (filters.rating) {
                url += `&vote_average.gte=${filters.rating}`
            }

            // Add runtime filter
            const response = await axios.get(url)
            // Check if the page is 1, if so, set the filter results to the response data else append to the existing data
            if (page === 1) {
                setFilterResults(response.data.results)
            } else {
                setFilterResults((prev) => [...prev, ...response.data.results])
            }


            setTotalPages(response.data.total_pages)
            setPage(page)
        } catch (error) {
            console.error("Error filtering movies:", error)
            setError("Failed to filter movies. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    // Create a value object to pass to the provider
    const value = {
        trendingMovies,
        searchResults,
        filterResults,
        favorites,
        lastSearch,
        lastFilter,
        loading,
        error,
        page,
        totalPages,
        genres,
        searchMovies,
        fetchMovieDetails,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loadMoreResults,
        filterMovies,
    }

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
}
