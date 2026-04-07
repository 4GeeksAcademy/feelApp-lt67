import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const EntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);

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
      console.error("Error deleting entry:", error);
    }
  };
  
  return (
    <div className="container mt-5" style={{ maxWidth: "680px" }}>
        <div className="text-start mt-5" >
          <h2 style={{ margin: 0}}>Entries</h2>
          <p className="text-muted">Record your thoughts and feelings</p>
        </div>
      <div className="d-flex justify-content-end mb-5">
        <Link to="/entries/create" className="btn btn-custom rounded-pill px-4">
          <i className="bi bi-plus-lg me-2"></i> New Entry
        </Link>
      </div>

      {store.entries.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No entries yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {store.entries.map(entry => {
            const emotion = store.emotions.find(em => em.id === entry.emotion_id);
            const isFav = favorites.includes(entry.id);
            return (
              <div key={entry.id} className="col-12 col-md-6 col-lg-4">
                <div style={{
                  background: "#ffffff", borderRadius: "20px", padding: "20px",
                  height: "200px", border: "1px solid #edf2f7", position: "relative",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <button onClick={() => toggleFavorite(entry.id)} style={{ background: "none", border: "none", padding: 0 }}>
                      <i className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart text-muted"}`} style={{ fontSize: "1.2rem" }}></i>
                    </button>
                    
                    <div className="dropdown">
                      <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                        <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem" }}></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm text-center">
                        <li><Link className="dropdown-item" to={`/entries/${entry.id}`}>Details</Link></li>
                        <li><Link className="dropdown-item" to={`/entries/${entry.id}/edit`}>Edit</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={() => setDeleteModal(entry.id)}>Delete</button></li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <div style={{ fontSize: "2.5rem", marginBottom: "5px" }}>{emotion?.emoji}</div>
                    <h6 style={{ fontWeight: "700", color: "#1f2937", margin: 0, textTransform: "capitalize" }}>
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

      {deleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: "20px", padding: "10px" }}>
              <div className="modal-body text-center">
                <h5 className="fw-bold mb-3">Delete Entry?</h5>
                <p className="text-muted">This action cannot be undone.</p>
                <div className="d-flex gap-2 justify-content-center mt-4">
                  <button className="btn btn-light px-4" style={{ borderRadius: "10px" }} onClick={() => setDeleteModal(null)}>Cancel</button>
                  <button className="btn btn-danger px-4" style={{ borderRadius: "10px" }} onClick={() => handleDelete(deleteModal)}>Delete</button>
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