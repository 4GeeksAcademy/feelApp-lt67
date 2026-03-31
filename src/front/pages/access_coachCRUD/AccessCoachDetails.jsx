import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const AccessCoachDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`)
            .then(res => res.json())
            .then(data => setItem(data));
    }, [id]);

    return (
        <div className="container">
            <h2>Access Coach Details</h2>

            {item && (
                <>
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Client:</strong> {item.client_id}</p>
                    <p><strong>Coach:</strong> {item.coach_id}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                </>
            )}
        </div>
    );
};