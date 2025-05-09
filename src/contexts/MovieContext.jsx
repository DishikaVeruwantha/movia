"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const MovieContext = createContext()

export const useMovies = () => useContext(MovieContext)

export const MovieProvider = ({ children }) => {
    const [trendingMovies, setTrendingMovies] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [filterResults, setFilterResults] = useState([])
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites")
        return savedFavorites ? JSON.parse(savedFavorites) : []
    })
    const [lastSearch, setLastSearch] = useState(() => {
        const savedSearch = localStorage.getItem("lastSearch")
        return savedSearch || ""
    })
    const [lastFilter, setLastFilter] = useState(() => {
        const savedFilter = localStorage.getItem("lastFilter")
        return savedFilter || ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [genres, setGenres] = useState([])

    const API_KEY = process.env.REACT_APP_API_KEY
    const BASE_URL = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }, [favorites])

    useEffect(() => {
        localStorage.setItem("lastSearch", lastFilter)
    }, [lastFilter])

    useEffect(() => {
        localStorage.setItem("lastSearch", lastSearch)
    }, [lastSearch])

    useEffect(() => {
        // Fetch genres when component mounts
        fetchGenres()
        // Fetch trending movies when component mounts
        fetchTrendingMovies()
        // eslint-disable-next-line
    }, [])

    const fetchGenres = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
            setGenres(response.data.genres)
        } catch (error) {
            console.error("Error fetching genres:", error)
            setError("Failed to fetch genres. Please try again later.")
        }
    }

    const fetchTrendingMovies = async (page = 1) => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`)

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
            setLoading(false)
        }
    }

    const searchMovies = async (query, page = 1) => {
        if (!query) return

        setLoading(true)
        setError(null)
        setLastSearch(query)

        try {
            const response = await axios.get(
                `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`,
            )

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

    const fetchMovieDetails = async (movieId) => {
        setLoading(true)
        setError(null)
        try {
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

    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            if (prev.some((m) => m.id === movie.id)) {
                return prev
            }
            return [...prev, movie]
        })
    }

    const removeFromFavorites = (movieId) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
    }

    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId)
    }

    const loadMoreResults = (type) => {
        if (page < totalPages) {
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

    const filterMovies = async (filters, page = 1) => {
        setLoading(true)
        setError(null)
        setLastFilter(filters)

        try {
            let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}`

            if (filters.year) {
                url += `&primary_release_year=${filters.year}`
            }

            if (filters.genre) {
                url += `&with_genres=${filters.genre}`
            }

            if (filters.rating) {
                url += `&vote_average.gte=${filters.rating}`
            }

            const response = await axios.get(url)
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
