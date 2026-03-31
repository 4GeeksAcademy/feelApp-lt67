import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AccessClientCreate = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [form, setForm] = useState({
    client_id: "",
    shared_with_id: "",
    status: "pending"
  });

  useEffect(() => {
    if (store.clients.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
        .then(res => res.json())
        .then(data =>
          dispatch({ type: "set_clients", payload: data })
        );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: Number(form.client_id),
        shared_with_id: Number(form.shared_with_id),
        status: form.status
      })
    })
      .then(res => res.json())
      .then(newItem => {
        dispatch({
          type: "set_access_clients",
          payload: [...store.access_clients, newItem]
        });

        navigate("/access-clients");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Create Access</h2>

      <form onSubmit={handleSubmit}>

        <select
          className="form-select mb-2"
          value={form.client_id}
          onChange={(e) =>
            setForm({ ...form, client_id: e.target.value })
          }
        >
          <option value="">Select requester</option>
          {store.clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name || `Client ${client.id}`}
            </option>
          ))}
        </select>

        <select
          className="form-select mb-2"
          value={form.shared_with_id}
          onChange={(e) =>
            setForm({ ...form, shared_with_id: e.target.value })
          }
        >
          <option value="">Select target</option>
          {store.clients
            .filter(c => c.id !== Number(form.client_id))
            .map(client => (
              <option key={client.id} value={client.id}>
                {client.name || `Client ${client.id}`}
              </option>
          ))}
        </select>

        <button className="btn btn-primary mt-2">Create</button>
      </form>
    </div>
  );
};

export default AccessClientCreate;