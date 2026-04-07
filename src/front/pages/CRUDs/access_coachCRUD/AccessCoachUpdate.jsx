import { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useParams, useNavigate } from "react-router-dom";

export const AccessCoachUpdate = () => {
    const { store } = useGlobalReducer();
    const { id } = useParams();
    const navigate = useNavigate();

    const [clientId, setClientId] = useState("");
    const [coachId, setCoachId] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`)
            .then(res => res.json())
            .then(data => {
                setClientId(data.client_id);
                setCoachId(data.coach_id);
                setStatus(data.status);
            });

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(res => res.json())
            .then(data => store.clients = data);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`)
            .then(res => res.json())
            .then(data => store.coaches = data);

    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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
            <h2>Update Access Coach</h2>

            <form onSubmit={handleSubmit}>

                <select
                    className="form-control mb-2"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                >
                    {store.clients?.map(c => (
                        <option key={c.id} value={c.id}>{c.id}</option>
                    ))}
                </select>

                <select
                    className="form-control mb-2"
                    value={coachId}
                    onChange={(e) => setCoachId(e.target.value)}
                >
                    {store.coaches?.map(c => (
                        <option key={c.id} value={c.id}>{c.id}</option>
                    ))}
                </select>

                <select
                    className="form-control mb-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                </select>

                <button className="btn btn-success">Update</button>
            </form>
        </div>
    );
};