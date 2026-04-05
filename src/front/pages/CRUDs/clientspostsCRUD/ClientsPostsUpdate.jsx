import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ClientsPostsUpdate = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setTitle(data.title);
                setText(data.text);
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        const body = {};
        if (title) body.title = title;
        if (text) body.text = text;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({
            type: "set_clients_posts",
            payload: store.clients_posts.map(p => p.id === parseInt(id) ? data : p)
        });
        navigate(`/clients-posts/${id}`);
    };

    return (
        <div className="container mt-4">
            <h2>Edit Post</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Text</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Save</button>
                <Link to={`/clients-posts/${id}`} className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    );
};

export default ClientsPostsUpdate;