import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const EmotionsList = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/emotions`)
            .then(resp => resp.json())
            .then(data => dispatch({ type: "set_emotions", payload: data }));
    }, []);

    return (
        <div className="container" style={{marginTop:"100px"}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ fontWeight: "600" }}>Emotions</h2>
                <Link to="/emotions/create" className="btn btn-primary">Create Emotion</Link>
            </div>
            <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: "15px" }}>
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "80px" }}>ID</th>
                            <th>Name</th>
                            <th>Emoji</th>
                            <th>Color</th>
                            <th style={{ width: "120px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.emotions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-4">No emotions yet</td>
                            </tr>
                        ) : (
                            store.emotions.map(emotion => (
                                <tr key={emotion.id}>
                                    <td style={{ fontWeight: "500" }}>{emotion.id}</td>
                                    <td>{emotion.name}</td>
                                    <td>{emotion.emoji}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: emotion.color }} />
                                            {emotion.color}
                                        </div>
                                    </td>
                                    <td>
                                        <Link to={`/emotions/${emotion.id}`} className="btn btn-outline-secondary btn-sm">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmotionsList;