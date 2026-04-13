import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logImg from "../../assets/img/logImg.jpeg";

export const SignUp = ({ apiEndpoint, loginPath, title }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await resp.json();
      setLoading(false);

      if (resp.ok) {
        navigate(loginPath, { state: { message: "Account created! Please log in." } });
      } else {
        setError(data.msg || "Registration failed.");
      }
    } catch (err) {
      setLoading(false);
      setError("Server error.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
      background: `linear-gradient(135deg, #E9DBFF 0%, #DCD7FF 25%, #D5FAFF 50%, #D4D6FF 75%, #D6D8FF 100%)`,
      backgroundAttachment: "fixed"
    }}>
      <style>{`
        .auth-container {
          display: flex;
          width: 75%;
          max-width: 900px;
          height: 650px;
          background: white;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .img-side {
          flex: 0 0 50%;
          background: url(${logImg}) center/cover no-repeat;
          display: flex;
          align-items: flex-end;
          padding: 60px;
          position: relative;
        }
        
        .img-side::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, rgba(30, 41, 59, 0.7), transparent);
          z-index: 1;
        }

        .side-text-area {
          position: relative;
          z-index: 2;
          color: white;
        }

        .form-side {
          flex: 0 0 50%;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }

        .form-input {
          width: 100%;
          border-radius: 10px;
          padding: 10px 15px;
          border: 1px solid #e2e8f0;
          font-size: 0.95rem;
          height: 45px;
          margin-bottom: 15px;
        }

      `}</style>

      <div className="auth-container">
        <div className="img-side">
          <div className="side-text-area">
            <p style={{ opacity: 0.8, marginBottom: "8px" }}>Join us today</p>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Start your journey towards a better mindset</h1>
          </div>
        </div>

        <div className="form-side">
          <div style={{ width: "100%", maxWidth: "320px", margin: "0 auto" }}>
            <h2 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "5px" }}>{title}</h2>
            <p className="text-muted small mb-4">Create your account to get started</p>

            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <label className="small fw-bold text-secondary mb-1">Email address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              
              <label className="small fw-bold text-secondary mb-1">Create Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />

              <button type="submit" className="btn btn-primary-custom p-2 w-100 mt-2" disabled={loading}>
                {loading ? "Creating Account..." : "Register Now"}
              </button>
            </form>
            
            <p className="text-center mt-4 small text-muted">
              Already have an account? <Link to={loginPath} className="text-primary fw-bold text-decoration-none">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};





