import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReactionEntriesDetails = () => {
    const { id } = useParams();
    const [reaction, setReaction] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries/${id}`)
            .then(res => res.json())
            .then(data => setReaction(data));
    }, []);

    if (!reaction) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>Reaction Detail</h2>

            <p><strong>ID:</strong> {reaction.id}</p>
            <p><strong>Client:</strong> {reaction.client_id}</p>
            <p><strong>Entry:</strong> {reaction.entries_id}</p>
            <p><strong>Reaction:</strong> {reaction.reaction}</p>
        </div>
    );
};

export default ReactionEntriesDetails;