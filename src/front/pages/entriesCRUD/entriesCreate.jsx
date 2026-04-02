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
    if (!store.clientToken) {
      navigate("/");
      return;
    }
    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then(resp => resp.json())
        .then(data => dispatch({ type: "set_emotions", payload: data }))
        .catch(err => console.error("Error fetching emotions:", err));
    }
  }, [store.clientToken, store.emotions.length, navigate, dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
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
      if (!resp.ok) { setError(data.error || "Error creating entry"); return; }
      
      dispatch({ type: "set_entries", payload: [...store.entries, data] });
      navigate("/entries");
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "85vh", padding: "20px" }}>
      <div style={{ background: "#ffffff", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "550px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #edf2f7" }}>
        <h2 className="text-center fw-bold mb-4">New Entry</h2>
        {error && <div className="alert alert-danger border-0 text-center" style={{ borderRadius: "12px" }}>{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input className="form-control border-0 p-3" style={{ backgroundColor: "#f9fafb", borderRadius: "12px" }} value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">How are you feeling?</label>
            <select className="form-select border-0 p-3" style={{ backgroundColor: "#f9fafb", borderRadius: "12px" }} value={emotionId} onChange={e => setEmotionId(e.target.value)} required>
              <option value="">Select emotion</option>
              {store.emotions.map(em => (
                <option key={em.id} value={em.id}>{em.emoji} {em.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Description</label>
            <textarea className="form-control border-0 p-3" rows="5" placeholder="Write about your day..." value={description} onChange={e => setDescription(e.target.value)} style={{ backgroundColor: "#f9fafb", borderRadius: "15px", resize: "none" }} required />
          </div>
          <div className="d-flex gap-2">
            <button className="btn w-100 py-3 fw-bold" style={{ backgroundColor: "#6366f1", color: "white", borderRadius: "12px" }}>Save Entry</button>
            <Link to="/entries" className="btn btn-light py-3 px-4 fw-semibold" style={{ borderRadius: "12px" }}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EntriesCreate;

