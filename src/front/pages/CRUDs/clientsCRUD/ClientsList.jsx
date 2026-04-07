import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ClientsList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_clients", payload: data }));
    }, []);

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                <h2 style={{ fontWeight: "600" }}>Clients</h2>
                <Link to="/clients/create" className="btn btn-primary">
                    Create Client
                </Link>
            </div>

            <div style={{
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                padding: "15px"
            }}>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "80px" }}>ID</th>
                            <th>Email</th>
                            <th style={{ width: "180px" }}>Sign up date</th>
                            <th style={{ width: "120px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.clients.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    No clients yet
                                </td>
                            </tr>
                        ) : (
                            store.clients.map(client => (
                                <tr key={client.id}>
                                    <td style={{ fontWeight: "500" }}>{client.id}</td>
                                    <td>{client.email}</td>
                                    <td>
                                        {new Date(client.sign_up_date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/clients/${client.id}`}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Details
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

export default ClientsList;