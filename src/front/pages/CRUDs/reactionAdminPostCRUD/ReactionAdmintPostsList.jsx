import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ReactionAdmintPostsList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts`)
            .then(r => r.json())
            .then(data => dispatch({ 
                type: "set_reactions", 
                payload: Array.isArray(data) ? data : [] 
            }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(r => r.json())
            .then(data => dispatch({ 
                type: "set_clients", 
                payload: Array.isArray(data) ? data : [] 
            }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`)
            .then(r => r.json())
            .then(data => dispatch({ 
                type: "set_admint_posts", 
                payload: Array.isArray(data) ? data : [] 
            }));
    }, []);

    const reactions = Array.isArray(store.reactions)     ? store.reactions     : [];
    const clients   = Array.isArray(store.clients)       ? store.clients       : [];
    const posts     = Array.isArray(store.admint_posts)  ? store.admint_posts  : [];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3 mt-5 mt-80 bg-gray-200 p-4">
                <h2>Reactions</h2>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Post</th>
                        <th>Reaction</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {reactions.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No reactions yet</td>
                        </tr>
                    ) : (
                        reactions.map(r => {
                            const client = clients.find(c => c.id === r.client_id);
                            const post   = posts.find(p => p.id === r.admint_post_id);
                            return (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{client?.email || "N/A"}</td>
                                    <td>{post?.title   || "N/A"}</td>
                                    <td style={{ fontSize: "1.5rem" }}>{r.reaction}</td>
                                    <td>
                                        <Link 
                                            to={`/reactions/${r.id}/edit`} 
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={async () => {
                                                if (!confirm("Delete reaction?")) return;
                                                const resp = await fetch(
                                                    `${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts/${r.id}`,
                                                    { method: "DELETE" }
                                                );
                                                if (!resp.ok) return;
                                                dispatch({
                                                    type: "set_reactions",
                                                    payload: reactions.filter(x => x.id !== r.id)
                                                });
                                            }}
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReactionAdmintPostsList;
