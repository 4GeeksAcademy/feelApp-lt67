import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CLientsPostsList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

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
    if (!confirm("Delete?")) return;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${store.admintToken}` }
    });

    dispatch({ type: "remove_client_post", payload: id });
  };

  const posts = Array.isArray(store.clients_posts) ? store.clients_posts : [];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h2>Clients Posts</h2>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Title</th>
            <th>Text</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No entries found</td></tr>
          ) : (
            posts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.client_id}</td>
                <td>{post.title}</td>
                <td>{post.text}</td>
                <td>{post.date}</td>
                <td>
                  <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CLientsPostsList;