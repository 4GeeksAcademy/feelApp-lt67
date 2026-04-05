import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import Form from "../../../components/Form"; 

const EntriesUpdate = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!store.clientToken) { navigate("/"); return; }
    
    const entryToEdit = store.entries.find(e => e.id === parseInt(id));
    if (entryToEdit) {
      setTitle(entryToEdit.title);
      setDescription(entryToEdit.description);
      setEmotionId(entryToEdit.emotion_id.toString());
    }
  }, [id, store.entries, store.clientToken, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.clientToken}`
        },
        body: JSON.stringify({ title, description, emotion_id: parseInt(emotionId) })
      });
      
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || "Error updating entry"); return; }
      
      const updatedEntries = store.entries.map(e => e.id === parseInt(id) ? data : e);
      dispatch({ type: "set_entries", payload: updatedEntries });
      navigate("/entries");
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <Form 
      title="Edit Entry" 
      error={error}
      onSubmit={handleUpdate}
      buttonText="Update Entry"
      cancelPath="/entries"
    >
      <div className="mb-3">
        <label className="form-label small fw-bold ps-1">Title</label>
        <input 
            className="form-control border-0 p-3 shadow-sm" 
            style={{ backgroundColor: "#f9fafb", borderRadius: "14px" }} 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold ps-1">Emotion</label>
        <select 
            className="form-select border-0 p-3 shadow-sm" 
            style={{ backgroundColor: "#f9fafb", borderRadius: "14px", cursor: "pointer" }} 
            value={emotionId} 
            onChange={e => setEmotionId(e.target.value)} 
            required
        >
          {store.emotions.map(em => (
            <option key={em.id} value={em.id}>{em.emoji} {em.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label small fw-bold ps-1">Description</label>
        <textarea 
            className="form-control border-0 p-3 shadow-sm" 
            rows="5" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            style={{ backgroundColor: "#f9fafb", borderRadius: "16px", resize: "none" }} 
            required 
        />
      </div>
    </Form>
  );
};

export default EntriesUpdate;