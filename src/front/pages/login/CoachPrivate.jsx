import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const CoachPrivate = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.coachToken) navigate("/");
  }, [store.coachToken, navigate]);

    return (
        <div className="text-center mt-5 container">
            <h1 className="display-4 mt-5">Coach</h1>

            <div className="row mt-4 g-3">
                {[
                    { to: "/client-favorites", label: "Client Fav" },
                    { to: "/coach-favorites", label: "Coach Fav" },
                    { to: "/access-coach", label: "Access Coach" },
                ].map((item, index) => (
                    <div key={index} className="col-6 col-md-3 col-lg-4">
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