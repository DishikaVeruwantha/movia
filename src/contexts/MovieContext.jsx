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






















}
