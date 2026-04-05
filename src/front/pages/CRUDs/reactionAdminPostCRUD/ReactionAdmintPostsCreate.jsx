import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const REACTIONS = ["👍", "🎉", "💪", "❤️", "💡"];

const ReactionAdmintPostsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [client_id, setClientId] = useState("");
    const [admint_post_id, setPostId] = useState("");
    const [reaction, setReaction] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(r => r.json())
            .then(data => dispatch({ type: "set_clients", payload: data }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`)
            .then(r => r.json())
            .then(data => dispatch({ type: "set_admint_posts", payload: data }));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        if (!reaction) {
            setError("Select a reaction");
            return;
        }

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: parseInt(client_id),
                admint_post_id: parseInt(admint_post_id),
                reaction
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            setError(data.error);
            return;
        }

        dispatch({
            type: "set_reactions",
            payload: [...store.reactions, data]
        });

        navigate("/reactions");
    };

    return (
        <div className="container mt-4">
            <h2>Create Reaction</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleCreate}>

                <label>Client</label>
                <select className="form-select mb-3" value={client_id} onChange={e => setClientId(e.target.value)} required>
                    <option value="">Select client</option>
                    {store.clients.map(c => (
                        <option key={c.id} value={c.id}>{c.email}</option>
                    ))}
                </select>

                <label>Post</label>
                <select className="form-select mb-3" value={admint_post_id} onChange={e => setPostId(e.target.value)} required>
                    <option value="">Select post</option>
                    {store.admint_posts.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>

                <label>Reaction</label>
                <select className="form-select mb-3" value={reaction} onChange={e => setReaction(e.target.value)} required>
                    <option value="">Select reaction</option>
                    {REACTIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <button className="btn btn-primary">Create</button>
                <Link to="/reactions" className="btn btn-secondary ms-2">Back</Link>
            </form>
        </div>
    );
};

export default ReactionAdmintPostsCreate;