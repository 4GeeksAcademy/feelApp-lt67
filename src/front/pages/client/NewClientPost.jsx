import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const NewClientPost = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [createForm, setCreateForm] = useState({ title: "", text: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const activeToken = store.clientToken;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/client-posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(createForm),
      }
    );

    const data = await resp.json();
    setLoading(false);

    if (resp.ok) {
      dispatch({ type: "add_client_post", payload: data });
      setCreateForm({ title: "", text: "" });
      navigate("/forum");
    } else {
      setError(data.error || "Error creating post");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "680px", paddingTop: "80px" }}>
      <div className="mb-5 mt-5">
        <h2 className="mb-0">New Post</h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Share your thoughts with the community
        </p>
      </div>

      <div className="forum-card p-4">
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Title</label>
            <input
              className="form-control forum-input"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm({ ...createForm, title: e.target.value })
              }
              placeholder="What's on your mind?"
              required
              disabled={loading}
              style={{ padding: "12px 14px" }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">Content</label>
            <textarea
              className="form-control forum-input"
              rows="6"
              value={createForm.text}
              onChange={(e) =>
                setCreateForm({ ...createForm, text: e.target.value })
              }
              placeholder="Share your thoughts..."
              required
              disabled={loading}
              style={{ padding: "12px 14px" }}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-forum-switch rounded-pill px-4"
              onClick={() => navigate("/forum")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-custom rounded-pill px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Posting...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-1"></i>Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientPost;
