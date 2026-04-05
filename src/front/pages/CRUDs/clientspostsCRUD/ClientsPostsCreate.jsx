import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ClientsPostsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [clientId, setClientId] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: parseInt(clientId), title, text })
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({ type: "set_clients_posts", payload: [...store.clients_posts, data] });
        navigate("/clients-posts");
    };

    return (
        <div className="container mt-4">
            <h2>Create Post</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleCreate}>
                <div className="mb-3">
                    <label>Client</label>
                    <select className="form-select mb-3" value={clientId} onChange={e => setClientId(e.target.value)} required>
                        <option value="">Select client</option>
                        {store.clients.map(c => (
                            <option key={c.id} value={c.id}>{c.email}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Text</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary">Create</button>
                <Link to="/client-posts" className="btn btn-secondary ms-2">Back</Link>
            </form>
        </div>
    );
};

export default ClientsPostsCreate;   