import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AccessCoach = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [searchCoach, setSearchCoach] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const myId = store.clientId;

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
      headers: { Authorization: `Bearer ${store.clientToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          dispatch({ type: "set_access_coach", payload: data });
      });

    if (store.coachs.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/coachs`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_coachs", payload: data });
        });
    }
  }, []);

  const sendCoachRequest = async (coachId) => {
    setError("");
    setSuccess("");
    const already = store.access_coach.find(
      (a) =>
        String(a.client_id) === String(myId) &&
        String(a.coach_id) === String(coachId)
    );
    if (already) {
      setError("Request already sent to this coach");
      return;
    }

    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/access-coach`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.clientToken}`,
        },
        body: JSON.stringify({ coach_id: coachId }),
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      dispatch({ type: "add_access_coach", payload: data });
      setSuccess("Request sent to coach!");
    } else {
      setError(data.msg || "Error sending request");
    }
  };

  const deleteCoachAccess = async (id) => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${store.clientToken}` },
      }
    );
    if (resp.ok) {
      dispatch({ type: "remove_access_coach", payload: id });
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: { bg: "#fff9c4", color: "#b45309", text: "Pending" },
      approved: { bg: "#d1fae5", color: "#065f46", text: "Approved" },
      rejected: { bg: "#fee2e2", color: "#991b1b", text: "Rejected" },
    };
    const s = map[status] || map.pending;
    return (
      <span
        style={{
          backgroundColor: s.bg,
          color: s.color,
          padding: "2px 10px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
      >
        {s.text}
      </span>
    );
  };

  const sentToCoaches = store.access_coach.filter(
    (a) => String(a.client_id) === String(myId)
  );

  const filteredCoaches = store.coachs.filter((c) =>
    c.email?.toLowerCase().includes(searchCoach.toLowerCase())
  );

  return (
    <div className="container mt-5" style={{ maxWidth: "680px", paddingTop: "80px" }}>
      <div className="mb-4">
        <h2 className="mb-0">My Coach</h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Connect with a professional to track your progress
        </p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <div>
        <div className="forum-card p-3 mb-4">
          <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Send access request to a coach
          </p>
          <input
            className="form-control forum-input mb-3"
            placeholder="Search by email..."
            value={searchCoach}
            onChange={(e) => setSearchCoach(e.target.value)}
          />
          {searchCoach && (
            <div className="d-flex flex-column gap-2">
              {filteredCoaches.length === 0 && (
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  No coaches found
                </p>
              )}
              {filteredCoaches.map((c) => {
                const alreadySent = sentToCoaches.find(
                  (a) => String(a.coach_id) === String(c.id)
                );
                return (
                  <div
                    key={c.id}
                    className="d-flex justify-content-between align-items-center p-2 rounded"
                    style={{ backgroundColor: "#f9fafb" }}
                  >
                    <span style={{ fontSize: "0.9rem" }}>{c.email}</span>
                    {alreadySent ? (
                      statusBadge(alreadySent.status)
                    ) : (
                      <button
                        className="btn btn-sm btn-custom rounded-pill px-3"
                        onClick={() => sendCoachRequest(c.id)}
                      >
                        <i className="bi bi-send me-1"></i>Send
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {sentToCoaches.length > 0 && (
          <div className="mb-4">
            <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Sent requests
            </p>
            <div className="d-flex flex-column gap-2">
              {sentToCoaches.map((a) => (
                <div
                  key={a.id}
                  className="forum-card p-3 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span style={{ fontSize: "0.9rem" }}>
                      {a.coach_email || `Coach #${a.coach_id}`}
                    </span>
                    <div className="mt-1">{statusBadge(a.status)}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-forum-switch rounded-pill"
                    onClick={() => deleteCoachAccess(a.id)}
                  >
                    <i className="bi bi-x"></i> Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sentToCoaches.length === 0 && !searchCoach && (
          <p className="text-muted text-center mt-4">No coach requests yet</p>
        )}
      </div>
    </div>
  );
};

export default AccessCoach;
