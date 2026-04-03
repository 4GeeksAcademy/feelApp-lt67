import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (store.clientToken) {
      dispatch({ type: "logout_client" });
      navigate("/");
    } else if (store.coachToken) {
      dispatch({ type: "logout_coach" });
      navigate("/");
    } else if (store.admintToken) {
      dispatch({ type: "logout_admint" });
      navigate("/");
    }
  };

  const isLoggedIn = store.clientToken || store.coachToken || store.admintToken;

  return (
    <nav className="navbar custom-navbar p-2">
      <div className="container">
      {!isLoggedIn ? (  
        <Link to="/"><span className="navbar-brand mb-0 h1">FeelApp</span></Link>
       ) : (
          <Link 
            to={
              store.clientToken ? "/client-private" :
              store.coachToken  ? "/coach-private" :
              store.admintToken ? "/admint-private" : 
              "/"
            }
          >
          <span className="navbar-brand mb-0">FeelApp</span>
        </Link>
       )}
        <div className="d-flex gap-2 align-items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/client-login-landing"><button className="btn">Log as a Client</button></Link>
              <Link to="/coach-login-landing"><button className="btn">Log as a Coach</button></Link>
              <Link to="/admint-login-landing"><button className="btn">Log as an Admin</button></Link>
            </>
          ) : (
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          )}
          <Link to="/crudlist"><button className="btn">CRUDs</button></Link>
        </div>
      </div>
    </nav>
  );
};