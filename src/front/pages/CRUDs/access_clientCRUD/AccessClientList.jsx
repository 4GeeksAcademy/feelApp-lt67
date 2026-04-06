import { useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const AccessClientList = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/access-clients`)
      .then(res => res.json())
      .then(data =>
        dispatch({ type: "set_access_clients", payload: data })
      );
  }, []);
  

  return (
    <div className="container mt-5">
      <h2 className="mt-5">Access Requests</h2>

      {store.access_clients.map(item => (
        <div key={item.id} className="card p-2 mb-2">
          <p>Requester: {item.client_id}</p>
          <p>Target: {item.shared_with_id}</p>
          <p>Status: {item.status}</p>

 
        </div>
      ))}
    </div>
  );
};

export default AccessClientList;