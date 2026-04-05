import { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate, useParams } from "react-router-dom";

const FriendEntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [entries, setEntries] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/client/${clientId}`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEntries(data); });

    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then(r => r.json())
        .then(data => dispatch({ type: "set_emotions", payload: data }));
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setFavorites(data.map(f => f.entry_id)); });
  }, [clientId]);

  const toggleFavorite = async (entryId) => {
    const isFav = favorites.includes(entryId);
    if (isFav) {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites/entry/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${store.clientToken}` }
      });
      setFavorites(favorites.filter(id => id !== entryId));
    } else {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${store.clientToken}` },
        body: JSON.stringify({ entry_id: entryId })
      });
      setFavorites([...favorites, entryId]);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-2 mt-5">
        <h2 className="mb-0">Entries</h2>
        <button className="btn btn-sm btn-forum-switch rounded-pill px-3" onClick={() => navigate("/shared")}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
      </div>
      <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>Client #{clientId}</p>

      {entries.length === 0 ? (
        <p className="text-muted text-center mt-5">No entries yet</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {entries.map(entry => {
            const emotion = store.emotions.find(em => em.id === entry.emotion_id);
            const isFav = favorites.includes(entry.id);
            return (
              <div key={entry.id} className="forum-card p-3 d-flex justify-content-between align-items-center">
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ fontSize: "1.2rem" }}>{emotion?.emoji}</span>
                    <span className="fw-semibold">{entry.title}</span>
                  </div>
                  <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>{entry.description}</p>
                  <small className="text-muted">{entry.date}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm"
                    style={{ background: "transparent", border: "none" }}
                    onClick={() => toggleFavorite(entry.id)}
                  >
                    <i className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart"}`} style={{ fontSize: "1.2rem" }}></i>
                  </button>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to={`/entries/friend/${clientId}/${entry.id}`}>
                          <i className="bi bi-eye me-2"></i>Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendEntriesList;