import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AccessCoachList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.coachToken && !store.admintToken) {
            navigate("/");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
            headers: { Authorization: `Bearer ${store.coachToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    dispatch({ type: "set_access_coach", payload: data });
                }
            });
    }, [store.coachToken, store.admintToken, dispatch, navigate]);

    const approvedClients = store.access_coach?.filter(item =>
        item.status.toLowerCase() === "approved"
    ) || [];

    return (
        <div className="container" style={{ paddingTop: "80px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 className="mt-5 fw-normal" style={{ color: "#1e293b" }}>My Clients</h2>

            <div className="card shadow-sm border-0 mt-4" style={{ overflow: "hidden" }}>
                <table className="table align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Client Email</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedClients.length > 0 ? (
                            approvedClients.map(item => (
                                <tr key={item.id}>
                                    <td className="ps-4 fw-medium" style={{ color: "#475569" }}>
                                        {item.client_email}
                                    </td>
                                    <td>
                                        <span className="text-success small fw-bold">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-secondary border-dark"
                                                onClick={() => navigate(`/entries/friend/${item.client_id}`)}
                                            >
                                                Entries
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary border-dark"
                                                onClick={() => navigate(`/stats/${item.client_id}`)}
                                            >
                                                Stats
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-5 text-muted">
                                    No approved clients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};