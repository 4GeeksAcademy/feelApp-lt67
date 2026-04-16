import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EmotionsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#f5f3e0");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.admintToken) navigate("/");
    }, [store.admintToken, navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.admintToken}`
            },
            body: JSON.stringify({ name, emoji, color })
        });

        const data = await resp.json();

        if (!resp.ok) {
            setError(data.error || "Error creating emotion");
            return;
        }

        dispatch({
            type: "set_emotions",
            payload: [...(store.emotions || []), data]
        });

        navigate("/emotions");
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", marginTop: "40px" }}>
            <div
                className="bg-white p-5"
                style={{
                    width: "450px",
                    borderRadius: "16px",
                    border: "1px solid #dee2e6",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >
                <h2 className="mb-4 text-center" style={{ fontWeight: "700" }}>Create Emotion</h2>

                {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.9rem" }}>{error}</div>}

                <form onSubmit={handleCreate}>
                    <div className="text-start mb-3">
                        <label className="form-label small fw-bold text-muted">Emotion Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Happiness"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label small fw-bold text-muted">Emoji</label>
                            <input
                                type="text"
                                className="form-control text-center"
                                placeholder="😊"
                                value={emoji}
                                onChange={e => setEmoji(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-8">
                            <label className="form-label small fw-bold text-muted">Pick Color</label>
                            <div className="d-flex align-items-center gap-2 border rounded p-1 px-2" style={{ height: "38px" }}>
                                <input
                                    type="color"
                                    className="form-control form-control-color border-0 p-0"
                                    style={{ width: "30px", height: "25px" }}
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                />
                                <span className="text-muted small font-monospace">{color.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                        <button className="btn btn-dark py-2 rounded-pill">
                            Create Emotion
                        </button>
                        <Link to="/emotions" className="btn btn-link text-muted text-decoration-none">
                            Back to List
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmotionsCreate;