import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const EntriesUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    emotion_id: ""
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`)
      .then(resp => resp.json())
      .then(data => setForm(data));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    navigate("/entries");
  };

  return (
    <div className="container mt-4">
      <h2>Update Entry</h2>

      <form onSubmit={handleUpdate}>
        <input className="form-control mb-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea className="form-control mb-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="date" className="form-control mb-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />

        <button className="btn btn-primary">Update</button>
        <Link to="/entries" className="btn btn-secondary ms-2">Back</Link>
      </form>
    </div>
  );
};

export default EntriesUpdate;