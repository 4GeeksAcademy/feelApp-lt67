import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AdmintsDetails = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [admint, setAdmint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admints/${id}`)
      .then((resp) => resp.json())
      .then((data) => setAdmint(data));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete admint?")) return;

    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admints/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!resp.ok) return;

    dispatch({
      type: "set_admints",
      payload: store.admints.filter((a) => a.id !== parseInt(id)),
    });

    navigate("/admints");
  };

  if (!admint) return <p className="container mt-4">Loading...</p>;

  return (
    <div className="clients-page container mt-5">
      <h2 className="mt-80 bg-gray-200 p-4">Admin Details</h2>

      <p><strong>ID:</strong> {admint.id}</p>
      <p><strong>Email:</strong> {admint.email}</p>
      <p><strong>Date:</strong> {new Date(admint.sign_up_date).toLocaleDateString()}</p>

      <Link
        to={`/admints/${id}/edit`}
        className="btn btn-primary"
      >
        Edit
      </Link>

      <button
        onClick={handleDelete}
        className="btn btn-outline-secondary ms-2"
      >
        Delete
      </button>

      <Link
        to="/admints"
        className="btn btn-secondary ms-2"
      >
        Back
      </Link>
    </div>
  );
};

export default AdmintsDetails;