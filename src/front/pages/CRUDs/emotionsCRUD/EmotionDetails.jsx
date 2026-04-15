import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const EmotionsDetails = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [emotion, setEmotion] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`)
            .then(resp => resp.json())
            .then(data => setEmotion(data));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Delete emotion?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return;
        dispatch({
            type: "set_emotions",
            payload: store.emotions.filter(e => e.id !== parseInt(id))
        });
        navigate("/emotions");
    };

    if (!emotion) return <p className="container mt-4">Loading...</p>;

    return (
        <div className="emotions-page container mt-5">
            <h2 className="mt-80 bg-gray-200 p-4">Emotion Details</h2>
            <p><strong>ID:</strong> {emotion.id}</p>
            <p><strong>Name:</strong> {emotion.name}</p>
            <p><strong>Emoji:</strong> {emotion.emoji}</p>
            <p><strong>Color:</strong>
                <span className="ms-2">{emotion.color}</span>
                <span
                    className="ms-2 d-inline-block"
                    style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: emotion.color, verticalAlign: "middle" }}
                />
            </p>
            <Link to={`/emotions/${id}/edit`} className="btn btn-primary">Edit</Link>
            <button onClick={handleDelete} className="btn btn-outline-danger ms-2">Delete</button>
            <Link to="/emotions" className="btn btn-secondary ms-2">Back</Link>
        </div>
    );
};

export default EmotionsDetails;