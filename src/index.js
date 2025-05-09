import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById("root"))
// Render the App component inside React.StrictMode for highlighting potential issues
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
