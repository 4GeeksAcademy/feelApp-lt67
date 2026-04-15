import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ReactionClientPostList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts`)
            .then(r => r.json())
            .then(data => {
                dispatch({
                    type: "set_reaction_client",
                    payload: Array.isArray(data) ? data : []
                });
            });

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(r => r.json())
            .then(data => {
                dispatch({
                    type: "set_clients",
                    payload: Array.isArray(data) ? data : []
                });
            });

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients-posts`)
            .then(r => r.json())
            .then(data => {
                dispatch({
                    type: "set_clients_posts",
                    payload: Array.isArray(data) ? data : []
                });
            });
    }, []);

    const reactions = Array.isArray(store.reaction_client) ? store.reaction_client : [];
    const clients = Array.isArray(store.clients) ? store.clients : [];
    const posts = Array.isArray(store.clients_posts) ? store.clients_posts : [];

    return (
        <div className="container" style={{marginTop:"80px"}}>
            <div className="d-flex justify-content-between mb-3 mt-5">
                <h2 className="mt-80 bg-gray-200 p-4">Reactions</h2>
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
                        reactions.map((r) => {
                            const client = clients.find((c) => c.id === r.client_id);
                            const post = posts.find((p) => p.id === r.client_post_id);

                            return (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{client?.email || "N/A"}</td>
                                    <td>{post?.title || "N/A"}</td>
                                    <td style={{ fontSize: "1.5rem" }}>{r.reaction}</td>
                                    <td>
                                        <Link
                                            to={`/reactions-client/${r.id}/edit`}
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>

                                        <button
                                            onClick={async () => {
                                                if (!confirm("Delete reaction?")) return;
                                                const resp = await fetch(
                                                    `${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts/${r.id}`,
                                                    { method: "DELETE" }
                                                );
                                                if (!resp.ok) return;
                                                dispatch({
                                                    type: "set_reaction_client",
                                                    payload: reactions.filter(x => x.id !== r.id)
                                                });
                                            }}
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            <i className="bi bi-trash"></i>
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

export default ReactionClientPostList;
