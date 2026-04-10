import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Footer = () => {
    const { store } = useGlobalReducer();

    const isLoggedIn = !!(store.clientToken || store.admintToken || store.coachToken);

    return (
        <footer className="footer mt-auto text-center py-3">
            {!isLoggedIn && (
                <p className="small">
                    Specialized Tools for: Clients • Coaches • Psychologists • Psychiatrists • Therapeutic Companions
                </p>
            )}
        
            <p className="py-1">
                ® Feel App
            </p>
        </footer>
    );
};