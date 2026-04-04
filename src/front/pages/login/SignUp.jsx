import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const SignUp= ({ apiEndpoint, loginPath, title }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await resp.json();
    if (resp.ok) {
      navigate(loginPath, { state: { message: "Account created! Please log in." } });
    } else {
      setError(data.msg);
    }
  };

  return (
      <div className="auth-wrappe d-flex flex-column justify-content-center align-items-center mt-5" style={{ height: "calc(85vh - 56px)", overflow: "hidden" }}>
        <div className="custom-container p-5 m-5">
        <h2 className="text-center mb-4">{title}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-custom w-100 py-2">Register</button>
        </form>
        
        <p className="mt-4 text-center mb-0">
          Already have an account? <Link to={loginPath} className="fw-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
};