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

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#e50914",
      },
      secondary: {
        main: "#221f1f",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            overflow: "hidden",
          },
        },
      },
    },
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <MovieProvider>
            <Router>
              <div className="app">
                <Header setTabValue={setTabValue} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                <Routes>
                  <Route
                      path="/"
                      element={
                          <Home tabValue={tabValue} setTabValue={setTabValue} />
                      }
                  />
                  <Route
                      path="/movie/:id"
                      element={
                          <MovieDetails />
                      }
                  />
                  <Route
                      path="/favorites"
                      element={
                          <Favorites />
                      }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </MovieProvider>
      </ThemeProvider>
  )
}

export default App
