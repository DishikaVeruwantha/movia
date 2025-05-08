"use client"

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

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

const FilterPanel = () => {
    const { genres, filterMovies } = useMovies()
    const [selectedGenre, setSelectedGenre] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [ratingValue, setRatingValue] = useState([0, 10])
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const handleRatingChange = (event, newValue) => {
        setRatingValue(newValue)
    }

    const handleFilter = () => {
        const filters = {
            genre: selectedGenre,
            year: selectedYear,
            rating: ratingValue[0],
        }
        filterMovies(filters)
    }

    const handleReset = () => {
        setSelectedGenre("")
        setSelectedYear("")
        setRatingValue([0, 10])
    }

    const filterContent = (
        <>
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
                        <MenuItem value="">
                            <em>All Genres</em>
                        </MenuItem>
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                {genre.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

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
                        <MenuItem value="">
                            <em>All Years</em>
                        </MenuItem>
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box className="filter-item">
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

            <Box className="filter-buttons">
                <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>
                    Apply Filters
                </Button>
                <Button variant="outlined" onClick={handleReset} fullWidth>
                    Reset
                </Button>
            </Box>
        </>
    )

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
