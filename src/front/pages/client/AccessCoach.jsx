import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AccessCoach = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [searchCoach, setSearchCoach] = useState("");
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const myId = store.clientId;

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken, navigate]);

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
  }, [dispatch, store.clientToken, store.coachs.length]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setError("");
      setSuccess("");
      
      const coach = store.coachs.find(
        (c) => c.email?.toLowerCase() === searchCoach.toLowerCase().trim()
      );

      if (coach) {
        setSelectedCoach(coach);
      } else {
        setSelectedCoach(null);
        setError("Coach not found with that exact email.");
      }
    }
  };

  const sendCoachRequest = async (coachId) => {
    setError("");
    setSuccess("");
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.clientToken}`,
      },
      body: JSON.stringify({ coach_id: coachId }),
    });
    const data = await resp.json();
    if (resp.ok) {
      dispatch({ type: "add_access_coach", payload: data });
      setSuccess("Request sent to coach!");
      setSearchCoach("");
      setSelectedCoach(null);
    } else {
      setError(data.msg || "Error sending request");
    }
  };

  const respondToRequest = async (id, status) => {
    setError("");
    setSuccess("");
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${store.clientToken}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await resp.json();
    if (resp.ok) {
      dispatch({ type: "remove_access_coach", payload: id });
      dispatch({ type: "add_access_coach", payload: data });
      setSuccess(`Request ${status}!`);
    } else {
      setError(data.error || "Action failed");
    }
  };

  const deleteCoachAccess = async (id) => {
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${store.clientToken}` },
    });
    if (resp.ok) {
      dispatch({ type: "remove_access_coach", payload: id });
      setSuccess("Connection removed");
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
      <span style={{ backgroundColor: s.bg, color: s.color, padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 }}>
        {s.text}
      </span>
    );
  };

  const myConnections = store.access_coach.filter(
    (a) => String(a.client_id) === String(myId) && a.status !== "pending"
  );

  const coachRequests = store.access_coach.filter(
    (a) => String(a.client_id) === String(myId) && a.status === "pending"
  );

  return (
    <div className="container mt-5" style={{ maxWidth: "680px", paddingTop: "80px" }}>
      <div className="mb-4">
        <h2 className="mb-0">Coach Management</h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Manage access and connections with professionals
        </p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      {coachRequests.length > 0 && (
        <div className="mb-4">
          <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Incoming Coach Requests
          </p>
          <div className="d-flex flex-column gap-2">
            {coachRequests.map((a) => (
              <div key={a.id} className="forum-card p-3 d-flex justify-content-between align-items-center" style={{ borderLeft: "4px solid #fbbf24" }}>
                <div>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{a.coach_email || `Coach #${a.coach_id}`}</span>
                  <div className="small text-muted">Wants to access your entries</div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-success rounded-pill px-3" onClick={() => respondToRequest(a.id, "approved")}>
                    Approve
                  </button>
                  <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => respondToRequest(a.id, "rejected")}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="forum-card p-3 mb-4">
        <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
          Find a coach
        </p>
        <input
          className="form-control forum-input mb-3"
          placeholder="Search by email and press Enter..."
          value={searchCoach}
          onChange={(e) => {
            setSearchCoach(e.target.value);
            if (selectedCoach) setSelectedCoach(null);
          }}
          onKeyDown={handleKeyDown}
        />
        
        {selectedCoach && (
          <div className="d-flex flex-column gap-2">
            <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: "#f9fafb" }}>
              <span style={{ fontSize: "0.9rem" }}>{selectedCoach.email}</span>
              {store.access_coach.find(a => String(a.coach_id) === String(selectedCoach.id)) ? (
                statusBadge(store.access_coach.find(a => String(a.coach_id) === String(selectedCoach.id)).status)
              ) : (
                <button className="btn btn-sm btn-custom rounded-pill px-3" onClick={() => sendCoachRequest(selectedCoach.id)}>
                  Grant Access
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {myConnections.length > 0 && (
        <div className="mb-4">
          <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            My Connections
          </p>
          <div className="d-flex flex-column gap-2">
            {myConnections.map((a) => (
              <div key={a.id} className="forum-card p-3 d-flex justify-content-between align-items-center">
                <div>
                  <span style={{ fontSize: "0.9rem" }}>{a.coach_email || `Coach #${a.coach_id}`}</span>
                  <div className="mt-1">{statusBadge(a.status)}</div>
                </div>
                <button className="btn btn-sm btn-forum-switch rounded-pill" onClick={() => deleteCoachAccess(a.id)}>
                  <i className="bi bi-trash me-1"></i> Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCoach;