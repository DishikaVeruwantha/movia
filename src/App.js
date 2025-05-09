"use client"

// import relevant libraries and components
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

// Main App component
function App() {
  // State variables for tab value and dark mode
  const [tabValue, setTabValue] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode")
    return savedMode ? JSON.parse(savedMode) : false
  })

  // Effect to synchronize dark mode state with local storage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  // Create a theme based on the dark mode state
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

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
      // Apply the custom Material UI theme across the app
      <ThemeProvider theme={theme}>
        {/* Normalize and reset CSS styles for consistency */}
        <CssBaseline />
        {/* Provide global state for managing favorite movies and other context values */}
          <MovieProvider>
            {/* Set up client-side routing */}
            <Router>
              <div className="app">
                {/* App header including logo, search bar, dark mode toggle */}
                <Header setTabValue={setTabValue} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                {/* Define application routes and components rendered for each path */}
                <Routes>
                  {/* Home page with tabs for trending, filter, and search results */}
                  <Route
                      path="/"
                      element={
                          <Home tabValue={tabValue} setTabValue={setTabValue} />
                      }
                  />
                  {/* Dynamic route for showing details of a selected movie */}
                  <Route
                      path="/movie/:id"
                      element={
                          <MovieDetails />
                      }
                  />
                  {/* Route for displaying user's favorite movies */}
                  <Route
                      path="/favorites"
                      element={
                          <Favorites />
                      }
                  />
                  {/* Redirect any unknown routes to the home page */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </MovieProvider>
      </ThemeProvider>
  )
}

export default App
