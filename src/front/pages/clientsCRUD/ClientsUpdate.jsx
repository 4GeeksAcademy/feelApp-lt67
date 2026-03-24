import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ClientsUpdate = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/${id}`)
            .then(resp => resp.json())
            .then(data => setEmail(data.email));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const body = { email };
        if (password) body.password = password;

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await resp.json();

        dispatch({
            type: "set_clients",
            payload: store.clients.map(c => c.id === parseInt(id) ? data : c)
        });

        navigate(`/clients/${id}`);
    };

    return (
        <div className="clients-page container mt-4">
            <h2>Edit Client</h2>

            <form onSubmit={handleUpdate}>
                <input
                    type="email"
                    className="form-control mb-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button className="btn btn-primary">Save</button>

                <Link to={`/clients/${id}`} className="btn btn-secondary ms-2">
                    Cancel
                </Link>
            </form>
        </div>
    );
};

export default ClientsUpdate;