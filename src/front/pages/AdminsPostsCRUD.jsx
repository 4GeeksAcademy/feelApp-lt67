import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const AdminsPostsCRUD = () => {
    const { store, dispatch } = useGlobalReducer();

    const [admintId, setAdmintId] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editText, setEditText] = useState("");
    const [editImgUrl, setEditImgUrl] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_admint_posts", payload: data }));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admint_id: parseInt(admintId), title, text, img_url: imgUrl || null })
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({ type: "set_admint_posts", payload: [...store.admint_posts, data] });
        setAdmintId("");
        setTitle("");
        setText("");
        setImgUrl("");
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditText(post.text);
        setEditImgUrl(post.img_url || "");
    };

    const handleUpdate = async (id) => {
        setError("");
        const body = {};
        if (editTitle) body.title = editTitle;
        if (editText) body.text = editText;
        if (editImgUrl) body.img_url = editImgUrl;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (!resp.ok) { setError(data.error); return; }
        dispatch({
            type: "set_admint_posts",
            payload: store.admint_posts.map(p => p.id === id ? data : p)
        });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return;
        dispatch({
            type: "set_admint_posts",
            payload: store.admint_posts.filter(p => p.id !== id)
        });
    };

    return (
        <div className="container mt-4">
            <h2>Admin Posts</h2>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Create post</h5>
                    <form onSubmit={handleCreate} className="row g-2">
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Admin ID"
                                value={admintId}
                                onChange={e => setAdmintId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Text"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Image URL (optional)"
                                value={imgUrl}
                                onChange={e => setImgUrl(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Admin ID</th>
                        <th>Title</th>
                        <th>Text</th>
                        <th>Image</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.admint_posts.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">
                                No posts yet
                            </td>
                        </tr>
                    ) : (
                        store.admint_posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.admint_id}</td>
                                <td>
                                    {editingId === post.id ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                        />
                                    ) : (
                                        post.title
                                    )}
                                </td>
                                <td>
                                    {editingId === post.id ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                        />
                                    ) : (
                                        post.text
                                    )}
                                </td>
                                <td>
                                    {editingId === post.id ? (
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Image URL"
                                            value={editImgUrl}
                                            onChange={e => setEditImgUrl(e.target.value)}
                                        />
                                    ) : (
                                        post.img_url
                                            ? <img src={post.img_url} alt="post" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                                            : <span className="text-muted">No image</span>
                                    )}
                                </td>
                                <td>{new Date(post.date).toLocaleDateString()}</td>
                                <td>
                                    {editingId === post.id ? (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleUpdate(post.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(post)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminsPostsCRUD;