import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ClientPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  const menuItems = [
    { to: "/entries", icon: "bi-book", label: "Entries" },
    { to: "/forum", icon: "bi bi-chat-dots", label: "Forum" },
    { to: "/access", icon: "bi-key", label: "Access" },
    { to: "/shared", icon: "bi-link-45deg", label: "Shared" },
    { to: "/client-private", icon: "bi-bar-chart", label: "Stats" },
  ];

  return (
    <div style={{ height: "calc(90vh - 56px)", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative" }}>
 
      <div className="glass-sphere"></div> 

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", zIndex: 1, paddingTop: "40px"}}>
        <h1 style={{ fontWeight: 600, color: "#1a1a1a" }}>How do you feel today?</h1>
        <p style={{ color: "#555" }}>Start tracking your emotions</p>
      </div>

      <div className="d-flex justify-content-around align-items-center pt-3 pb-3" style={{ borderTop: "1px solid #eee", backgroundColor: "none", zIndex: 2 }}>
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