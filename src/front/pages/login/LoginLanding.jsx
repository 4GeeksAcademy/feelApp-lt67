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
    <div className="container mt-5 text-center">
      <h1>{title}</h1>
      <p className="lead">Please log in to continue</p>
      <Link to={loginPath}>
        <button className="btn btn-primary me-2">Go to Login</button>
      </Link>
      <p className="mt-3">Don't have an account? <Link to={signupPath}>Sign Up</Link></p>
    </div>
  );
};