import { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

const EntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`)
      .then(resp => resp.json())
      .then(data => dispatch({ type: "set_entries", payload: data }));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
      .then(resp => resp.json())
      .then(data => dispatch({ type: "set_emotions", payload: data }));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-favorites`, {
      headers: { Authorization: `Bearer ${store.clientToken}` }
    })
      .then(resp => resp.json())
      .then(data => setFavorites(data.map(f => f.entry_id)));
  }, []);

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.clientToken}`
        },
        body: JSON.stringify({ entry_id: entryId })
      });
      setFavorites([...favorites, entryId]);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`, {
      method: "DELETE"
    });
    dispatch({
      type: "set_entries",
      payload: store.entries.filter(e => e.id !== id)
    });
    setDeleteModal(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-semibold">Entries</h2>
        <Link to="/entries/create" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>New Entry
        </Link>
      </div>
      <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
        {store.entries.length === 0 ? "Start tracking your emotions" : "Keep tracking your emotions"}
      </p>

      {store.entries.length === 0 ? (
        <p className="text-center text-muted mt-5">No entries yet</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {store.entries.map(entry => {
            const emotion = store.emotions.find(em => em.id === entry.emotion_id);
            const isFav = favorites.includes(entry.id);
            return (
              <div
                key={entry.id}
                className="rounded-3 p-3 d-flex justify-content-between align-items-center"
                style={{ backgroundColor: emotion?.color || "#f8f9fa" }}
              >
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ fontSize: "1.3rem" }}>{emotion?.emoji}</span>
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
                    <button
                      className="btn btn-sm btn-light"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to={`/entries/${entry.id}`}>
                          <i className="bi bi-eye me-2"></i>Details
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to={`/entries/${entry.id}/edit`}>
                          <i className="bi bi-pencil me-2"></i>Edit
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => setDeleteModal(entry.id)}
                        >
                          <i className="bi bi-trash me-2"></i>Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Entry</h5>
                <button className="btn-close" onClick={() => setDeleteModal(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this entry?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteModal)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EntriesList;