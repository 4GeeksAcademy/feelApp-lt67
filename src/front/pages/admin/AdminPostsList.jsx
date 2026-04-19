import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AdminsPostsList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const posts = store.admint_posts || [];
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editText, setEditText] = useState("");

    useEffect(() => {
        if (!store.admintToken) navigate("/");
    }, [store.admintToken, navigate]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`, {
            headers: { Authorization: `Bearer ${store.admintToken}` }
        })
            .then(resp => resp.json())
            .then(data => {
                if (Array.isArray(data)) dispatch({ type: "set_admint_posts", payload: data });
            });
    }, [dispatch, store.admintToken]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${store.admintToken}` }
        });

        if (resp.ok) {
            dispatch({
                type: "set_admint_posts",
                payload: posts.filter(p => p.id !== id)
            });
        }
    };

    const handleSaveUpdate = async (id) => {
        const body = {
            title: editTitle,
            text: editText
        };

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.admintToken}`
            },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            const updatedPost = await resp.json();
            dispatch({
                type: "set_admint_posts",
                payload: posts.map(p => p.id === id ? updatedPost : p)
            });
            setEditingId(null);
        }
    };

    const startEditing = (post) => {
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditText(post.text);
    };

    return (
        <div className="container" style={{ marginTop: "80px", width: "1000px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                <div>
                    <h2 className="mt-5" style={{ fontWeight: "700", marginBottom: "0" }}>Admin Posts</h2>
                    <small className="text-muted">Manage blog posts and announcements</small>
                </div>
                <Link to="/admint-posts/create" className="btn btn-dark">
                    + New Post
                </Link>
            </div>

            <div style={{
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "20px"
            }}>
                <table className="table align-middle">
                    <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                            <th style={{ width: "200px" }}>Title</th>
                            <th>Content Preview</th>
                            <th style={{ width: "120px" }}>Date</th>
                            <th className="text-end" style={{ width: "180px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">No posts found</td>
                            </tr>
                        ) : (
                            posts.map(post => (
                                <tr key={post.id}>
                                    <td>
                                        {editingId === post.id ? (
                                            <input
                                                className="form-control form-control-sm"
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                            />
                                        ) : (
                                            <span className="fw-bold">{post.title}</span>
                                        )}
                                    </td>
                                    <td style={{ maxWidth: "300px" }}>
                                        {editingId === post.id ? (
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="2"
                                                value={editText}
                                                onChange={e => setEditText(e.target.value)}
                                            />
                                        ) : (
                                            <div className="text-truncate text-muted" style={{ fontSize: "0.9rem" }}>
                                                {post.text}
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-muted" style={{ fontSize: "0.85rem" }}>
                                        {new Date(post.date).toLocaleDateString()}
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            {editingId === post.id ? (
                                                <>
                                                    <button className="btn btn-sm btn-success px-3" onClick={() => handleSaveUpdate(post.id)}>Save</button>
                                                    <button className="btn btn-sm btn-light px-3" onClick={() => setEditingId(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary px-3"
                                                        onClick={() => startEditing(post)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger px-3"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
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

export default AdminsPostsList;