import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AdminsPostsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!store.admintToken) {
            navigate("/");
        }
    }, [store.admintToken, navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.admintToken}`
            },
            body: JSON.stringify({
                title,
                text
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            setError(data.error || "Error creating post");
            return;
        }

        const currentPosts = store.admint_posts || [];
        dispatch({
            type: "set_admint_posts",
            payload: [...currentPosts, data]
        });

        navigate("/admint-posts");
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", marginTop: "50px" }}>
            <div
                className="bg-white p-5"
                style={{
                    width: "600px",
                    borderRadius: "16px",
                    border: "1px solid #dee2e6",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >
                <div className="text-center mb-4">
                    <h2 style={{ fontWeight: "700" }}>Create New Post</h2>
                </div>

                {error && <div className="alert alert-danger py-2" style={{ fontSize: "0.9rem" }}>{error}</div>}

                <form onSubmit={handleCreate}>
                    <div className="text-start mb-3">
                        <label className="form-label small fw-bold text-muted">Post Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Give your post a title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-start mb-3">
                        <label className="form-label small fw-bold text-muted">Content</label>
                        <textarea
                            className="form-control"
                            rows="6"
                            placeholder="Write the post body..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-dark py-2 rounded-pill">
                            Publish Post
                        </button>
                        <Link to="/admint-posts" className="btn btn-link text-muted text-decoration-none">
                            Cancel and Back
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminsPostsCreate;