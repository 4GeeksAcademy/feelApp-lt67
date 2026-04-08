import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ClientFavoritesList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`)
            .then(resp => resp.json())
            .then(data => {
            const favorites = data.results ?? data.favorites ?? data ?? [];
            dispatch({
            type: "set_favorites",
            payload: Array.isArray(favorites) ? favorites : []
        });
    });
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                <h2 style={{ fontWeight: "600" }}>Favorites</h2>
            </div>
            <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: "15px" }}>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "60px" }}>ID</th>
                            <th>Client</th>
                            <th>Entry</th>
                            <th style={{ width: "100px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.favorites.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">No favorites yet</td>
                            </tr>
                        ) : (
                            store.favorites.map(fav => (
                                <tr key={fav.id}>
                                    <td style={{ fontWeight: "500" }}>{fav.id}</td>
                                    <td>
                                        {store.clients.find(c => c.id === fav.client_id)?.email || fav.client_id}
                                    </td>
                                    <td>
                                        {store.entries.find(e => e.id === fav.entry_id)?.title || fav.entry_id}
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

export default ClientFavoritesList;