import { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ClientPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.clientToken) navigate("/");
  }, [store.clientToken]);

  return (
    <div style={{ height: "calc(90vh - 56px)", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", position: "relative" }}>
 
      <div className="glass-sphere"></div> 

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", zIndex: 1, paddingTop: "40px"}}>
        <h1 style={{ fontWeight: 600, color: "#1a1a1a" }}>How do you feel today?</h1>
        <p style={{ color: "#555" }}>Start tracking your emotions</p>
      </div>

    </div>
  );
};