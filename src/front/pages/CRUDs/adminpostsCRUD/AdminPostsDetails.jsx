import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AdminsPostsDetails = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts/${id}`)
            .then(resp => resp.json())
            .then(data => setPost(data));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Delete post?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return;
        dispatch({
            type: "set_admint_posts",
            payload: store.admint_posts.filter(p => p.id !== parseInt(id))
        });
        navigate("/admint-posts");
    };

    if (!post) return <p className="container mt-4">Loading...</p>;

    return (
        <div className="container mt-5">
            <h2 className="mt-80 bg-gray-200 p-4">Post Details</h2>
            <p><strong>ID:</strong> {post.id}</p>
            <p><strong>Admin ID:</strong> {post.admint_id}</p>
            <p><strong>Title:</strong> {post.title}</p>
            <p><strong>Text:</strong> {post.text}</p>
            <p><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
            {post.img_url && (
                <p>
                    <strong>Image:</strong><br />
                    <img src={post.img_url} alt="post" style={{ width: "200px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />
                </p>
            )}
            <Link to={`/admint-posts/${id}/edit`} className="btn btn-primary">Edit</Link>
            <button onClick={handleDelete} className="btn btn-outline-danger ms-2">Delete</button>
            <Link to="/admint-posts" className="btn btn-secondary ms-2">Back</Link>
        </div>
    );
};

export default AdminsPostsDetails;