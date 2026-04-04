import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const LoginLanding = ({ tokenKey, loginPath, signupPath, privatePath, title }) => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (store[tokenKey]) navigate(privatePath);
  }, [store[tokenKey]]);

  return (
    <div className="auth-wrapper d-flex flex-column justify-content-center align-items-center mt-5 text-center" style={{ height: "calc(85vh - 56px)", overflow: "hidden" }}>
      <div className="custom-container text-center">
        <h1 className="mb-4 fw-normal">{title}</h1>
        <p className="text-muted mb-4">Please log in to continue to your dashboard</p>
        
        <Link to={loginPath} className="text-decoration-none">
          <button className="btn btn-custom w-45 py-2 mb-3">Go to Login</button>
        </Link>
        
        <p className="mt-3 mb-0">
          Don't have an account? <Link to={signupPath} className="fw-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};