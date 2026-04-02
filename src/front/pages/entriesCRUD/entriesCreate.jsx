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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.clientToken}`
      },
      body: JSON.stringify({
        title,
        description,
        date: new Date().toISOString().split("T")[0], 
        emotion_id: parseInt(emotionId),
      })
    });

    const data = await resp.json();
    console.log(data);
    console.log("TOKEN:", store.clientToken);

    if (!resp.ok) {
      setError(data.error || "Error creating entry");
      return;
    }

    dispatch({
      type: "set_entries",
      payload: [...store.entries, data]
    });

    navigate("/entries");
  };

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  return (
    <div className="container mt-4">
      <h2>Create Entry</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleCreate}>       
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        
        <div className="mb-3">
          <label>Emotion</label>
          <select className="form-select" value={emotionId} onChange={e => setEmotionId(e.target.value)} required>
            <option value="">Select emotion</option>
            {store.emotions.map(e => (
              <option key={e.id} value={e.id}>{e.name || e.id}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" type="submit">Create</button>
        <Link to="/entries" className="btn btn-secondary ms-2">Back</Link>
      </form>
    </div>
  );
};

export default EntriesCreate;
