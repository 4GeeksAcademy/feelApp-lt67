import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ReactionAdmintPostsUpdate = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [emotion_id, setEmotionId] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts/${id}`)
            .then(r => r.json())
            .then(data => setEmotionId(data.emotion_id));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
            .then(r => r.json())
            .then(data => dispatch({ type: "set_emotions", payload: data }));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emotion_id: parseInt(emotion_id)
            })
        });

        const data = await resp.json();

        dispatch({
            type: "set_reactions",
            payload: store.reactions.map(r => r.id === parseInt(id) ? data : r)
        });

        navigate("/reactions");
    };

    return (
        <div className="container mt-4">
            <h2>Edit Reaction</h2>

            <form onSubmit={handleUpdate}>

                <label>Reaction</label>
                <select
                    className="form-select mb-3"
                    value={emotion_id}
                    onChange={e => setEmotionId(e.target.value)}
                >
                    {store.emotions.map(e => (
                        <option key={e.id} value={e.id}>
                            {e.emoji} {e.name}
                        </option>
                    ))}
                </select>

                <button className="btn btn-primary">Save</button>
                <Link to="/reactions" className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    );
};

export default ReactionAdmintPostsUpdate;