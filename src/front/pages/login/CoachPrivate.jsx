import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CoachPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.coachToken) navigate("/");
  }, [store.coachToken, navigate]);

  const menuItems = [
    { to: "/client-favorites", icon: "bi-heart", label: "Client Fav" },
    { to: "/coach-favorites", icon: "bi-star", label: "Coach Fav" },
    { to: "/access-coach", icon: "bi-chat-dots", label: "AccessCoach" },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <div className="glass-sphere"></div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <h1 style={{ fontWeight: 600, color: "#1a1a1a" }}>Coach</h1>
        <p style={{ color: "#555" }}>Manage your coach tools</p>
      </div>

      <div
        className="d-flex justify-content-around align-items-center "
        style={{
          borderTop: "1px solid #eee",
          backgroundColor: "transparent",
          zIndex: 1,
        }}
      >
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-decoration-none text-dark d-flex flex-column align-items-center gap-1"
            style={{ fontSize: 12, minWidth: "60px" }}
          >
            <i className={`bi ${item.icon}`} style={{ fontSize: "22px" }}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};