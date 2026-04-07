import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import Form from "../../../components/Form";

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
      
      if (!resp.ok) { 
        setError(data.error || "Error creating entry"); 
        return; 
      }
    
      dispatch({ type: "add_entry", payload: data });
      
      navigate("/entries");
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <Form 
      title="New Entry" 
      error={error}
      onSubmit={handleCreate}
      buttonText="Save Entry"
      cancelPath="/entries"
    >
      <div className="mb-3">
        <label className="form-label small fw-bold ps-1">Title</label>
        <input 
            className="form-control border-0 p-3 shadow-sm" 
            style={{ backgroundColor: "#f9fafb", borderRadius: "14px" }} 
            placeholder="Give it a name..."
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold ps-1">How are you feeling?</label>
        <select 
            className="form-select border-0 p-3 shadow-sm" 
            style={{ backgroundColor: "#f9fafb", borderRadius: "14px", cursor: "pointer" }} 
            value={emotionId} 
            onChange={e => setEmotionId(e.target.value)} 
            required
        >
          <option value="">Select an emotion...</option>
          {store.emotions.map(em => (
            <option key={em.id} value={em.id}>{em.emoji} {em.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label small fw-bold ps-1">Description</label>
        <textarea 
            className="form-control border-0 p-3 shadow-sm" 
            rows="4" 
            placeholder="What's on your mind?" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            style={{ backgroundColor: "#f9fafb", borderRadius: "16px", resize: "none" }} 
            required 
        />
      </div>
    </Form>
  );
};

export default EntriesCreate;
