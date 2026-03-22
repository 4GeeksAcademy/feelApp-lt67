import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const EmotionsCRUD = () => {
    const { store, dispatch } = useGlobalReducer();

    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#f5f3e0"); // cream color as a default (?)
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editEmoji, setEditEmoji] = useState("");
    const [editColor, setEditColor] = useState("#f5f3e0");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_emotions", payload: data }));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, emoji, color })
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({ type: "set_emotions", payload: [...store.emotions, data] });
        setName("");
        setEmoji("");
        setColor("#f5f3e0");
    };

    const handleEdit = (emotion) => {
        setEditingId(emotion.id);
        setEditName(emotion.name);
        setEditEmoji(emotion.emoji);
        setEditColor(emotion.color);
    };

    const handleUpdate = async (id) => {
        setError("");
        const body = {};
        if (editName) body.name = editName;
        if (editEmoji) body.emoji = editEmoji;
        if (editColor) body.color = editColor;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({
            type: "set_emotions",
            payload: store.emotions.map(e => e.id === id ? data : e)
        });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this emotion?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return;
        dispatch({
            type: "set_emotions",
            payload: store.emotions.filter(e => e.id !== id)
        });
    };

    return (
        <div className="container mt-4">
            <h2>Emotions</h2>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Create emotion</h5>
                    <form onSubmit={handleCreate} className="row g-2">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Emoji"
                                value={emoji}
                                onChange={e => setEmoji(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    type="color"
                                    className="form-control form-control-color"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                />
                                <span className="text-muted">{color}</span>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Emoji</th>
                        <th>Color</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.emotions.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No emotions yet
                            </td>
                        </tr>
                    ) : (
                        store.emotions.map(emotion => (
                            <tr key={emotion.id}>
                                <td>{emotion.id}</td>
                                <td>
                                    {editingId === emotion.id ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                        />
                                    ) : (
                                        emotion.name
                                    )}
                                </td>
                                <td>
                                    {editingId === emotion.id ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={editEmoji}
                                            onChange={e => setEditEmoji(e.target.value)}
                                        />
                                    ) : (
                                        emotion.emoji
                                    )}
                                </td>
                                <td>
                                    {editingId === emotion.id ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <input
                                                type="color"
                                                className="form-control form-control-color form-control-sm"
                                                value={editColor}
                                                onChange={e => setEditColor(e.target.value)}
                                            />
                                            <span>{editColor}</span>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    borderRadius: "50%",
                                                    backgroundColor: emotion.color
                                                }}
                                            />
                                            {emotion.color}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {editingId === emotion.id ? (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleUpdate(emotion.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(emotion)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(emotion.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmotionsCRUD;