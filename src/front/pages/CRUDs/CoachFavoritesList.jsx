import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

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
    const confirmDelete = window.confirm("Remove this favorite?");
    if (!confirmDelete) return;

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

      if (!resp.ok) {
        alert("Error removing favorite");
        return;
      }

      dispatch({
        type: "set_coach_favorites",
        payload: store.coach_favorites.filter((fav) => fav.id !== id),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="container"
      style={{
        paddingTop: "110px",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "15px",
        }}
      >
        <h2 className="mb-4 text-center">My Favorite Entries</h2>

        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Entry</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {store.coach_favorites && store.coach_favorites.length > 0 ? (
              store.coach_favorites.map((fav) => (
                <tr key={fav.id}>
                  <td style={{ fontWeight: "500" }}>{fav.id}</td>

                  <td>{fav.client_email || "Sin cliente"}</td>

                  <td>{fav.title || "Sin entrada"}</td>
                  <td>{fav.entry_date || "Sin fecha"}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No favorites yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoachFavoritesList;