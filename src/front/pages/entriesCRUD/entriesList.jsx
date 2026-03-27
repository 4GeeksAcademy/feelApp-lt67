import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EntriesList = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`)
      .then(resp => resp.json())
      .then(data => dispatch({ type: "set_entries", payload: data }));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Entries</h2>
        <Link to="/entries/create" className="btn btn-primary">Create Entry</Link>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {store.entries.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No entries yet</td>
            </tr>
          ) : (
            store.entries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.client_id}</td>
                <td>{entry.title}</td>
                <td>{entry.description}</td>
                <td>{entry.date}</td>
                <td>
                  <Link to={`/entries/${entry.id}`} className="btn btn-sm btn-outline-secondary">
                    Details
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default EntriesList;