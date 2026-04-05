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
  }, [store.clientToken, navigate]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${entryId}`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
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
  }, [entryId, store.emotions.length, dispatch]);

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

  if (!entry) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  const emotion = store.emotions.find(em => em.id === entry.emotion_id);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "85vh", padding: "20px" }}>
      <div style={{
        background: "#ffffff", borderRadius: "20px", padding: "40px",
        width: "100%", maxWidth: "550px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        textAlign: "center", border: "1px solid #edf2f7"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <span style={{
            backgroundColor: "#f3f4f6", color: "#6b7280",
            padding: "5px 15px", borderRadius: "12px",
            fontSize: "0.85rem", fontWeight: "500"
          }}>
            {entry.date}
          </span>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: "10px" }}>
            {emotion?.emoji || "😶"}
          </div>
          <h2 style={{ color: "#111827", fontWeight: "700", letterSpacing: "-0.5px", textTransform: "capitalize" }}>
            Feeling {emotion?.name}
          </h2>
        </div>

        <div style={{
          backgroundColor: "#f9fafb", padding: "25px",
          borderRadius: "15px", textAlign: "left", minHeight: "100px"
        }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "#374151", margin: 0 }}>
            {entry.description}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            onClick={() => navigate(`/entries/friend/${clientId}`)}
            style={{
              textDecoration: "none", color: "#6366f1",
              fontSize: "1rem", fontWeight: "600",
              background: "none", border: "none",
              display: "inline-flex", alignItems: "center", gap: "8px"
            }}
          >
            ← Back
          </button>
          <button
            style={{ background: "transparent", border: "none" }}
            onClick={toggleFavorite}
          >
            <i className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart text-muted"}`} style={{ fontSize: "1.5rem" }}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendEntriesDetails;