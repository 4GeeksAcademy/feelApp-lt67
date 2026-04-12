import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const REACTIONS = ["👍", "🎉", "💪", "❤️", "💡"];

const Forum = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [view, setView] = useState("clients");
  const [myPosts, setMyPosts] = useState(false);
  const [clientReactions, setClientReactions] = useState({});
  const [admintReactions, setAdmintReactions] = useState({});
  const [showReactionMenu, setShowReactionMenu] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", text: "" });
  const [error, setError] = useState("");

  const isAdmin = !!store.admintToken;
  const isClient = !!store.clientToken;
  const activeToken = store.clientToken || store.admintToken || store.coachToken;
  const myId = store.clientId;

  useEffect(() => {
    if (!activeToken) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/client-posts`, {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          dispatch({ type: "set_clients_posts", payload: data });
      });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admint-posts`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          dispatch({ type: "set_admint_posts", payload: data });
      });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts`, {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const map = {};
        data.forEach((r) => {
          if (String(r.client_id) === String(myId))
            map[r.client_post_id] = r.reaction;
        });
        setClientReactions(map);
      });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts`, {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const map = {};
        data.forEach((r) => {
          if (String(r.client_id) === String(myId))
            map[r.admint_post_id] = r.reaction;
        });
        setAdmintReactions(map);
      });
  }, [activeToken]);

  const handleReactClient = async (postId, reaction) => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/reaction-client-posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ client_post_id: postId, reaction }),
      }
    );
    if (resp.ok) setClientReactions({ ...clientReactions, [postId]: reaction });
    setShowReactionMenu(null);
  };

  const handleReactAdmint = async (postId, reaction) => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/reaction-admint-posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ admint_post_id: postId, reaction }),
      }
    );
    if (resp.ok) setAdmintReactions({ ...admintReactions, [postId]: reaction });
    setShowReactionMenu(null);
  };

  const handleDelete = async (id) => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${activeToken}` },
      }
    );
    if (resp.ok) {
      dispatch({ type: "remove_client_post", payload: id });
    }
    setDeleteModal(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/client-posts/${editPost}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(editForm),
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      dispatch({ type: "update_client_post", payload: data });
      setEditPost(null);
    }
  };

  const [searchParams] = useSearchParams();
  const filterClientId = searchParams.get("client");

  const visibleClientPosts = Array.isArray(store.clients_posts)
    ? filterClientId
      ? store.clients_posts.filter(
          (p) => String(p.client_id) === String(filterClientId)
        )
      : myPosts
      ? store.clients_posts.filter(
          (p) => String(p.client_id) === String(myId)
        )
      : store.clients_posts
    : [];

  const visibleAdmintPosts = Array.isArray(store.admint_posts)
    ? store.admint_posts
    : [];

  return (
    <div className="container" style={{ maxWidth: "680px", paddingTop: "80px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <div>
          <h2 className="mb-0">Forum</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            {view === "clients" ? "Community posts" : "Info from admins"}
          </p>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn btn-forum-switch rounded-pill px-4 ${
            view === "clients" ? "active" : ""
          }`}
          onClick={() => setView("clients")}
        >
          <i className="bi bi-people me-2"></i>Community
        </button>
        <button
          className={`btn btn-forum-switch rounded-pill px-4 ${
            view === "admins" ? "active" : ""
          }`}
          onClick={() => setView("admins")}
        >
          <i className="bi bi-megaphone me-2"></i>Info
        </button>
      </div>

      {view === "clients" && isClient && (
        <div className="d-flex justify-content-end mb-3">
          <button
            className={`btn btn-sm rounded-pill px-3 ${
              myPosts ? "btn-custom" : "btn-forum-switch"
            }`}
            onClick={() => setMyPosts(!myPosts)}
          >
            {myPosts ? "All posts" : "My posts"}
          </button>
        </div>
      )}

      {view === "clients" && (
        <div className="d-flex flex-column gap-3">
          {visibleClientPosts.length === 0 && (
            <p className="text-muted text-center mt-5">No posts yet</p>
          )}
          {visibleClientPosts.map((post) => {
            const isOwn = String(post.client_id) === String(myId);
            const canDelete = isOwn || isAdmin;
            const canEdit = isOwn;
            const myReaction = clientReactions[post.id];
            return (
              <div key={post.id} className="forum-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-semibold mb-0">{post.title}</h6>
                    <small className="text-muted">
                      {isOwn ? "You" : post.client_email}
                    </small>
                  </div>
                  {(canDelete || canEdit) && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-forum-switch rounded-pill"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                        {canEdit && (
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setEditPost(post.id);
                                setEditForm({
                                  title: post.title,
                                  text: post.text,
                                });
                              }}
                            >
                              Edit
                            </button>
                          </li>
                        )}
                        {canEdit && canDelete && (
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                        )}
                        {canDelete && (
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => setDeleteModal(post.id)}
                            >
                              Delete
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <p
                  className="mb-3"
                  style={{ color: "#374151", lineHeight: "1.6" }}
                >
                  {post.text}
                </p>

                {!isOwn && (
                  <div className="position-relative d-inline-block">
                    <button
                      className="btn btn-sm reaction-badge"
                      onClick={() =>
                        setShowReactionMenu(
                          showReactionMenu === `c-${post.id}`
                            ? null
                            : `c-${post.id}`
                        )
                      }
                    >
                      {myReaction || (
                        <i className="bi bi-emoji-smile me-1"></i>
                      )}
                      {!myReaction && "React"}
                    </button>
                    {showReactionMenu === `c-${post.id}` && (
                      <div
                        className="position-absolute bg-white border rounded-3 p-2 d-flex gap-2 shadow-sm"
                        style={{ zIndex: 100, bottom: "110%", left: 0 }}
                      >
                        {REACTIONS.map((r) => (
                          <span
                            key={r}
                            style={{ cursor: "pointer", fontSize: "1.3rem" }}
                            onClick={() => handleReactClient(post.id, r)}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === "admins" && (
        <div className="d-flex flex-column gap-3">
          {visibleAdmintPosts.length === 0 && (
            <p className="text-muted text-center mt-5">No info posts yet</p>
          )}
          {visibleAdmintPosts.map((post) => {
            const myReaction = admintReactions[post.id];
            return (
              <div key={post.id} className="forum-card overflow-hidden">
                {post.img_url && (
                  <img
                    src={post.img_url}
                    alt={post.title}
                    className="w-100"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="p-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className="brand-badge"
                      style={{ fontSize: "0.7rem", padding: "2px 10px" }}
                    >
                      Admin
                    </span>
                    <small className="text-muted">{post.admint_mail}</small>
                  </div>
                  <h6 className="fw-semibold mt-2 mb-1">{post.title}</h6>
                  <p
                    className="mb-3"
                    style={{ color: "#374151", lineHeight: "1.6" }}
                  >
                    {post.text}
                  </p>
                  <div className="position-relative d-inline-block">
                    <button
                      className="btn btn-sm reaction-badge"
                      onClick={() =>
                        setShowReactionMenu(
                          showReactionMenu === `a-${post.id}`
                            ? null
                            : `a-${post.id}`
                        )
                      }
                    >
                      {myReaction || (
                        <i className="bi bi-emoji-smile me-1"></i>
                      )}
                      {!myReaction && "React"}
                    </button>
                    {showReactionMenu === `a-${post.id}` && (
                      <div
                        className="position-absolute bg-white border rounded-3 p-2 d-flex gap-2 shadow-sm"
                        style={{ zIndex: 100, bottom: "110%", left: 0 }}
                      >
                        {REACTIONS.map((r) => (
                          <span
                            key={r}
                            style={{ cursor: "pointer", fontSize: "1.3rem" }}
                            onClick={() => handleReactAdmint(post.id, r)}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editPost && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditPost(null)}
                ></button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      className="form-control forum-input"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Content</label>
                    <textarea
                      className="form-control forum-input"
                      rows="4"
                      value={editForm.text}
                      onChange={(e) =>
                        setEditForm({ ...editForm, text: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-forum-switch rounded-pill px-4"
                    onClick={() => setEditPost(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-custom rounded-pill px-4">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title">Delete Post</h5>
                <button
                  className="btn-close"
                  onClick={() => setDeleteModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this post?
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-forum-switch rounded-pill px-4"
                  onClick={() => setDeleteModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-logout px-4"
                  onClick={() => handleDelete(deleteModal)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
