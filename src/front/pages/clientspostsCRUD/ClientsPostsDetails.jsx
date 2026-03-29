import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ClientsPostsDetails = () => {
    const { id } = useParams();
    const { store, dispatch } = useGlobalReducer();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`)
            .then(resp => resp.json())
            .then(data => setPost(data));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Delete post?")) return;
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return;
        dispatch({
            type: "set_clients_posts",
            payload: store.clients_posts.filter(p => p.id !== parseInt(id))
        });
        navigate("/clients-posts");
    };

    if (!post) return <p className="container mt-4">Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>Post Details</h2>
            <p><strong>ID:</strong> {post.id}</p>
            <p><strong>Client ID:</strong> {post.client_id}</p>
            <p><strong>Title:</strong> {post.title}</p>
            <p><strong>Text:</strong> {post.text}</p>
            <p><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
            <Link to={`/clients-posts/${id}/edit`} className="btn btn-primary">Edit</Link>
            <button onClick={handleDelete} className="btn btn-outline-danger ms-2">Delete</button>
            <Link to="/clients-posts" className="btn btn-secondary ms-2">Back</Link>
        </div>
    );
};

export default ClientsPostsDetails;