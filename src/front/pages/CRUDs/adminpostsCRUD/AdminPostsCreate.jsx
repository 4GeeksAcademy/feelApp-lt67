import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AdminsPostsCreate = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [admintId, setAdmintId] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [error, setError] = useState("");

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
        navigate("/admint-posts");
    };

    return (
        <div className="container" style={{marginTop:"100px"}}>
            <h2>Create Post</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleCreate}>
                <div className="mb-3">
                    <label className="form-label">Admin ID</label>
                    <select
                        className="form-select"
                        value={admintId}
                        onChange={e => setAdmintId(e.target.value)}
                        required
                    >
                        <option value="">Select an admin</option>
                        {store.admints?.map((admint) => (
                            <option key={admint.id} value={admint.id}>
                                {admint.name || `Admin ${admint.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Text</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Image URL (optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={imgUrl}
                        onChange={e => setImgUrl(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Create</button>
                <Link to="/admint-posts" className="btn btn-secondary ms-2">Back</Link>
            </form>
        </div>
    );
};

export default AdminsPostsCreate;