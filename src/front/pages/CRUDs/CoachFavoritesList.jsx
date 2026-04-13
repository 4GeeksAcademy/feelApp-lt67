import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CoachFavoritesList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coach-favorites`)
    .then(resp => resp.json())
    .then(data => dispatch({ type: "set_coach_favorites", payload: Array.isArray(data) ? data : []}))
    .catch(err => console.error("Error fetching favorites:", err));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Remove this favorite?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coach-favorites/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) {
        const data = await resp.json();
        alert(data.error || "Error removing favorite");
        return;
    }
        dispatch({
            type: "set_coach_favorites",
            payload: store.coach_favorites.filter(f => f.id !== id)
        });
    };

    return (
        <div className="container" style={{ maxWidth: "680px", paddingTop: "80px"}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mt-5" style={{ fontWeight: "600" }}>Favorites</h2>
            </div>
            <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: "15px" }}>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "60px" }}>ID</th>
                            <th>Coach</th>
                            <th>Entry</th>
                            <th style={{ width: "100px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.coach_favorites.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted py-4">No favorites yet</td>
                            </tr>
                        ) : (
                            store.coach_favorites.map(fav => (
                                <tr key={fav.id}>
                                    <td style={{ fontWeight: "500" }}>{fav.id}</td>
                                    <td>
                                        {store.coachs.find(c => c.id === fav.coach_id)?.email || fav.coach_id}
                                    </td>
                                    <td>
                                        {store.entries.find(e => e.id === fav.entry_id)?.title || fav.entry_id}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(fav.id)}
                                        >
                                            Remove
                                        </button>
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

export default CoachFavoritesList;