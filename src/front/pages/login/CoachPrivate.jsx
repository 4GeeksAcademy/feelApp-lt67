import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CoachPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.coachToken) navigate("/coach-login");
  }, [store.coachToken, navigate]);

  return <h1>Coach</h1>;
};