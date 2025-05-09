"use client"
// import relevant libraries and modules
import { useState } from "react"
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Slider,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useMediaQuery,
    useTheme,
} from "@mui/material"
import { ExpandMore as ExpandMoreIcon, FilterList as FilterListIcon } from "@mui/icons-material"
import { useMovies } from "../contexts/MovieContext"
import "./FilterPanel.css"
// create an array of years for the dropdown
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

// create the FilterPanel component
const FilterPanel = () => {
    // use the useMovies context to get genres and filterMovies function
    const { genres, filterMovies } = useMovies()
    // initialize state variables for selected genre, year, and rating
    const [selectedGenre, setSelectedGenre] = useState("")
    // initialize state variable for selected year
    const [selectedYear, setSelectedYear] = useState("")
    // initialize state variable for rating value
    const [ratingValue, setRatingValue] = useState([0, 10])
    // use the theme and media query to determine if the screen is mobile
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    // handleRatingChange function to update the rating value
    const handleRatingChange = (event, newValue) => {
        setRatingValue(newValue)
    }

    // handleFilter function to apply the selected filters
    const handleFilter = () => {
        const filters = {
            genre: selectedGenre,
            year: selectedYear,
            rating: ratingValue[0],
        }
        filterMovies(filters)
    }

    // handleReset function to reset the filters
    const handleReset = () => {
        setSelectedGenre("")
        setSelectedYear("")
        setRatingValue([0, 10])
    }

    // create the filter content to be displayed in the accordion or paper
    const filterContent = (
        <>
            {/* Genre Selection Dropdown */}
            <Box className="filter-item">
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="genre-select-label">Genre</InputLabel>
                    <Select
                        labelId="genre-select-label"
                        id="genre-select"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        label="Genre"
                    >
                        {/* Option to select all genres */}
                        <MenuItem value="">
                            <em>All Genres</em>
                        </MenuItem>
                        {/* Dynamically render genre options */}
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                {genre.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Year Selection Dropdown */}
            <Box className="filter-item">
                <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                        labelId="year-select-label"
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        label="Year"
                    >
                        {/* Option to select all years */}
                        <MenuItem value="">
                            <em>All Years</em>
                        </MenuItem>
                        {/* Dynamically render year options */}
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Rating Range Slider */}
            <Box className="filter-item">
                {/* Display current rating range */}
                <Typography id="rating-slider" gutterBottom>
                    Rating: {ratingValue[0]} - {ratingValue[1]}
                </Typography>
                <Slider
                    value={ratingValue}
                    onChange={handleRatingChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="rating-slider"
                    min={0}
                    max={10}
                    step={0.5}
                />
            </Box>

            {/* Action Buttons for Filtering */}
            <Box className="filter-buttons">
                {/* Apply selected filters */}
                <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>
                    Apply Filters
                </Button>
                {/* Reset filters to default values */}
                <Button variant="outlined" onClick={handleReset} fullWidth>
                    Reset
                </Button>
            </Box>
        </>
    )

    // render the filter panel based on the screen size
    return isMobile ? (
        <Accordion className="filter-accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="filter-panel-content" id="filter-panel-header">
                <Box className="filter-header">
                    <FilterListIcon className="filter-icon" />
                    <Typography>Filters</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>{filterContent}</AccordionDetails>
        </Accordion>
    ) : (
        <Paper elevation={3} className="filter-paper">
            <Typography variant="h6" gutterBottom className="filter-title">
                <FilterListIcon className="filter-icon" />
                Filters
            </Typography>
            {filterContent}
        </Paper>
    )
}

export default FilterPanel
