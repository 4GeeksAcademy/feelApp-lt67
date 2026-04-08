import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const SharedEntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const { clientId } = useParams();

  const activeToken = store.clientToken || store.coachToken;

  useEffect(() => {
    if (!activeToken) navigate("/");
  }, [activeToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/client/${clientId}`, {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          dispatch({ type: "set_entries", payload: data });
      });

    if (store.emotions.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
        .then((r) => r.json())
        .then((data) => dispatch({ type: "set_emotions", payload: data }));
    }

    if (store.favorites.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_favorites", payload: data });
        });
    }

    if (store.clients.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_clients", payload: data });
        });
    }
  }, [clientId]);

  const favoriteEntryIds = new Set(store.favorites.map((f) => f.entry_id));

  const friendEmail =
    store.clients.find((c) => String(c.id) === String(clientId))?.email ||
    `Client #${clientId}`;

  const toggleFavorite = async (entryId) => {
    const isFav = favoriteEntryIds.has(entryId);

    if (isFav) {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/client-favorites/entry/${entryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${activeToken}` },
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
            Authorization: `Bearer ${activeToken}`,
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

  return (
    <div className="container mt-5" style={{ maxWidth: "680px" }}>
      <div className="text-start mt-5">
        <h2 style={{ margin: 0 }}>Entries</h2>
        <p className="text-muted">{friendEmail}</p>
      </div>
      <div className="d-flex justify-content-end mb-5">
        <button
          className="btn btn-forum-switch rounded-pill px-4"
          onClick={() => navigate("/shared")}
        >
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      {store.entries.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No entries yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {store.entries.map((entry) => {
            const emotion = store.emotions.find((em) => em.id === entry.emotion_id);
            const isFav = favoriteEntryIds.has(entry.id);
            return (
              <div key={entry.id} className="col-12 col-md-3 col-lg-4">
                <div
                  style={{
                    background: "#ffffff", borderRadius: "20px", padding: "20px",
                    height: "200px", border: "1px solid #edf2f7", position: "relative",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <button
                      onClick={() => toggleFavorite(entry.id)}
                      style={{ background: "none", border: "none", padding: 0 }}
                    >
                      <i
                        className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart text-muted"}`}
                        style={{ fontSize: "1.2rem" }}
                      ></i>
                    </button>
                    <div className="dropdown">
                      <button
                        className="btn btn-link text-muted p-0"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem" }}></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm text-center">
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/entries/friend/${clientId}/${entry.id}`}
                          >
                            Details
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <div style={{ fontSize: "2.5rem", marginBottom: "5px" }}>
                      {emotion?.emoji}
                    </div>
                    <h6
                      style={{
                        fontWeight: "700", color: "#1f2937",
                        margin: 0, textTransform: "capitalize",
                      }}
                    >
                      {entry.title}
                    </h6>
                  </div>

                  <div className="text-center">
                    <small style={{ color: "#9ca3af", fontWeight: "500", fontSize: "0.75rem" }}>
                      {entry.date}
                    </small>
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

export default SharedEntriesList;
