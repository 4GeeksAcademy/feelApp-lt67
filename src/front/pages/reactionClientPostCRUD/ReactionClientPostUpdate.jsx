import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const REACTIONS = ["👍", "🎉", "💪", "❤️", "💡"];

const ReactionClientPostUpdate = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [reaction, setReaction] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts/${id}`)
            .then(r => r.json())
            .then(data => setReaction(data.reaction));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reaction })
        });

        const data = await resp.json();

        dispatch({
            type: "set_reaction_client",
            payload: store.reaction_client.map(r => r.id === parseInt(id) ? data : r)
        });

        navigate("/reactions-client");
    };

    return (
        <div className="container mt-4">
            <h2>Edit Reaction</h2>

            <form onSubmit={handleUpdate}>
                <label>Reaction</label>
                <select
                    className="form-select mb-3"
                    value={reaction}
                    onChange={e => setReaction(e.target.value)}
                >
                    <option value="">Select reaction</option>
                    {REACTIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <button className="btn btn-primary">Save</button>
                <Link to="/reactions-client" className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    );
};

export default ReactionClientPostUpdate;