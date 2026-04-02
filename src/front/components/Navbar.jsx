import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (store.clientToken) {
      dispatch({ type: "logout_client" });
      navigate("/client-login-landing");
    } else if (store.coachToken) {
      dispatch({ type: "logout_coach" });
      navigate("/coach-login-landing");
    } else if (store.admintToken) {
      dispatch({ type: "logout_admint" });
      navigate("/admint-login-landing");
    }
  };

  const isLoggedIn = store.clientToken || store.coachToken || store.admintToken;

  return (
    <nav className="navbar navbar-light bg-light">
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
          <span className="navbar-brand mb-0 h1">FeelApp</span>
        </Link>
       )}
        <div className="d-flex gap-2 align-items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/client-login-landing"><button className="btn btn-primary">Log as a Client</button></Link>
              <Link to="/coach-login-landing"><button className="btn btn-primary">Log as a Coach</button></Link>
              <Link to="/admint-login-landing"><button className="btn btn-primary">Log as an Admin</button></Link>
            </>
          ) : (
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          )}
          <Link to="/crudlist"><button className="btn btn-primary">CRUDs</button></Link>
        </div>
      </div>
    </nav>
  );
};