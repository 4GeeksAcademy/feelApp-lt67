import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const AdminPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.admintToken) navigate("/admint-login");
  }, [store.admintToken, navigate]);

    return (
        <div className="text-center mt-5 container">
            <h1 className="display-4 mt-5">Admin Panel</h1>

            <div className="row mt-4 g-3">
                {[
                    { to: "/clients", label: "Clients" },
                    { to: "/admints", label: "Admins" },
                    { to: "/coachs", label: "Coachs" },
                    { to: "/emotions", label: "Emotions" },
                    { to: "/admint-posts", label: "Admins posts" },
                    { to: "/reactions", label: "Reaction admins posts" },
                    { to: "/clients-posts", label: "Client Posts" },
                    { to: "/reactions-client", label: "Reaction Client Post" },
                    { to: "/access-coach", label: "Access Coach" },
                    { to: "/access-clients", label: "Access Client" },
                ].map((item, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-3">
                        <Link to={item.to} className="d-grid">
                            <button className="btn btn-primary">
                                {item.label}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};