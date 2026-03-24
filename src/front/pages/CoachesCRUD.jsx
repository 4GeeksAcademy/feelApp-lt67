import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const coachCRUD = () => {
    const { store, dispatch } = useGlobalReducer();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editingId, setEditingId] = useState(null); // no editing id 
    const [editEmail, setEditEmail] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_coachs", payload: data }));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({ type: "set_coachs", payload: [...store.coachs, data] });
        setEmail("");
        setPassword("");
    };

    const handleEdit = (coach) => {
        setEditingId(coach.id);
        setEditEmail(coach.email);
        setEditPassword("");
    };

    const handleUpdate = async (id) => {
        setError("");
        const body = {};
        if (editEmail) body.email = editEmail;
        if (editPassword) body.password = editPassword;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({
            type: "set_coachs",
            payload: store.coachs.map(c => c.id === id ? data : c)
        });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this admint?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return;
        dispatch({
            type: "delete_coach",
            payload: id
        });
    };

    return (
        <div className="container mt-4">
            <h2>Coach</h2>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Create coach</h5>
                    <form onSubmit={handleCreate} className="row g-2">
                        <div className="col-md-5">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-5">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Sign up date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.coachs.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center text-muted">
                                No coach yet
                            </td>
                        </tr>
                    ) : (
                        store.coachs.map(coach => (
                            <tr key={coach.id}>
                                <td>{coach.id}</td>
                                <td>
                                    {editingId === coach.id ? (
                                        <input
                                            type="email"
                                            className="form-control form-control-sm"
                                            value={editEmail}
                                            onChange={e => setEditEmail(e.target.value)}
                                        />
                                    ) : (
                                        coach.email
                                    )}
                                </td>
                                <td>{new Date(coach.sign_up_date).toLocaleDateString()}</td>
                                <td>
                                    {editingId === coach.id ? (
                                        <div className="d-flex gap-2">
                                            <input
                                                type="password"
                                                className="form-control form-control-sm"
                                                placeholder="New password"
                                                value={editPassword}
                                                onChange={e => setEditPassword(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleUpdate(coach.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(coach)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(coach.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default coachCRUD;





















