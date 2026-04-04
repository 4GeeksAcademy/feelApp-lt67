import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CLientsPostsList = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const fetchPosts = async () => {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts`);
      const data = await resp.json();
      if (resp.ok) {
        dispatch({ 
          type: "set_clients_posts", 
          payload: Array.isArray(data) ? data : [] 
        });
      }
    };
    fetchPosts();
  }, [dispatch]);

  const posts = Array.isArray(store.clients_posts) ? store.clients_posts : [];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h2>Clients Posts</h2>
        <Link to="/clients-posts/create" className="btn btn-primary">New Post</Link>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Title</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No entries found</td></tr>
          ) : (
            posts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.client_id}</td>
                <td>{post.title}</td>
                <td>{post.date}</td>
                <td>
                  <Link to={`/clients-posts/${post.id}`} className="btn btn-sm btn-outline-dark">
                    View ID: {post.id}
                  </Link>
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