import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const FriendEntriesDetails = () => {
  const { clientId, entryId } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${entryId}`)
      .then(r => r.json())
      .then(data => setEntry(data));

    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then(r => r.json())
        .then(data => dispatch({ type: "set_emotions", payload: data }));
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setIsFav(data.some(f => f.entry_id === parseInt(entryId)));
      });
  }, [entryId]);

  const toggleFavorite = async () => {
    if (isFav) {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites/entry/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${store.clientToken}` }
      });
      setIsFav(false);
    } else {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.clientToken}` },
        body: JSON.stringify({ entry_id: parseInt(entryId) })
      });
      setIsFav(true);
    }
  };

  if (!entry) return <p className="text-center mt-5">Loading...</p>;

  const emotion = store.emotions.find(em => em.id === entry.emotion_id);

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <button
        className="btn btn-sm btn-forum-switch rounded-pill px-3 mb-4"
        onClick={() => navigate(`/entries/friend/${clientId}`)}
      >
        <i className="bi bi-arrow-left me-1"></i>Back
      </button>

      <div className="d-flex justify-content-between align-items-start mb-1">
        <h2 className="text-center fw-semibold mb-0" style={{ flex: 1 }}>Entry {entry.id}</h2>
        <button
          className="btn btn-sm"
          style={{ background: "transparent", border: "none" }}
          onClick={toggleFavorite}
        >
          <i className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart"}`} style={{ fontSize: "1.4rem" }}></i>
        </button>
      </div>

      <p className="text-center mb-4" style={{ fontSize: "1.2rem" }}>
        {emotion?.emoji} {emotion?.name}
      </p>

      <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#333" }}>
        {entry.description}
      </p>

      <p className="text-center mt-4" style={{ color: "#999", fontSize: "0.85rem" }}>
        {entry.date}
      </p>
    </div>
  );
};

export default FriendEntriesDetails;