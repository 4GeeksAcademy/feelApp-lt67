import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import logImg from "../../assets/img/logImg.jpeg";

export const Login = () => {
  const [userType, setUserType] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (store.clientToken) navigate("/client-private");
    else if (store.coachToken) navigate("/coach-private");
    else if (store.admintToken) navigate("/admint-private");
  }, [store.clientToken, store.coachToken, store.admintToken, navigate]);

  const config = {
    client: { endpoint: "/api/login", dispatchType: "login_client", title: "Client Access", signupPath: "/client-signup" },
    coach: { endpoint: "/api/coach-login", dispatchType: "login_coach", title: "Coach Access", signupPath: "/coach-signup" },
    admint: { endpoint: "/api/admint-login", dispatchType: "login_admint", title: "Admin Access", signupPath: null }
  }[userType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      setLoading(false);
      if (resp.ok) dispatch({ type: config.dispatchType, payload: data });
      else setError(data.msg || "Login failed.");
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
        .login-container {
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

        .toggle-pill-container {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 50px;
          margin-bottom: 30px;
        }

        .btn-toggle-pill {
          flex: 1;
          border: none;
          background: transparent;
          padding: 10px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
          transition: 0.2s;
        }

        .btn-toggle-pill.active {
          background: white;
          color: #1e293b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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

      <div className="login-container">
        <div className="img-side">
          <div className="side-text-area">
            <p style={{ opacity: 0.8, marginBottom: "8px" }}>You can easily</p>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Get access your personal hub for clarity and wellbeing</h1>
          </div>
        </div>

        <div className="form-side">
          <div style={{ width: "100%", maxWidth: "320px", margin: "0 auto" }}>
            <h2 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "5px" }}>{config.title}</h2>
            <p className="text-muted small mb-4">Enter your credentials to access</p>

            <div className="toggle-pill-container">
              <button onClick={() => setUserType("client")} className={`btn-toggle-pill ${userType === "client" ? "active" : ""}`}>Client</button>
              <button onClick={() => setUserType("coach")} className={`btn-toggle-pill ${userType === "coach" ? "active" : ""}`}>Coach</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="small fw-bold text-secondary mb-1">Your email</label>
              <input type="email" className="form-input" placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              
              <label className="small fw-bold text-secondary mb-1">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

              <button type="submit" className="btn btn-primary-custom p-2 w-100" disabled={loading}>
                {loading ? "Loading..." : "Get Started"}
              </button>
            </form>

            {config.signupPath && (
              <p className="text-center mt-4 small text-muted">
                Don't have an account? <Link to={config.signupPath} className="text-primary fw-bold text-decoration-none">Sign up</Link>
              </p>
            )}
            
            <div className="text-center mt-4 pt-3 border-top">
               <button onClick={() => setUserType(userType === "admint" ? "client" : "admint")} className="btn btn-link text-muted small text-decoration-none opacity-50">
                 {userType === "admint" ? "Back to Login" : "Admin Access"}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};