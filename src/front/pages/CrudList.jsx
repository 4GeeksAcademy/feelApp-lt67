import { Link } from "react-router-dom";

export const CrudList = () => {
    return (
        <div className="text-center mt-5 container">
            <h1 className="display-4">CRUD list</h1>

            <div className="row mt-4 g-3">
                {[
                    { to: "/clients", label: "Clients" },
                    { to: "/admints", label: "Admins" },
                    { to: "/coachs", label: "Coachs" },
                    { to: "/emotions", label: "Emotions" },
                    { to: "/admint-posts", label: "Admins posts" },
                    { to: "/reactions", label: "Reaction admins posts" },
                    { to: "/entries", label: "Entries" },
                    { to: "/client-favorites", label: "Client Fav" },
                    { to: "/reaction-entries", label: "Reaction Entries" },
                    { to: "/coach-favorites", label: "Coach Fav" },
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