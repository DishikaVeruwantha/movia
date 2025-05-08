"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    InputBase,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    Switch,
    FormControlLabel,
} from "@mui/material"
import {
    Search as SearchIcon,
    Menu as MenuIcon,
    Home as HomeIcon,
    Favorite as FavoriteIcon,
    Logout as LogoutIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import { useMovies } from "../contexts/MovieContext"
import "./Header.css"

const Header = ({ toggleDarkMode, darkMode }) => {
    const { currentUser, logout } = useAuth()
    const { searchMovies, lastSearch } = useMovies()
    const [searchQuery, setSearchQuery] = useState(lastSearch)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            searchMovies(searchQuery)
            navigate("/")
            setDrawerOpen(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return
        }
        setDrawerOpen(open)
    }

    const drawerContent = (
        <Box className="drawer-content" role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/favorites">
                    <ListItemIcon>
                        <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Favorites" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />}
                        label={darkMode ? "Dark Mode" : "Light Mode"}
                    />
                </ListItem>
            </List>
        </Box>
    )

    if (!currentUser) return null

    return (
        <AppBar position="sticky">
            <Toolbar>
                {isMobile && (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        className="menu-button"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="h6" noWrap component={Link} to="/" className="app-title">
                    Movie Explorer
                </Typography>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-wrapper">
                        <div className="search-icon-wrapper">
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search movies…"
                            inputProps={{ "aria-label": "search" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    {!isMobile && (
                        <Button type="submit" variant="contained" color="secondary" className="search-button">
                            Search
                        </Button>
                    )}
                </form>

                {!isMobile && (
                    <Box className="nav-links">
                        <IconButton color="inherit" onClick={toggleDarkMode}>
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                        <Button color="inherit" component={Link} to="/">
                            Home
                        </Button>
                        <Button color="inherit" component={Link} to="/favorites">
                            Favorites
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
        </AppBar>
    )
}

export default Header
