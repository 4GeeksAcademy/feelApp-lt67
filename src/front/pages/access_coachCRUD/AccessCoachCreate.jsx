import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AccessCoachCreate = () => {

    const navigate = useNavigate();

    const [clientId, setClientId] = useState("");
    const [coachId, setCoachId] = useState("");
    const [status, setStatus] = useState("pending");

    const [clients, setClients] = useState([]);
    const [coaches, setCoaches] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(res => res.json())
            .then(data => setClients(data));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`)
            .then(res => res.json())
            .then(data => setCoaches(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: clientId,
                coach_id: coachId,
                status: status
            })
        });

        navigate("/access-coach");
    };

    return (
        <div className="container">
            <h2>Create Access Coach</h2>

            <form onSubmit={handleSubmit}>

                <select
                    className="form-control mb-2"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                >
                    <option value="">Select Client</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.email || c.name || `Client ${c.id}`}
                        </option>
                    ))}
                </select>

                <select
                    className="form-control mb-2"
                    value={coachId}
                    onChange={(e) => setCoachId(e.target.value)}
                    required
                >
                    <option value="">Select Coach</option>
                    {coaches.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name || c.email || `Coach ${c.id}`}
                        </option>
                    ))}
                </select>

                <select
                    className="form-control mb-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                </select>

                <button className="btn btn-primary me-2">
                    Create
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/access-coach")}
                >
                    Back
                </button>

            </form>
        </div>
    );
};