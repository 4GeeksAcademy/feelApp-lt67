import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const Shared = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [view, setView] = useState("friends");

  const myId = store.clientId;

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients`, {
      headers: { Authorization: `Bearer ${store.clientToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          dispatch({ type: "set_access_clients", payload: data });
      });

    if (store.coach_favorites.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coach-favorites`, {
        headers: { Authorization: `Bearer ${store.clientToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_coach_favorites", payload: data });
        });
    }

    if (store.entries.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_entries", payload: data });
        });
    }

    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_emotions", payload: data });
        });
    }

    if (store.favorites.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
        headers: { Authorization: `Bearer ${store.clientToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_favorites", payload: data });
        });
    }
  }, []);

  const toggleFavorite = async (entryId) => {
    const favoriteEntryIds = new Set(store.favorites.map((f) => f.entry_id));
    const isFav = favoriteEntryIds.has(entryId);

    if (isFav) {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/client-favorites/entry/${entryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${store.clientToken}` },
        }
      );
      if (resp.ok) {
        const fav = store.favorites.find((f) => f.entry_id === entryId);
        if (fav) dispatch({ type: "remove_favorite", payload: fav.id });
      }
    } else {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.clientToken}`,
          },
          body: JSON.stringify({ entry_id: entryId }),
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        dispatch({ type: "add_favorite", payload: data });
      }
    }
  };

  const friends = store.access_clients.filter(
    (a) => String(a.shared_with_id) === String(myId) && a.status === "approved"
  );

  const coachFavMap = {};
  store.coach_favorites.forEach((fav) => {
    if (!coachFavMap[fav.coach_id]) coachFavMap[fav.coach_id] = [];
    coachFavMap[fav.coach_id].push(fav.entry_id);
  });

  const getEmotion = (emotionId) =>
    store.emotions.find((e) => e.id === emotionId);

  const statusBadge = (status) => {
    const map = {
      pending:  { bg: "#fff9c4", color: "#b45309" },
      approved: { bg: "#d1fae5", color: "#065f46" },
      rejected: { bg: "#fee2e2", color: "#991b1b" },
    };
    const s = map[status] || map.pending;
    return (
      <span
        style={{
          backgroundColor: s.bg, color: s.color,
          padding: "2px 10px", borderRadius: "20px",
          fontSize: "0.75rem", fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="container" style={{ maxWidth: "680px", paddingTop: "80px"}}>
      <div className="mb-4 mt-5">
        <h2 className="mb-0">Shared</h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          See your friends' entries and coach activity
        </p>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn btn-forum-switch rounded-pill px-4 ${view === "friends" ? "active" : ""}`}
          onClick={() => setView("friends")}
        >
          <i className="bi bi-people me-2"></i>Friends
        </button>
        <button
          className={`btn btn-forum-switch rounded-pill px-4 ${view === "coaches" ? "active" : ""}`}
          onClick={() => setView("coaches")}
        >
          <i className="bi bi-person-badge me-2"></i>Coach Likes
        </button>
      </div>

      {view === "friends" && (
        <div className="d-flex flex-column gap-3">
          {friends.length === 0 && (
            <p className="text-muted text-center mt-5">
              No friends yet — approve access requests first
            </p>
          )}
          {friends.map((f) => (
            <div
              key={f.id}
              className="forum-card p-3 d-flex justify-content-between align-items-center"
            >
              <div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "0.95rem" }}>
                  {f.client_email || `Client #${f.client_id}`}
                </p>
                <div className="mt-1">{statusBadge(f.status)}</div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-forum-switch rounded-pill px-3"
                  onClick={() => navigate(`/entries/friend/${f.client_id}`)}
                >
                  <i className="bi bi-journal-text me-1"></i>Entries
                </button>
                <button
                  className="btn btn-sm btn-custom rounded-pill px-3"
                  onClick={() => navigate(`/forum?client=${f.client_id}`)}
                >
                  <i className="bi bi-chat-dots me-1"></i>Posts
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "coaches" && (
        <div className="d-flex flex-column gap-4">
          {Object.keys(coachFavMap).length === 0 && (
            <p className="text-muted text-center mt-5">No coach activity yet</p>
          )}
          {Object.entries(coachFavMap).map(([coachId, entryIds]) => (
            <div key={coachId}>
              <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
                <i className="bi bi-person-badge me-2"></i>Coach #{coachId}
              </p>
              <div className="d-flex flex-column gap-2">
                {entryIds.map((entryId) => {
                  const entry = store.entries.find((e) => e.id === entryId);
                  if (!entry) return null;
                  const emotion = getEmotion(entry.emotion_id);
                  return (
                    <div
                      key={entryId}
                      className="forum-card p-3"
                      style={{ borderLeft: `4px solid ${emotion?.color || "#e5e7eb"}` }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span style={{ fontSize: "1.1rem" }}>{emotion?.emoji}</span>
                        <h6 className="fw-semibold mb-0">{entry.title}</h6>
                      </div>
                      <small className="text-muted">
                        {emotion?.name} · {entry.date}
                      </small>
                      <p
                        className="mt-2 mb-0"
                        style={{ color: "#374151", fontSize: "0.9rem", lineHeight: "1.6" }}
                      >
                        {entry.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shared;
