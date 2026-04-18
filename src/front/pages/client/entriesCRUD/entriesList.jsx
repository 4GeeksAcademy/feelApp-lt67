import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const EntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken, navigate]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) dispatch({ type: "set_entries", payload: data });
      });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
      .then(resp => resp.json())
      .then(data => dispatch({ type: "set_emotions", payload: data }));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
      .then(resp => resp.json())
      .then(data => setFavorites(data.map(f => f.entry_id)));
  }, [dispatch, store.clientToken]);

  const getGeminiAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotional-advice`, {
        headers: { Authorization: `Bearer ${store.clientToken}` }
      });
      const data = await resp.json();
      if (data.advice) setAdvice(data.advice);
    } catch (error) {
      console.error("Error fetching advice:", error);
    } finally {
      setLoadingAdvice(false);
    }
  };

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

  const handleDelete = async (id) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${store.clientToken}` }
      });
      if (resp.ok) {
        dispatch({ type: "remove_entry", payload: id });
        setDeleteModal(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayedEntries = showOnlyFavorites 
    ? store.entries.filter(entry => favorites.includes(entry.id))
    : store.entries;
  
  return (
    <div className="container" style={{ 
      maxWidth: "680px", 
      paddingTop: "80px", 
      paddingBottom: "100px",
      minHeight: "100vh"
    }}>
      <style>{`
        .glass-entry-card {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          padding: 24px;
          height: 240px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
        }

        .glass-entry-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.55);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.1);
        }

        .glass-advice-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 25px;
          border-left: 4px solid #f4b6c2;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-menu {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 15px;
        }

        .btn-fav-filter {
          background: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          transition: all 0.2s;
        }

        .btn-fav-filter.active {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #ef4444;
        }

        .btn-gemini {
          background: linear-gradient(135deg, #a5c8ff, #f4b6c2);
          color: #181717c0;
          border: none;
          transition: all 0.3s ease;
        }

        .btn-gemini:hover {
          opacity: 0.9;
          transform: scale(1.02);
          color: #272323c0;
        }
      `}</style>

      <div className="d-flex justify-content-center mb-4 mt-2">
        <button 
          className="btn btn-gemini rounded-pill px-4 py-2 shadow-sm fw-bold"
          onClick={getGeminiAdvice}
          disabled={loadingAdvice}
        >
          {loadingAdvice ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : (
            <i className="bi bi-stars me-2"></i>
          )}
          Get immediate advice from Gemini
        </button>
      </div>

      {advice && (
        <div className="glass-advice-card shadow-sm">
          <div className="d-flex justify-content-between align-items-start">
            <small className="text-uppercase fw-bold text-muted mb-2 d-block" style={{ letterSpacing: "1px", fontSize: "0.7rem" }}>
              Gemini Coach says:
            </small>
            <button className="btn-close" style={{ fontSize: "0.7rem" }} onClick={() => setAdvice("")}></button>
          </div>
          <p className="mb-0" style={{ fontStyle: "italic", color: "#475569", lineHeight: "1.5" }}>
            "{advice}"
          </p>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-start">
          <h2 className="mb-0">Entries</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Record your thoughts and feelings
          </p>
        </div>

        <div className="d-flex gap-2">
          <button 
            className={`btn btn-fav-filter rounded-pill px-3 ${showOnlyFavorites ? 'active' : ''}`}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            title={showOnlyFavorites ? "Show all" : "Show favorites"}
          >
            <i className={`bi ${showOnlyFavorites ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>

          <Link to="/entries/create" className="btn btn-custom rounded-pill px-4">
            <i className="bi bi-plus-lg me-2"></i> New Entry
          </Link>
        </div>
      </div>

      {displayedEntries.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            {showOnlyFavorites ? "No favorite entries yet." : "No entries yet."}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {displayedEntries.map(entry => {
            const emotion = store.emotions.find(em => em.id === entry.emotion_id);
            const isFav = favorites.includes(entry.id);
            return (
              <div key={entry.id} className="col-12 col-md-6 col-lg-4">
                <div className="glass-entry-card">
                  <div className="d-flex justify-content-between align-items-start">
                    <button onClick={() => toggleFavorite(entry.id)} style={{ background: "none", border: "none" }}>
                      <i className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart text-muted"}`} style={{ fontSize: "1.2rem" }}></i>
                    </button>
                    
                    <div className="dropdown">
                      <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem" }}></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                        <li><Link className="dropdown-item" to={`/entries/${entry.id}`}>Details</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={() => setDeleteModal(entry.id)}>Delete</button></li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center flex-grow-1 d-flex flex-column justify-content-center">
                    <div style={{ fontSize: "3.5rem", marginBottom: "8px" }}>{emotion?.emoji}</div>
                    <h6 className="fw-bold mb-0 text-capitalize" style={{ color: "#1e293b" }}>
                      {entry.title}
                    </h6>
                  </div>

                  <div className="text-center mt-2">
                    <small style={{ color: "#94a3b8", fontWeight: "600", fontSize: "0.75rem" }}>
                      {entry.date}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: "24px", padding: "10px" }}>
              <div className="modal-body text-center">
                <h5 className="fw-bold mb-3">Delete Entry?</h5>
                <p className="text-muted">This action cannot be undone.</p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button className="btn btn-light px-4" style={{ borderRadius: "12px" }} onClick={() => setDeleteModal(null)}>Cancel</button>
                  <button className="btn btn-danger px-4" style={{ borderRadius: "12px" }} onClick={() => handleDelete(deleteModal)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntriesList;