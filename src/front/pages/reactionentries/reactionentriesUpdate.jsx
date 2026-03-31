import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ReactionEntriesUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [reaction, setReaction] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries/${id}`)
            .then(res => res.json())
            .then(data => setReaction(data.reaction));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reaction })
        })
            .then(() => navigate("/reaction-entries"));
    };

    return (
        <div className="container mt-4">
            <h2>Update Reaction</h2>

            <form onSubmit={handleSubmit}>
                <input value={reaction}
                    className="form-control mb-2"
                    onChange={e => setReaction(e.target.value)} />

                <button className="btn btn-warning">Update</button>
            </form>
        </div>
    );
};

export default ReactionEntriesUpdate;