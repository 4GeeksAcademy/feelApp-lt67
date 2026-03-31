import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AccessClientUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [form, setForm] = useState({
    client_id: "",
    shared_with_id: "",
    status: ""
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients/${id}`)
      .then(res => res.json())
      .then(data => setForm(data));
  }, [id]);

  const handleUpdate = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: form.status })
    })
      .then(res => res.json())
      .then(updatedItem => {
        const updatedList = store.access_clients.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );

        dispatch({
          type: "set_access_clients",
          payload: updatedList
        });

        navigate("/access-clients");
      });
  };

  return (
    <div className="container mt-4">
      <h2>Edit Status</h2>

      <p><strong>Requester:</strong> {form.client_id}</p>
      <p><strong>Target:</strong> {form.shared_with_id}</p>

      <select
        className="form-select"
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      </select>

      <button
        className="btn btn-success mt-2"
        style={{ width: "auto" }}
        onClick={handleUpdate}
      >
        Update
      </button>
    </div>
  );
};

export default AccessClientUpdate;