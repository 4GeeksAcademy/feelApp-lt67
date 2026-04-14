import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const EmotionsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#f5f3e0");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
        navigate("/emotions");
    };

    return (
        <div className="emotions-page container" style={{marginTop:"100px"}}>
            <h2>Create Emotion</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleCreate}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Emoji</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Emoji"
                        value={emoji}
                        onChange={e => setEmoji(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Color</label>
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
                <button className="btn btn-primary">Create</button>
                <Link to="/emotions" className="btn btn-secondary ms-2">Back</Link>
            </form>
        </div>
    );
};

export default EmotionsCreate;