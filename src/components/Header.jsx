"use client"
// import relevant libraries and components
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
    ListItemButton,
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
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
} from "@mui/icons-material"
import { useMovies } from "../contexts/MovieContext"
import "./Header.css"

// Header component
const Header = ({ setTabValue, toggleDarkMode, darkMode }) => {
    // useState and other hooks
    const { searchMovies, lastSearch } = useMovies()
    const [searchQuery, setSearchQuery] = useState(lastSearch)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    // handleSearch function
    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            searchMovies(searchQuery)
            navigate("/")
            setTabValue(2)
            setDrawerOpen(false)
        }
    }

    // toggleDrawer function
    const toggleDrawer = (open) => (event) => {
        if (!open) {
            if (document.activeElement) {
                document.activeElement.blur();
            }
        }
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return
        }
        setDrawerOpen(open)
    }

    // drawerContent
    const drawerContent = (
        <Box className="drawer-content" role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                <ListItemButton>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                    <Link to="/" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                </ListItemButton>
                <ListItemButton >
                    <ListItemIcon>
                        <FavoriteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Favorites" />
                    <Link to="Favorites" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                </ListItemButton>
                <ListItem>
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />}
                        label={darkMode ? "Dark Mode" : "Light Mode"}
                    />
                </ListItem>
            </List>
        </Box>
    )

    return (
        // AppBar component
        <AppBar position="sticky">
            <Toolbar>
                {/* Show hamburger menu icon only on mobile devices */}
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

                {/* App title as a clickable link to home */}
                <Typography variant="h6" noWrap component={Link} to="/" className="app-title">
                    Movia
                </Typography>

                {/* Search form */}
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-wrapper">
                        <div className="search-icon-wrapper">
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search movies…"
                            inputProps={{ "aria-label": "search" }}
                            value={searchQuery}
                            onChange={(e) => {
                                // Prevent object-type values and reset if necessary
                                const newValue = e.target.value
                                setSearchQuery(typeof newValue === 'object' ? "" : newValue)
                            }}
                            className="search-input"
                        />
                    </div>
                    {/* Show search button only on non-mobile devices */}
                    {!isMobile && (
                        <Button type="submit" variant="contained" color="secondary" className="search-button">
                            Search
                        </Button>
                    )}
                </form>

                {/* Desktop navigation links and theme toggle */}
                {!isMobile && (
                    <Box className="nav-links">
                        {/* Theme toggle icon button */}
                        <IconButton color="inherit" onClick={toggleDarkMode}>
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                        {/* Navigation buttons */}
                        <Button color="inherit" component={Link} to="/">
                            Home
                        </Button>
                        <Button color="inherit" component={Link} to="/favorites">
                            Favorites
                        </Button>
                    </Box>
                )}
            </Toolbar>

            {/* Drawer for navigation (only used in mobile view) */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
        </AppBar>
    )
}

export default Header
