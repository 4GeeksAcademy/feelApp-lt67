import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ClientPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.clientToken) navigate("/client-login");
  }, [store.clientToken]);

  return (
    <div style={{ height: "calc(90vh - 56px)", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", padding: "0 1rem" }}>
        <h1 style={{ fontWeight: 500, marginBottom: "1rem" }}>How do you feel today?</h1>
        <p style={{ letterSpacing: "0.02em", margin: 0 }}>Start tracking your emotions</p>
      </div>

      <div className="d-flex justify-content-around align-items-center pt-3" style={{ borderTop: "1px solid #eee" }}>
        {[
          { to: "/entries", icon: "✏️", label: "New Entry" },
          { to: "/forum", icon: "💬", label: "Forum" }, 
          { to: "/access", icon: "🔑", label: "Access" },
          { to: "/shared", icon: "🔗", label: "Shared" },
          { to: "/client-private", icon: "📊", label: "Stats" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="text-decoration-none text-dark d-flex flex-column align-items-center gap-1" style={{ fontSize: 12 }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

    </div>
  );
};