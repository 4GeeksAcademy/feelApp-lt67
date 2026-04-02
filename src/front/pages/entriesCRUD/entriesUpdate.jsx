import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EntriesUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    emotion_id: ""
  });

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`)
      .then(resp => resp.json())
      .then(data => setForm(data));
    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then(resp => resp.json())
        .then(data => dispatch({ type: "set_emotions", payload: data }));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    navigate("/entries");
  };

  const selectedEmotion = store.emotions.find(em => em.id === parseInt(form.emotion_id));

  return (
    <div className="container mt-4 p-4 rounded" style={{ backgroundColor: selectedEmotion?.color || "transparent" }}>
      <h2>Update Entry</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mb-3">
          <label>Emotion</label>
          <select className="form-select" value={form.emotion_id} onChange={e => setForm({ ...form, emotion_id: e.target.value })}>
            <option value="">Select emotion</option>
            {store.emotions.map(em => (
              <option key={em.id} value={em.id}>{em.emoji} {em.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary">Update</button>
        <Link to="/entries" className="btn btn-secondary ms-2">Back</Link>
      </form>
    </div>
  );
};
export default EntriesUpdate;