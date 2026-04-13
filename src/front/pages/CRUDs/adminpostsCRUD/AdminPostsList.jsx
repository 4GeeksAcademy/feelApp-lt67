import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AdminsPostsList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_admint_posts", payload: data }));
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ fontWeight: "600" }}>Admin Posts</h2>
            </div>
            <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: "15px" }}>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "60px" }}>ID</th>
                            <th style={{ width: "80px" }}>Admin ID</th>
                            <th>Title</th>
                            <th>Text</th>
                            <th style={{ width: "80px" }}>Image</th>
                            <th style={{ width: "120px" }}>Date</th>
                            <th style={{ width: "100px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.admint_posts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-4">No posts yet</td>
                            </tr>
                        ) : (
                            store.admint_posts.map(post => (
                                <tr key={post.id}>
                                    <td style={{ fontWeight: "500" }}>{post.id}</td>
                                    <td>{post.admint_id}</td>
                                    <td>{post.title}</td>
                                    <td>{post.text}</td>
                                    <td>
                                        {post.img_url
                                            ? <img src={post.img_url} alt="post" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                                            : <span className="text-muted">—</span>
                                        }
                                    </td>
                                    <td>{new Date(post.date).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/admint-posts/${post.id}`} className="btn btn-outline-secondary btn-sm">
                                            Details
                                        </Link>
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