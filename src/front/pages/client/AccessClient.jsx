import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const AccessClient = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [searchClient, setSearchClient] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const myId = store.clientId;

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients`, {
      headers: { Authorization: `Bearer ${store.clientToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          dispatch({ type: "set_access_clients", payload: data });
      });

    if (store.clients.length === 0) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${store.clientToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data))
            dispatch({ type: "set_clients", payload: data });
        });
    }
  }, []);

  const sendClientRequest = async (sharedWithId) => {
    setError("");
    setSuccess("");
    const already = store.access_clients.find(
      (a) =>
        String(a.client_id) === String(myId) &&
        String(a.shared_with_id) === String(sharedWithId)
    );
    if (already) {
      setError("Request already sent to this client");
      return;
    }

    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/access-clients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.clientToken}`,
        },
        body: JSON.stringify({ shared_with_id: sharedWithId }),
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      dispatch({ type: "add_access_client", payload: data });
      setSuccess("Request sent!");
    } else {
      setError(data.msg || "Error sending request");
    }
  };

  const updateClientAccess = async (id, status) => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/access-clients/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.clientToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );
    const data = await resp.json();
    if (resp.ok) {
      dispatch({ type: "add_access_client", payload: data });
    }
  };

  const deleteClientAccess = async (id) => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/access-clients/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${store.clientToken}` },
      }
    );
    if (resp.ok) {
      dispatch({ type: "remove_access_client", payload: id });
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

  const sentToClients = store.access_clients.filter(
    (a) => String(a.client_id) === String(myId)
  );
  const receivedFromClients = store.access_clients.filter(
    (a) =>
      String(a.shared_with_id) === String(myId) &&
      String(a.client_id) !== String(myId)
  );

  const filteredClients = store.clients.filter(
    (c) =>
      String(c.id) !== String(myId) &&
      c.email?.toLowerCase().includes(searchClient.toLowerCase())
  );

  return (
    <div className="container mt-5" style={{ maxWidth: "680px", paddingTop: "80px" }}>
      <div className="mb-4">
        <h2 className="mb-0">Friends Access</h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Manage who can see your entries
        </p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <div>
        <div className="forum-card p-3 mb-4">
          <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Send access request to a friend
          </p>
          <input
            className="form-control forum-input mb-3"
            placeholder="Search by email..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
          />
          {searchClient && (
            <div className="d-flex flex-column gap-2">
              {filteredClients.length === 0 && (
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  No friends found
                </p>
              )}
              {filteredClients.map((c) => {
                const alreadySent = sentToClients.find(
                  (a) => String(a.shared_with_id) === String(c.id)
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
                        onClick={() => sendClientRequest(c.id)}
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

        {sentToClients.length > 0 && (
          <div className="mb-4">
            <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Sent requests
            </p>
            <div className="d-flex flex-column gap-2">
              {sentToClients.map((a) => (
                <div
                  key={a.id}
                  className="forum-card p-3 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span style={{ fontSize: "0.9rem" }}>
                      {a.shared_with_email || `Friend #${a.shared_with_id}`}
                    </span>
                    <div className="mt-1">{statusBadge(a.status)}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-forum-switch rounded-pill"
                    onClick={() => deleteClientAccess(a.id)}
                  >
                    <i className="bi bi-x"></i> Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {receivedFromClients.length > 0 && (
          <div className="mb-4">
            <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Received requests
            </p>
            <div className="d-flex flex-column gap-2">
              {receivedFromClients.map((a) => (
                <div key={a.id} className="forum-card p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: "0.9rem" }}>
                        {a.client_email || `Friend #${a.client_id}`}
                      </span>
                      <div className="mt-1">{statusBadge(a.status)}</div>
                    </div>
                    {a.status === "pending" && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm rounded-pill px-3"
                          style={{
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                          }}
                          onClick={() => updateClientAccess(a.id, "approved")}
                        >
                          <i className="bi bi-check me-1"></i>Approve
                        </button>
                        <button
                          className="btn btn-sm rounded-pill px-3"
                          style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
                          onClick={() => updateClientAccess(a.id, "rejected")}
                        >
                          <i className="bi bi-x me-1"></i>Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sentToClients.length === 0 &&
          receivedFromClients.length === 0 &&
          !searchClient && (
            <p className="text-muted text-center mt-4">
              No access requests yet
            </p>
          )}
      </div>
    </div>
  );
};

export default AccessClient;
