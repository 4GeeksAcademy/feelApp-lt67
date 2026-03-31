import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ClientLoginLanding = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (store.token) {
      navigate("/client-private");
    }
  }, [store.token]);

  return (
    <div className="container mt-5 text-center">
      <h1>Welcome</h1>
      <p className="lead">Please log in to continue</p>
      <Link to="/client-login">
        <button className="btn btn-primary me-2">Go to Login</button>
      </Link>
      <p className="mt-3">Don't have an account? <Link to="/client-signup">Sign Up</Link></p>
    </div>
  );
};