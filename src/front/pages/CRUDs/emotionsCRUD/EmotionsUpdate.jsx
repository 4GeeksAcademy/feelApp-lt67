import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const EmotionsUpdate = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("#f5f3e0");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setName(data.name);
                setEmoji(data.emoji);
                setColor(data.color);
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const body = {};
        if (name) body.name = name;
        if (emoji) body.emoji = emoji;
        if (color) body.color = color;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        dispatch({
            type: "set_emotions",
            payload: store.emotions.map(e => e.id === parseInt(id) ? data : e)
        });
        navigate(`/emotions/${id}`);
    };

    return (
        <div className="emotions-page container" style={{marginTop:"100px"}}>
            <h2>Edit Emotion</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Emoji</label>
                    <input
                        type="text"
                        className="form-control"
                        value={emoji}
                        onChange={e => setEmoji(e.target.value)}
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
                <button className="btn btn-primary">Save</button>
                <Link to={`/emotions/${id}`} className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    );
};

export default EmotionsUpdate;