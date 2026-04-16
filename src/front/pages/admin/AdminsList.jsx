import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AdmintsList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const admints = store.admints || [];

    const [editingId, setEditingId] = useState(null);
    const [editEmail, setEditEmail] = useState("");

    useEffect(() => {
        if (!store.admintToken) navigate("/");
    }, [store.admintToken, navigate]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admints`, {
            headers: { Authorization: `Bearer ${store.admintToken}` }
        })
            .then(resp => resp.json())
            .then(data => {
                if (Array.isArray(data)) dispatch({ type: "set_admints", payload: data });
            });
    }, [dispatch, store.admintToken]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admints/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${store.admintToken}` }
        });

        if (resp.ok) {
            dispatch({
                type: "set_admints",
                payload: admints.filter(a => a.id !== id)
            });
        }
    };

    const handleQuickUpdate = async (id) => {
        const newPassword = prompt("Enter new password (leave blank to keep current):");
        const body = { email: editEmail };
        if (newPassword) body.password = newPassword;

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admints/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.admintToken}`
            },
            body: JSON.stringify(body),
        });

        if (resp.ok) {
            const updatedAdmin = await resp.json();
            dispatch({
                type: "set_admints",
                payload: admints.map(a => a.id === id ? updatedAdmin : a)
            });
            setEditingId(null);
        }
    };

    return (
        <div className="container" style={{ marginTop: "80px", width: "1000px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="mt-5" style={{ fontWeight: "700", marginBottom: "0" }}>Admins</h2>
                    <small className="text-muted">Manage administrators</small>
                </div>
                <Link to="/admints/create" className="btn btn-dark">
                    + New Admin
                </Link>
            </div>

            <div style={{
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "20px",
                marginTop: "10px"
            }}>
                <table className="table align-middle">
                    <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                            <th style={{ width: "70px" }}>ID</th>
                            <th>Email Address</th>
                            <th style={{ width: "180px" }}>Joined Date</th>
                            <th style={{ width: "220px" }} className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admints.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">No admins registered</td>
                            </tr>
                        ) : (
                            admints.map(admint => (
                                <tr key={admint.id}>
                                    <td>{admint.id}</td>
                                    <td>
                                        {editingId === admint.id ? (
                                            <input
                                                className="form-control form-control-sm"
                                                value={editEmail}
                                                onChange={(e) => setEditEmail(e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            admint.email
                                        )}
                                    </td>
                                    <td className="text-muted" style={{ fontSize: "0.9rem" }}>
                                        {new Date(admint.sign_up_date).toLocaleDateString()}
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            {editingId === admint.id ? (
                                                <>
                                                    <button className="btn btn-sm btn-success" onClick={() => handleQuickUpdate(admint.id)}>Save</button>
                                                    <button className="btn btn-sm btn-light" onClick={() => setEditingId(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setEditingId(admint.id);
                                                            setEditEmail(admint.email);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(admint.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdmintsList;