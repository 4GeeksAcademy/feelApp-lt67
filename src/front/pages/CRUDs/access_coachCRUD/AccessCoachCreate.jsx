import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const AccessCoachCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [status] = useState("pending");

    useEffect(() => {
        if (!store.coachToken) {
            navigate("/");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`, {
            headers: { Authorization: `Bearer ${store.coachToken}` } 
        })
            .then(res => res.json())
            .then(data => dispatch({ type: "set_clients", payload: data }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
            headers: { Authorization: `Bearer ${store.coachToken}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) dispatch({ type: "set_access_coach", payload: data });
            });

    }, [store.coachToken, dispatch, navigate]);

    const filteredClients = store.clients?.filter(c => 
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) return alert("Please select a client from the list");

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.coachToken}` 
                },
                body: JSON.stringify({
                    client_id: selectedClient.id,
                    status: status
                })
            });

            const data = await resp.json();
            if (resp.ok) {
                dispatch({ type: "add_access_coach", payload: data });
                setSearchTerm("");
                setSelectedClient(null);
            } else {
                alert(data.msg || "Error sending request");
            }
        } catch (error) {
            console.error("Error creating access coach:", error);
        }
    };

    return (
        <div className="container" style={{ paddingTop: "100px", maxWidth: "800px" }}>
            <div className="card p-4 shadow-sm mb-5">
                <h2 className="h4 fw-bold mb-4">Request Access</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 position-relative">
                        <label className="form-label small fw-bold">Search Client by Email</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedClient(null);
                            }}
                        />
                        
                        {searchTerm && !selectedClient && (
                            <ul className="list-group position-absolute w-100 shadow-lg" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                                {filteredClients?.map(c => (
                                    <li 
                                        key={c.id} 
                                        className="list-group-item list-group-item-action"
                                        onClick={() => {
                                            setSelectedClient(c);
                                            setSearchTerm(c.email || c.name);
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {c.email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {selectedClient && (
                        <div className="alert alert-info py-2 small">
                            Selected: <strong>{selectedClient.email}</strong>
                        </div>
                    )}

                    <button className="btn btn-primary w-100" disabled={!selectedClient}>
                        Send Request
                    </button>
                </form>
            </div>

            <div className="card p-4 shadow-sm">
                <h2 className="h4 fw-bold mb-4">Current Requests</h2>
                <table className="table align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Client Email</th>
                            <th className="text-end">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.access_coach?.map(item => (
                            <tr key={item.id}>
                                <td>{item.client_email}</td>
                                <td className="text-end">
                                    <span className={`badge ${
                                        item.status === 'approved' ? 'bg-success' : 
                                        item.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!store.access_coach || store.access_coach.length === 0) && (
                            <tr>
                                <td colSpan="2" className="text-center text-muted py-3">No requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};