import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Profile } from "./Profile";

export const Sidebar = ({ isOpen, onClose }) => {
  const { store } = useGlobalReducer();
  const location = useLocation();

  const activeToken = store.clientToken || store.coachToken || store.admintToken;
  const isClient = !!store.clientToken;
  const isCoach = !!store.coachToken;
  const isAdmin = !!store.admintToken;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!activeToken) return null;

  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: isActive(path) ? "#3b82f6" : "#6b7280",
    fontWeight: isActive(path) ? "600" : "500",
    padding: "10px 14px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s",
    backgroundColor: isActive(path) ? "#eff6ff" : "transparent",
    marginBottom: "6px",
    fontSize: "0.95rem",
  });

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1099,
          animation: "fadeIn 0.2s ease-in",
        }}
      />

      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "280px",
          backgroundColor: "#f9fafb",
          borderRight: "1px solid #e5e7eb",
          overflow: "hidden",
          overflowY: "auto",
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
          paddingTop: "20px",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
          animation: "slideInLeft 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "0 16px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5 className="logo-feelapp" style={{ color: "#1f2937", fontWeight: "700", marginBottom: 0 }}>FeelApp</h5>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.3rem",
              color: "#9ca3af",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
          {isClient && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Entries
                </h6>
                <Link to="/entries/create" style={linkStyle("/entries/create")}>
                  <i className="bi bi-plus-circle"></i>
                  <span>New Entry</span>
                </Link>
                <Link to="/entries" style={linkStyle("/entries")}>
                  <i className="bi bi-journal-text"></i>
                  <span>My Entries</span>
                </Link>
                <Link to="/stats" style={linkStyle("/stats")}>
                  <i className="bi bi-graph-up"></i>
                  <span>Stats</span>
                </Link>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Friends
                </h6>
                <Link to="/access/friends" style={linkStyle("/access/friends")}>
                  <i className="bi bi-people"></i>
                  <span>Friends</span>
                </Link>
                <Link to="/shared" style={linkStyle("/shared")}>
                  <i className="bi bi-share"></i>
                  <span>Shared Entries</span>
                </Link>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Forum
                </h6>
                      <Link to="/client/post" style={linkStyle("/client/post")}>
                  <i className="bi bi-plus-circle"></i>
                  <span>New Post</span>
                </Link>
                <Link to="/forum" style={linkStyle("/forum")}>
                  <i className="bi bi-chat-dots"></i>
                  <span>Forum</span>
                </Link>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Connect
                </h6>
                <Link to="/nearyou" style={linkStyle("/nearyou")}>
                  <i className="bi bi-geo-alt"></i>
                  <span>Find Near You</span>
                </Link>
                <Link to="/access/coach" style={linkStyle("/access/coach")}>
                  <i className="bi bi-briefcase"></i>
                  <span>My Coach</span>
                </Link>
              </div>
            </>
          )}

          {isCoach && (
            <div style={{ marginBottom: "28px" }}>
              <h6
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: "0 8px 12px",
                }}
              >
                Clients
              </h6>
                <Link to="/access-coach" style={linkStyle("/access-coach")}>
                  <i className="bi bi-people"></i>
                  <span>My clients</span>
                </Link>
                {/*
              <Link to="/coach-favorites" style={linkStyle("/coach-favorites")}>
                <i className="bi-star"></i>
                <span>My favorite entries</span>
              </Link>
              */}
              <Link to="/access-coach/create" style={linkStyle("/access-coach/create")}>
                <i className="bi-chat-dots"></i>
                <span>Access</span>
              </Link>
                    <Link to="/nearyou" style={linkStyle("/nearyou")}>
                  <i className="bi bi-geo-alt"></i>
                  <span>Find Near You</span>
                </Link>
            </div>
          )}

          {isAdmin && (
             <>
              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Users
                </h6>
                <Link to="/clients" style={linkStyle("/clients")}>
                  <i className="bi bi-person"></i>
                  <span>Clients</span>
                </Link>
                <Link to="/coachs" style={linkStyle("/coachs")}>
                  <i className="bi bi-person"></i>
                  <span>Coaches</span>
                </Link>
                <Link to="/admints" style={linkStyle("/admints")}>
                  <i className="bi bi-person"></i>
                  <span>Admins</span>
                </Link>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Posts
                </h6>
                <Link to="/clients-posts" style={linkStyle("/clients-posts")}>
                  <i className="bi bi-pencil-square"></i>
                  <span>Clients Posts</span>
                </Link>
                 <Link to="/reactions-client" style={linkStyle("/reactions-client")}>
                  <i className="bi bi-emoji-smile"></i>
                  <span>Reaction Client Post</span>
                </Link>
                <Link to="/admint-posts" style={linkStyle("/admint-posts")}>
                  <i className="bi bi-pencil-square"></i>
                  <span>Admin Posts</span>
                </Link>
                <Link to="/reactions" style={linkStyle("/reactions")}>
                  <i className="bi bi-emoji-smile"></i>
                  <span>Reaction admin Post</span>
                </Link>
              </div>

               <div style={{ marginBottom: "28px" }}>
                <h6
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 8px 12px",
                  }}
                >
                  Create 
                </h6>
                <Link to="/admint-posts/create" style={linkStyle("/admint-posts/create")}>
                  <i className="bi bi-plus-circle"></i>
                  <span>New Post</span>
                </Link>
                 <Link to="/emotions" style={linkStyle("/emotions")}>
                  <i className="bi bi-plus-circle"></i>
                  <span>New emotion</span>
                </Link>
              </div> 
            </>
            )}
        </nav>

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Profile />
        </div>
      </aside>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
