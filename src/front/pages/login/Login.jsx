import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const Login = ({ apiEndpoint, dispatchType, redirectPath, signupPath, tokenKey, title }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();
  
  const successMessage = location.state?.message;

  useEffect(() => {
    if (store[tokenKey]) {
      navigate(redirectPath);
    }
  }, [store[tokenKey], navigate, redirectPath, tokenKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await resp.json();
      
      if (resp.ok) {
        dispatch({ type: dispatchType, payload: data });
      } else {
        setError(data.msg || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
      <div className="auth-wrapper d-flex flex-column justify-content-center align-items-center mt-5 text-center" style={{ height: "calc(85vh - 56px)", overflow: "hidden" }}>
      <div className="custom-container">
        <h1 className="text-center mb-2 fw-normal">{title}</h1>
        <p className="text-center text-muted mb-4">Enter your credentials to access</p>

        {successMessage && <div className="alert alert-success p-2 text-center small">{successMessage}</div>}
        {error && <div className="alert alert-danger p-2 text-center small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-custom w-100 py-2 mb-3">
            Login
          </button>
        </form>

        <p className="mt-2 mb-0 text-center">
          Don't have an account? <Link to={signupPath} className="fw-bold text-decoration-none">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};