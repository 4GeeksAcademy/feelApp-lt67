import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AdmintsCreate = () => {
    const { store, dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.admintToken) navigate("/");
    }, [store.admintToken, navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admints`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            setError(data.error);
            return;
        }

        dispatch({
            type: "set_admints",
            payload: [...store.admints, data],
        });

        navigate("/admints");
    };

    return (
        <div className="clients-page container mt-4">
            <h2 className="mb-3">Create Admin </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleCreate}>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder=" Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder=" Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="d-flex justify-content-between">
                    <button className="btn btn-dark px-4">Create</button>

                    <Link to="/admins" className="btn btn-outline-secondary">
                        Back
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdmintsCreate;