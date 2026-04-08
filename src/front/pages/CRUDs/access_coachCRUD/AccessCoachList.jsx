import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const AccessCoachList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.coachToken) {
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
    }, [store.coachToken, dispatch, navigate]); 

    const handleDelete = async (id) => {
        if (!confirm("Delete?")) return;

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${store.coachToken}` }
            });

            if (resp.ok) {
                dispatch({ type: "remove_access_coach", payload: id });
            }
        } catch (error) {
            console.error("Error deleting access coach:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mt-5">Access Coach List</h2>

            <table className="table mt-3">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>-</th>
                    </tr>
                </thead>
                <tbody>
                    {store.access_coach?.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.client_id}</td>
                            <td>{item.status}</td>
                            <td>
                            <button
                            className="btn btn-primary mx-3"
                            onClick={() => navigate(`/entries/friend/${item.client_id}`)}
                             >
                            Ver entries
                        </button>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};