import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const CoachFavoritesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.coachToken) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coach-favorites`, {
      headers: {
        Authorization: `Bearer ${store.coachToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({
          type: "set_coach_favorites",
          payload: Array.isArray(data) ? data : [],
        });
      })
      .catch((error) => console.error(error));
  }, [store.coachToken, dispatch, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this favorite?")) return;

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coach-favorites/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.coachToken}`,
          },
        }
      );

      if (resp.ok) {
        dispatch({
          type: "set_coach_favorites",
          payload: store.coach_favorites.filter((fav) => fav.id !== id),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "680px", paddingTop: "80px" }}>
      <div className="mb-4 mt-5">
        <h2 className="fw-500 mb-1">Favorite Entries</h2>
        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          Quick access to important client updates
        </p>
      </div>

      <div className="d-flex flex-column gap-3">
        {store.coach_favorites && store.coach_favorites.length > 0 ? (
          store.coach_favorites.map((fav) => (
            <div
              key={fav.id}
              className="forum-card p-3 d-flex justify-content-between align-items-center"
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
              }}
            >
              <div style={{ flex: 1 }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-500" style={{ fontSize: "0.95rem" }}>
                    {fav.entry?.title || "Untitled Entry"}
                  </span>
                </div>
                <p className="mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                  Client: <span className="fw-500">{fav.entry?.client_email || "N/A"}</span> • {fav.entry?.date}
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm rounded-pill px-3"
                  style={{ 
                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "1px solid #e2e8f0",
                    color: "#475569",
                    fontWeight: "500",
                    fontSize: "0.8rem"
                  }}
                  onClick={() => navigate(`/entries/friend/${fav.entry?.client_id}`)}
                >
                  View
                </button>
                <button
                  className="btn btn-sm btn-custom rounded-pill px-3"
                  style={{ 
                    border: "none",
                    fontWeight: "500",
                    fontSize: "0.8rem"
                  }}
                  onClick={() => handleDelete(fav.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted small">No favorites saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachFavoritesList;