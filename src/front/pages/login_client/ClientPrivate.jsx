import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ClientPrivate = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate("/client-login");
        }
    }, [store.token]);

    return (
        <div className="container mt-5">
            <h2>Private Page</h2>
            <img src="https://img.freepik.com/free-vector/yay-word-retro-typography-vector_53876-177322.jpg?semt=ais_rp_50_assets&w=740&q=80" alt="private" className="img-fluid" />
        </div>
    );
};