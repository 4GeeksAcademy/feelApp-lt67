import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (store.clientToken) dispatch({ type: "logout_client" });
    else if (store.coachToken) dispatch({ type: "logout_coach" });
    else if (store.admintToken) dispatch({ type: "logout_admint" });
    navigate("/");
  };

  const isLoggedIn = store.clientToken || store.coachToken || store.admintToken;

  const getHomePath = () => {
    if (store.clientToken) return "/client-private";
    if (store.coachToken) return "/coach-private";
    if (store.admintToken) return "/admint-private";
    return "/";
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
      <div className="container-fluid container">
        <Link className="navbar-brand logo-feelapp" to="/">
          FeelApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto text-center">
            <li className="nav-item">
              <Link className="nav-link fw-bold" to={getHomePath()}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-center gap-2 ms-auto">
            {!isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-login dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow text-center">
                  <li><Link className="dropdown-item" to="/client-login">Client</Link></li>
                  <li><Link className="dropdown-item" to="/coach-login">Coach</Link></li>
                  <li><Link className="dropdown-item" to="/admint-login">Admin</Link></li>
                </ul>
              </div>
            ) : (
              <button className="btn btn-logout" onClick={handleLogout}>
                Logout
              </button>
            )}
            
            <Link to="/crudlist">
              <button className="btn btn-cruds">CRUDs</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};