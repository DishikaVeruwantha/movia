"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { MovieProvider } from "./contexts/MovieContext"
import Home from "./pages/Home"
import MovieDetails from "./pages/MovieDetails"
import Favorites from "./pages/Favorites"
import Header from "./components/Header"
import "./App.css"

function App() {
  const [tabValue, setTabValue] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode")
    return savedMode ? JSON.parse(savedMode) : false
  })







  return
}

export default App
