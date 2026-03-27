import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EntriesDetails = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`)
      .then(resp => resp.json())
      .then(data => setEntry(data));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete entry?")) return;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`, {
      method: "DELETE"
    });

    dispatch({
      type: "set_entries",
      payload: store.entries.filter(e => e.id !== parseInt(id))
    });

    navigate("/entries");
  };

  if (!entry) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Entry Details</h2>

      <p><strong>ID:</strong> {entry.id}</p>
      <p><strong>Client:</strong> {entry.client_id}</p>
      <p><strong>Title:</strong> {entry.title}</p>
      <p><strong>Description:</strong> {entry.description}</p>
      <p><strong>Date:</strong> {entry.date}</p>
      <p><strong>Emotion:</strong> {entry.emotion_id}</p>

      <Link to={`/entries/${id}/edit`} className="btn btn-primary">Edit</Link>
      <button onClick={handleDelete} className="btn btn-danger ms-2">Delete</button>
      <Link to="/entries" className="btn btn-secondary ms-2">Back</Link>
    </div>
  );
};

export default EntriesDetails;