import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = ({ onToggleSidebar }) => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const activeToken = store.clientToken || store.coachToken || store.admintToken;

  const handleLogoClick = () => {
    if (activeToken) {
      if (store.clientToken) navigate("/client-private");
      else if (store.coachToken) navigate("/coach-private");
      else if (store.admintToken) navigate("/admint-private");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid container">
        {activeToken && (
          <button
            onClick={onToggleSidebar}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              color: "#333",
              cursor: "pointer",
              padding: "8px 12px",
              marginRight: "12px",
            }}
            title="Toggle Sidebar"
          >
            <i className="bi bi-list"></i>
          </button>
        )}

        <button onClick={handleLogoClick} className="navbar-brand logo-feelapp" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          FeelApp
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto text-center">
            {!activeToken ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to="/">
                    Who are we?
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to="/">
                    Contact
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                </li>
              </>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-center gap-2 ms-auto">
            {!activeToken ? (
              <div className="dropdown">
                <button className="btn btn-login dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Login
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow text-center">
                  <li>
                    <Link className="dropdown-item" to="/client-login">
                      Client
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/coach-login">
                      Coach
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admint-login">
                      Admin
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

