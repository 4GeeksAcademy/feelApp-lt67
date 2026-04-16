import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Sidebar } from "../../components/Sidebar";

export const CoachPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.coachToken) {
      navigate("/");
    }
  }, [store.coachToken, navigate]);

  const coachMenu = [
    {
      title: "CLIENTS",
      items: [
        {
          to: "/my-clients",
          icon: "bi-people",
          label: "My Clients",
          active: true
        }
      ]
    },
    {
      title: "TOOLS",
      items: [
        {
          to: "/client-favorites",
          icon: "bi-heart",
          label: "Client Fav"
        },
        {
          to: "/coach-favorites",
          icon: "bi-star",
          label: "Coach Fav"
        },
        {
          to: "/access-coach",
          icon: "bi-chat-dots",
          label: "AccessCoach"
        }
      ]
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)"
      }}
    >
      <Sidebar menuItems={coachMenu} title="FeelApp" />

      <div
        style={{
          textAlign: "center"
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "700"
          }}
        >
          Manage your coach tools
        </h1>

        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: "#666"
          }}
        >
          Access your favorites, clients and coach tools from the sidebar.
        </p>
      </div>
    </div>
  );
};