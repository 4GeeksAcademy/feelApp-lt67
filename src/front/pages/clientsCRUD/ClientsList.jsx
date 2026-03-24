import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ClientsList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_clients", payload: data }));
    }, []);

    return (
        <div className="clients-page container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Clients</h2>
                <Link to="/clients/create" className="btn btn-lila">
                    Create Client
                </Link>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Sign up date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.clients.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No clients yet
                                </td>
                            </tr>
                        ) : (
                            store.clients.map(client => (
                                <tr key={client.id}>
                                    <td>{client.id}</td>
                                    <td>{client.email}</td>
                                    <td>{new Date(client.sign_up_date).toLocaleDateString()}</td>
                                    <td>
                                        <Link
                                            to={`/clients/${client.id}`}
                                            className="btn btn-light btn-sm"
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