import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AccessClientList = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients`)
      .then(res => res.json())
      .then(data =>
        dispatch({ type: "set_access_clients", payload: data })
      );
  }, []);

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        const updatedList = store.access_clients.filter(
          item => item.id !== id
        );

        dispatch({
          type: "set_access_clients",
          payload: updatedList
        });
      });
  };

  return (
    <div className="container mt-4">
      <h2>Access Requests</h2>

      <Link to="/access-clients/create" className="btn btn-primary mb-3">
        Create
      </Link>

      {store.access_clients.map(item => (
        <div key={item.id} className="card p-2 mb-2">
          <p>Requester: {item.client_id}</p>
          <p>Target: {item.shared_with_id}</p>
          <p>Status: {item.status}</p>

          <div className="d-flex gap-2">
            <Link
              to={`/access-clients/${item.id}`}
              className="btn btn-sm btn-info"
              style={{ width: "auto" }}
            >
              Edit
            </Link>

            <button
              className="btn btn-sm btn-danger"
              style={{ width: "auto" }}
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccessClientList;