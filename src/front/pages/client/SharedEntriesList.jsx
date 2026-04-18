import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const SharedEntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const { clientId } = useParams();

  const isCoach = !!store.coachToken;
  const activeToken = store.clientToken || store.coachToken;

  useEffect(() => {
    if (!activeToken) navigate("/");
  }, [activeToken]);

  const currentFavs = isCoach ? store.coach_favorites : store.favorites;

  const favoriteEntryIds = useMemo(() => {
    return new Set(currentFavs.map((f) => f.entry_id));
  }, [currentFavs]);

  useEffect(() => {
    if (!activeToken) return;

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

    if (currentFavs.length === 0) {
      const favEndpoint = isCoach ? "coach-favorites" : "client-favorites";
      const favAction = isCoach ? "set_coach_favorites" : "set_favorites";

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/${favEndpoint}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: favAction, payload: data });
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
  }, [clientId, isCoach, activeToken]);

  const friendEmail =
    store.clients.find((c) => String(c.id) === String(clientId))?.email ||
    `Client #${clientId}`;

  const toggleFavorite = async (entryId) => {
    const isFav = favoriteEntryIds.has(entryId);
    const endpointBase = isCoach ? "coach-favorites" : "client-favorites";
    const addAction = isCoach ? "add_coach_favorite" : "add_favorite";
    const removeAction = isCoach ? "remove_coach_favorite" : "remove_favorite";

    if (isFav) {
      const fav = currentFavs.find((f) => f.entry_id === entryId);
      if (!fav) return;

      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${endpointBase}/${fav.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );
      if (resp.ok) {
        dispatch({ type: removeAction, payload: fav.id });
      }
    } else {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/${endpointBase}`,
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
        dispatch({ type: addAction, payload: data });
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: "680px", paddingTop: "120px"}}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="text-start">
          <h2 style={{ margin: 0 }}>Entries</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>{friendEmail}</p>
        </div>
        
        <button
          className="btn btn-forum-switch rounded-pill px-4"
          onClick={() => navigate(store.clientToken ? "/shared" : "/access-coach")}
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
