import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AccessCoachList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach`)
            .then(res => res.json())
            .then(data => setData(data));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete?")) return;

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-coach/${id}`, {
            method: "DELETE"
        });

        setData(data.filter(item => item.id !== id));
    };

    return (
        <div className="container">
            <h2>Access Coach List</h2>

            <Link to="/access-coach/create" className="btn btn-primary mb-3">
                Create
            </Link>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Coach</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.client_id}</td>
                            <td>{item.coach_id}</td>
                            <td>{item.status}</td>
                            <td>
                                <Link to={`/access-coach/${item.id}`} className="btn btn-info me-2">View</Link>
                                <Link to={`/access-coach/update/${item.id}`} className="btn btn-warning me-2">Edit</Link>
                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};