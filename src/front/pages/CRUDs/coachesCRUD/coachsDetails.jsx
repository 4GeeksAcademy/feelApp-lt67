import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const CoachsDetails = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [coach, setCoach] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs/${id}`)
      .then((resp) => resp.json())
      .then((data) => setCoach(data));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete coach?")) return;

    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/coachs/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!resp.ok) return;

    dispatch({
      type: "set_coachs",
      payload: store.coachs.filter((c) => c.id !== parseInt(id)),
    });

    navigate("/coachs");
  };

  if (!coach) return <p className="container mt-4">Loading...</p>;

  return (
    <div className="coachs-page container mt-4">
      <h2>Coach Details</h2>

      <p><strong>ID:</strong> {coach.id}</p>
      <p><strong>Email:</strong> {coach.email}</p>
      <p><strong>Date:</strong> {new Date(coach.sign_up_date).toLocaleDateString()}</p>

      <Link
        to={`/coachs/${id}/edit`}
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
        to="/coachs"
        className="btn btn-secondary ms-2"
      >
        Back
      </Link>
    </div>
  );
};

export default CoachsDetails;