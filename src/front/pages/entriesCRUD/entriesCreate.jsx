import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EntriesCreate = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!store.clientToken) navigate("/");
    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then(resp => resp.json())
        .then(data => dispatch({ type: "set_emotions", payload: data }));
    }
  }, []);

  const selectedEmotion = store.emotions.find(em => em.id === parseInt(emotionId));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.clientToken}`
      },
      body: JSON.stringify({
        title,
        description,
        date: new Date().toISOString().split("T")[0],
        emotion_id: parseInt(emotionId)
      })
    });
    const data = await resp.json();
    if (!resp.ok) { setError(data.error); return; }
    dispatch({ type: "set_entries", payload: [...store.entries, data] });
    navigate("/entries");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "550px" }}>
      <h2 className="text-center fw-semibold mb-4">New Entry</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleCreate}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">How are you feeling?</label>
          <select
            className="form-select"
            value={emotionId}
            onChange={e => setEmotionId(e.target.value)}
            required
          >
            <option value="">Select emotion</option>
            {store.emotions.map(em => (
              <option key={em.id} value={em.id}>{em.emoji} {em.name}</option>
            ))}
          </select>
        </div>
        <div
          className="mb-3 p-3 rounded-3"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <textarea
            className="form-control border-0"
            rows="6"
            placeholder="Write about your day..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ background: "transparent", resize: "none" }}
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary w-100">Save Entry</button>
          <Link to="/entries" className="btn btn-outline-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
};
export default EntriesCreate;
