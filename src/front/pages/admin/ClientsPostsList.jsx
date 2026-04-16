import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CLientsPostsList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!store.admintToken) {
      navigate("/");
      return;
    }

    const fetchPosts = async () => {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts`, {
        headers: { Authorization: `Bearer ${store.admintToken}` }
      });
      const data = await resp.json();
      if (resp.ok) {
        dispatch({
          type: "set_clients_posts",
          payload: Array.isArray(data) ? data : []
        });
      }
    };
    fetchPosts();
  }, [dispatch, store.admintToken, navigate]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${store.admintToken}` }
    });
    if (resp.ok) dispatch({ type: "remove_client_post", payload: id });
  };

  const posts = Array.isArray(store.clients_posts) ? store.clients_posts : [];

  return (
    <div className="container" style={{ marginTop: "120px", width: "1000px", marginBottom: "50px" }}>
      <div className="d-flex justify-content-between align-items-end mb-4 mt-5">
        <div>
          <h2 style={{ fontWeight: "700", marginBottom: "5px" }}>Clients Community Posts</h2>
          <p className="text-muted mb-0 small">Monitoring content shared by app users</p>
        </div>
      </div>

      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #dee2e6",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        padding: "25px"
      }}>
        <table className="table align-middle">
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th style={{ width: "200px" }}>Client</th>
              <th style={{ width: "200px" }}>Title</th>
              <th>Content Preview</th>
              <th style={{ width: "120px" }}>Date</th>
              <th className="text-end" style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-5 text-muted italic">No entries found</td></tr>
            ) : (
              posts.map(post => (
                <tr key={post.id}>
                  <td><span className="fw-medium text-primary small">{post.client_email || `ID: ${post.client_id}`}</span></td>
                  <td><span className="fw-bold">{post.title}</span></td>
                  <td>
                    <div className="text-truncate text-muted small" style={{ maxWidth: "250px" }}>
                      {post.text}
                    </div>
                  </td>
                  <td className="text-muted small">{post.date ? new Date(post.date).toLocaleDateString() : "—"}</td>
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-dark me-2" 
                      onClick={() => setSelectedPost(post)}
                      data-bs-toggle="modal" 
                      data-bs-target="#postModal"
                    >
                      View Full
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="postModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: "16px", border: "none" }}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">{selectedPost?.title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body py-4">
              <p className="text-muted mb-3" style={{ fontSize: "0.8rem" }}>
                By: <strong>{selectedPost?.client_email}</strong> • {selectedPost?.date && new Date(selectedPost.date).toLocaleDateString()}
              </p>
              <div style={{ whiteSpace: "pre-wrap", color: "#444", lineHeight: "1.6" }}>
                {selectedPost?.text}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-dark rounded-pill px-4" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLientsPostsList;