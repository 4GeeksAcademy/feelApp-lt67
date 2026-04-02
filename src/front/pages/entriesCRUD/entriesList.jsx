import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

const EntriesList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

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
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Entries</h2>
        <Link to="/entries/create" className="btn btn-outline-primary p-2">Create Entry</Link>
      </div>
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Emotion</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {store.entries.length === 0 ? (
          <tr><td colSpan="5" className="text-center">No entries yet</td></tr>
        ) : (
          store.entries.map(entry => {
            const emotion = store.emotions.find(em => em.id === entry.emotion_id);
            return (
              <tr key={entry.id} style={{ backgroundColor: store.emotion?.color || "transparent" }}>
                <td>{entry.title}</td>
                <td>{entry.description}</td>
                <td>{emotion ? `${emotion.emoji} ${emotion.name}` : "-"}</td>
                <td>{entry.date}</td>
                <td>
                  <Link to={`/entries/${entry.id}`} className="btn btn-sm btn-outline-secondary">Details</Link>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
      </table>
    </div>
  );
};
export default EntriesList;