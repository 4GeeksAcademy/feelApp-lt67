import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const CoachFavoritesCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [coachId, setCoachId] = useState("");
    const [entryId, setEntryId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (store.coachs.length === 0) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`)
                .then(resp => resp.json())
                .then(data => dispatch({ type: "set_coachs", payload: data }));
        }
        if (store.entries.length === 0) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`)
                .then(resp => resp.json())
                .then(data => dispatch({ type: "set_entries", payload: data }));
        }
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coach-favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coach_id: parseInt(coachId), entry_id: parseInt(entryId) })
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({ type: "set_coach_favorites", payload: [...store.coach_favorites, data] });
        navigate("/coach-favorites");
    };

    return (
        <div className="container mt-4">
            <h2>Add Favorite</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleCreate}>
                <div className="mb-3">
                    <label className="form-label">Coach</label>
                    <select
                        className="form-select"
                        value={coachId}
                        onChange={e => setCoachId(e.target.value)}
                        required
                    >
                        <option value="">Select a coach...</option>
                        {store.coachs.map(coach => (
                            <option key={coach.id} value={coach.id}>
                                {coach.id} — {coach.email}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Entry</label>
                    <select
                        className="form-select"
                        value={entryId}
                        onChange={e => setEntryId(e.target.value)}
                        required
                    >
                        <option value="">Select an entry...</option>
                        {store.entries.map(entry => (
                            <option key={entry.id} value={entry.id}>
                                {entry.id} — {entry.title}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-primary">Add</button>
                <Link to="/coach-favorites" className="btn btn-secondary ms-2">Back</Link>
            </form>
        </div>
    );
};

export default CoachFavoritesCreate;