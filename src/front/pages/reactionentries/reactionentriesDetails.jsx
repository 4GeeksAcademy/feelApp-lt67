import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReactionEntriesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reaction, setReaction] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries/${id}`)
            .then(res => res.json())
            .then(data => setReaction(data))
            .catch(err => console.error(err));
    }, [id]);

    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries/${id}`, {
            method: "DELETE",
        })
            .then(res => {
                if (!res.ok) throw new Error("Error deleting");
                return res.json();
            })
            .then(() => navigate("/reaction-entries"))
            .catch(err => console.error(err));
    };

    if (!reaction) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>Reaction Detail</h2>

            <p><strong>ID:</strong> {reaction.id}</p>
            <p><strong>Client:</strong> {reaction.client_id}</p>
            <p><strong>Entry:</strong> {reaction.entries_id}</p>
            <p><strong>Reaction:</strong> {reaction.reaction}</p>

            <div className="mt-3">
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>

                <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ReactionEntriesDetails;