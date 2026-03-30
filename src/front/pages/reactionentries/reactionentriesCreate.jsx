import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ReactionEntriesCreate = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const [form, setForm] = useState({
    client_id: "",
    entries_id: "",
    reaction: ""
  });

  // 🔥 TRAER CLIENTS Y ENTRIES
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`)
      .then(res => res.json())
      .then(data => dispatch({ type: "set_clients", payload: data }));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`)
      .then(res => res.json())
      .then(data => dispatch({ type: "set_entries", payload: data }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => navigate("/reaction-entries"));
  };

  return (
    <div className="container mt-4">
      <h2>Create Reaction</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Client</label>
          <select
            className="form-select"
            value={form.client_id}
            onChange={(e) =>
              setForm({ ...form, client_id: e.target.value })
            }
            required
          >
            <option value="">Select client</option>

            {store.clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.email || `Client ${client.id}`}
              </option>
            ))}
          </select>
        </div>

   
        <div className="mb-3">
          <label className="form-label">Entry</label>
          <select
            className="form-select"
            value={form.entries_id}
            onChange={(e) =>
              setForm({ ...form, entries_id: e.target.value })
            }
            required
          >
            <option value="">Select entry</option>

            {store.entries?.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title || `Entry ${entry.id}`}
              </option>
            ))}
          </select>
        </div>

       
        <div className="mb-3">
          <label className="form-label">Reaction</label>
          <select
            className="form-select"
            value={form.reaction}
            onChange={(e) =>
              setForm({ ...form, reaction: e.target.value })
            }
            required
          >
            <option value="">Select reaction</option>
            <option value="👍">👍</option>
            <option value="❤️">❤️</option>
            <option value="🔥">🔥</option>
            <option value="👏">👏</option>
            <option value="💡">💡</option>
          </select>
        </div>

        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};

export default ReactionEntriesCreate;