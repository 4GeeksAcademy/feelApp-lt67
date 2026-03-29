// FavoritesCreate.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ClientFavoritesCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [clientId, setClientId] = useState("");
    const [entryId, setEntryId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (store.clients.length === 0) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
                .then(resp => resp.json())
                .then(data => dispatch({ type: "set_clients", payload: data }));
        }
        if (store.entries.length === 0) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`)
                .then(resp => resp.json())
                .then(data => dispatch({ type: "set_entries", payload: data }));
        }
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: parseInt(clientId), entry_id: parseInt(entryId) })
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({ type: "set_favorites", payload: [...store.favorites, data] });
        navigate("/client-favorites");
    };

    return (
        <div className="container mt-4">
            <h2>Add Favorite</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleCreate}>
                <div className="mb-3">
                    <label className="form-label">Client</label>
                    <select
                        className="form-select"
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                        required
                    >
                        <option value="">Select a client...</option>
                        {store.clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.id} — {client.email}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Entry</label>
                    <select
                        className="form-select"
                        value={entryId}
                        onChange={e => setEntryId(e.target.value)}
                        required
                    >
                        <option value="">Select an entry...</option>
                        {store.entries.map(entry => (
                            <option key={entry.id} value={entry.id}>
                                {entry.id} — {entry.title}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary">Add</button>
                <Link to="/client-favorites" className="btn btn-secondary ms-2">Back</Link>
            </form>
        </div>
    );
};

export default ClientFavoritesCreate;