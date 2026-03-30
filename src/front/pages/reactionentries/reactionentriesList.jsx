import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const ReactionEntriesList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_reaction_entries", payload: data }));
    }, []);

    return (
        <div className="container mt-4">
            <h2>Reaction Entries</h2>
            <Link to="/reaction-entries/create" className="btn btn-primary mb-3">
                Create Reaction
            </Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>client_id</th>
                        <th>entries_id</th>
                        <th>Reaction</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.reaction_entries?.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No reactions yet</td>
                        </tr>
                    ) : (
                        store.reaction_entries?.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.client_id}</td>
                                <td>{r.entries_id}</td>
                                <td>{r.reaction}</td>
                                <td>
                                    <Link to={`/reaction-entries/${r.id}`} className="btn btn-sm btn-info me-2">Details</Link>
                                    <Link to={`/reaction-entries/${r.id}/edit`} className="btn btn-sm btn-warning me-2">Edit</Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default ReactionEntriesList;