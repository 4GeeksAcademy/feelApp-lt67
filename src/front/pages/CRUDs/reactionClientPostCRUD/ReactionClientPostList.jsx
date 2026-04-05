import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const ReactionClientPostList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts`)
            .then(r => r.json())
            .then(data => dispatch({ type: "set_reaction_client", payload: data }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
            .then(r => r.json())
            .then(data => dispatch({ type: "set_clients", payload: data }));

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts`)
            .then(r => r.json())
            .then(data => dispatch({ type: "set_clients_posts", payload: data }));
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Reactions</h2>
                <Link to="/reactions-client/create" className="btn btn-primary mb-2">
                    Create Reaction
                </Link>
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
                    {store.reaction_client.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No reactions yet</td>
                        </tr>
                    ) : (
                        store.reaction_client.map(r => {
                            const client = store.clients.find(c => c.id === r.client_id);
                            const post = store.clients_posts.find(p => p.id === r.client_post_id);

                            return (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{client?.email}</td>
                                    <td>{post?.title}</td>
                                    <td style={{ fontSize: "1.5rem" }}>{r.reaction}</td>

                                    <td>
                                        <Link 
                                            to={`/reactions-client/${r.id}/edit`} 
                                            className="btn btn-sm btn-outline-primary me-2"
                                        >
                                            Edit
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
                                                payload: store.reaction_client.filter(x => x.id !== r.id)
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

export default ReactionClientPostList;