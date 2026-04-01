import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const AdminPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.admintToken) navigate("/admint-login");
  }, [store.admintToken, navigate]);

  return <h1>Admin</h1>;
};