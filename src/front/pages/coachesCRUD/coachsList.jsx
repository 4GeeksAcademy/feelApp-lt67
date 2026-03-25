import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CoachsList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_coachs", payload: data }));
    }, []);

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ fontWeight: "600" }}>Coachs</h2>
                <Link to="/coachs/create" className="btn btn-primary">
                    Create Coach
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
                        {store.coachs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">
                                    No coachs yet
                                </td>
                            </tr>
                        ) : (
                            store.coachs.map(coach => (
                                <tr key={coach.id}>
                                    <td style={{ fontWeight: "500" }}>{coach.id}</td>
                                    <td>{coach.email}</td>
                                    <td>
                                        {new Date(coach.sign_up_date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/coachs/${coach.id}`}
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

export default CoachsList;