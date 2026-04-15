import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AdmintsList = () => {
    const { store, dispatch } = useGlobalReducer();

    const admints = store.admints || [];

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admints`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_admints", payload: data }));
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 style={{ fontWeight: "700", marginBottom: "0", marginTop: "80px"}}>Admins</h2>
                    <small className="text-muted">Manage your admin users</small>
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
                            <th style={{ width: "80px" }}>ID</th>
                            <th>Email</th>
                            <th style={{ width: "120px" }}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {admints.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-5">
                                    <div style={{ opacity: 0.6 }}>
                                        <h5>No admins yet</h5>
                                        <small>Create your first admin</small>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            admints.map(admint => (
                                <tr key={admint.id}>
                                    <td>{admint.id}</td>
                                    <td>{admint.email}</td>
                                    <td>
                                        <Link
                                            to={`/admints/${admint.id}`}
                                            className="btn btn-sm"
                                            style={{
                                                border: "1px solid #dee2e6",
                                                borderRadius: "8px",
                                                padding: "5px 10px"
                                            }}
                                        >
                                            View
                                        </Link>
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