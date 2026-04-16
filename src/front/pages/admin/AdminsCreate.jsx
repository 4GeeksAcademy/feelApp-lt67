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
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.admintToken}`
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            setError(data.error || "Error creating admin");
            return;
        }

        dispatch({
            type: "set_admints",
            payload: [...(store.admints || []), data],
        });

        navigate("/admints");
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", marginTop: "40px" }}>
            <div
                className="bg-white p-5"
                style={{
                    width: "400px",
                    borderRadius: "16px",
                    border: "1px solid #dee2e6",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >
                <h2 className="mb-4 text-center" style={{ fontWeight: "700" }}>Create Admin</h2>

                {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.9rem" }}>{error}</div>}

                <form onSubmit={handleCreate}>
                    <div className="text-start mb-3">
                        <label className="form-label small fw-bold text-muted">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="admin@feelapp.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-start mb-4">
                        <label className="form-label small fw-bold text-muted">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-dark py-2 rounded-pill">
                            Create Admin
                        </button>
                        <Link to="/admints" className="btn btn-link text-muted text-decoration-none">
                            Back to List
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdmintsCreate;