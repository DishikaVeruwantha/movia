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


















}
