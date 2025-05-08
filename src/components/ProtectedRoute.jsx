"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Box, CircularProgress } from "@mui/material"
import "./ProtectedRoute.css"

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth()

    if (loading) {
        return (
            <Box className="protected-route-loading">
                <CircularProgress />
            </Box>
        )
    }

    if (!currentUser) {
        return <Navigate to="/login" />
    }

    return children
}

export default ProtectedRoute
