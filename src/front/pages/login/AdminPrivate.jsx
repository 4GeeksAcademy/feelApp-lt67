import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const AdminPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.admintToken) navigate("/admint-login");
  }, [store.admintToken, navigate]);

    return (
        <div className="container text-center" style={{ marginTop:"80px" }} >
            <h1 className="display-4 py-5">Admin Panel</h1>
        </div>
    );
};