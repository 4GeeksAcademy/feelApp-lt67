import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ClientPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  const handleStartTracking = () => {
    navigate("/entries/create");
    window.dispatchEvent(new CustomEvent("openSidebar"));
  };

  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        paddingTop: "70px",
      }}
    >

      <div className="glass-sphere-animated"></div>

      <div
        style={{
          zIndex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1 style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "2.5rem", margin: 0 }}>
          How do you feel today?
        </h1>

        <button
          onClick={handleStartTracking}
          style={{
            background: "linear-gradient(135deg, #b3e5fc 0%, #f8bbd0 100%)",
            border: "none",
            color: "#444",
            fontWeight: 600,
            padding: "14px 32px",
            borderRadius: "50px",
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(179, 229, 252, 0.3)",
            transition: "all 0.3s ease",
            marginTop: "10px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(179, 229, 252, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(179, 229, 252, 0.3)";
          }}
        >
          <i className="bi bi-arrow-right me-2"></i>
          Start tracking your emotions
        </button>
      </div>

      <style>{`
        @keyframes liquidFlow {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translate(-48%, -48%) scale(1.05);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.02);
            opacity: 0.85;
          }
          75% {
            transform: translate(-52%, -52%) scale(0.98);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
        }

        @keyframes shimmer {
          0% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), 
                        inset 0 0 15px rgba(255, 255, 255, 0.2),
                        0 0 40px rgba(179, 229, 252, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.15), 
                        inset 0 0 20px rgba(255, 255, 255, 0.3),
                        0 0 60px rgba(179, 229, 252, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), 
                        inset 0 0 15px rgba(255, 255, 255, 0.2),
                        0 0 40px rgba(179, 229, 252, 0.2);
          }
        }

        .glass-sphere-animated {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          z-index: 0;
          animation: liquidFlow 6s ease-in-out infinite, shimmer 4s ease-in-out infinite;
          overflow: hidden;
        }

        .glass-sphere-animated::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.05) 75%,
            transparent 100%
          );
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
