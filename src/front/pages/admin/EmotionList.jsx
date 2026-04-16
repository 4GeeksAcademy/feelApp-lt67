import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EmotionsList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const emotions = store.emotions || [];
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editEmoji, setEditEmoji] = useState("");
    const [editColor, setEditColor] = useState("");

    useEffect(() => {
        if (!store.admintToken) navigate("/");
    }, [store.admintToken, navigate]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`, {
            headers: { Authorization: `Bearer ${store.admintToken}` }
        })
            .then(resp => resp.json())
            .then(data => {
                if (Array.isArray(data)) dispatch({ type: "set_emotions", payload: data });
            });
    }, [dispatch, store.admintToken]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this emotion?")) return;

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${store.admintToken}` }
        });

        if (resp.ok) {
            dispatch({
                type: "set_emotions",
                payload: emotions.filter(e => e.id !== id)
            });
        }
    };

    const handleSaveUpdate = async (id) => {
        const body = {
            name: editName,
            emoji: editEmoji,
            color: editColor
        };

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.admintToken}`
            },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            const updatedEmotion = await resp.json();
            dispatch({
                type: "set_emotions",
                payload: emotions.map(e => e.id === id ? updatedEmotion : e)
            });
            setEditingId(null);
        }
    };

    const startEditing = (emotion) => {
        setEditingId(emotion.id);
        setEditName(emotion.name);
        setEditEmoji(emotion.emoji);
        setEditColor(emotion.color);
    };

    return (
        <div className="container" style={{ marginTop: "80px", width: "1000px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                <div>
                    <h2 className="mt-5" style={{ fontWeight: "700", marginBottom: "0" }}>Emotions</h2>
                    <small className="text-muted">Directly manage emotions, emojis, and colors</small>
                </div>
                <Link to="/emotions/create" className="btn btn-dark">
                    + New Emotion
                </Link>
            </div>

            <div style={{
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "20px"
            }}>
                <table className="table align-middle">
                    <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                            <th style={{ width: "70px" }}>ID</th>
                            <th style={{ width: "250px" }}>Name</th>
                            <th style={{ width: "100px" }}>Emoji</th>
                            <th style={{ width: "150px" }}>Color</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emotions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">No emotions found</td>
                            </tr>
                        ) : (
                            emotions.map(emotion => (
                                <tr key={emotion.id}>
                                    <td>{emotion.id}</td>
                                    <td>
                                        {editingId === emotion.id ? (
                                            <input
                                                className="form-control form-control-sm"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            <span className="fw-bold">{emotion.name}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingId === emotion.id ? (
                                            <input
                                                className="form-control form-control-sm text-center"
                                                value={editEmoji}
                                                onChange={e => setEditEmoji(e.target.value)}
                                            />
                                        ) : (
                                            <span style={{ fontSize: "1.2rem" }}>{emotion.emoji}</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            {editingId === emotion.id ? (
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color form-control-sm"
                                                    value={editColor}
                                                    onChange={e => setEditColor(e.target.value)}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    borderRadius: "50%",
                                                    backgroundColor: emotion.color,
                                                    border: "1px solid #dee2e6"
                                                }} />
                                            )}
                                            <small className="text-muted">{editingId === emotion.id ? editColor : emotion.color}</small>
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            {editingId === emotion.id ? (
                                                <>
                                                    <button className="btn btn-sm btn-success px-3" onClick={() => handleSaveUpdate(emotion.id)}>Save</button>
                                                    <button className="btn btn-sm btn-light px-3" onClick={() => setEditingId(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary px-3"
                                                        onClick={() => startEditing(emotion)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger px-3"
                                                        onClick={() => handleDelete(emotion.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmotionsList;