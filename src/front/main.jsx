import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { APIProvider } from "@vis.gl/react-google-maps";
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Main = () => {
    return (
             <React.StrictMode>
                <APIProvider apiKey={MAPS_KEY} libraries={["places"]}>
            {/* Provide global state to all components */}
            <StoreProvider>
                {/* Set up routing for the application */}
                <RouterProvider router={router}>
                </RouterProvider>
            </StoreProvider>
            </APIProvider>
                </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
