import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ClientsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        useEffect(() => {
                if (!store.admintToken) navigate("/");
            }, [store.admintToken, navigate]);

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await resp.json();

        if (!resp.ok) {
            setError(data.error);
            return;
        }

        dispatch({
            type: "set_clients",
            payload: [...store.clients, data]
        });

        navigate("/clients");
    };


    return (
        <div className="clients-page container mt-5">
            <h2 className="mt-5">Create Client</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleCreate}>
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className="btn btn-primary">Create</button>

                <Link to="/clients" className="btn btn-secondary ms-2">
                    Back
                </Link>
            </form>
        </div>
    );
};

export default ClientsCreate;