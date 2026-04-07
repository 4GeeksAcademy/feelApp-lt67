import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ClientsDetails = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [client, setClient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/${id}`)
            .then(resp => resp.json())
            .then(data => setClient(data));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Delete client?")) return;

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/${id}`, {
            method: "DELETE"
        });

        if (!resp.ok) return;

        dispatch({
            type: "set_clients",
            payload: store.clients.filter(c => c.id !== parseInt(id))
        });

        navigate("/clients");
    };

    if (!client) return <p className="container mt-4">Loading...</p>;

    return (
        <div className="clients-page container mt-4">
            <h2>Client Details</h2>

            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Date:</strong> {new Date(client.sign_up_date).toLocaleDateString()}</p>

            <Link to={`/clients/${id}/edit`} className="btn btn-primary">
                Edit
            </Link>

            <button onClick={handleDelete} className="btn btn-outline-secondary ms-2">
                Delete
            </button>

            <Link to="/clients" className="btn btn-secondary ms-2">
                Back
            </Link>
        </div>
    );
};

export default ClientsDetails;