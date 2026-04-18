import React, { useEffect, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [clients, setClients] = useState([]);

  const token =
    sessionStorage.getItem("clientToken") ||
    sessionStorage.getItem("coachToken");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
    } else {
      console.log("TOKEN:", token);
    }
  }, []);

 
  const fetchClients = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(" Error fetching clients:", text);
        return;
      }

      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(" Error fetching clients:", err);
    }
  };

  const fetchMessages = async () => {
    if (!receiverId || !token) return;

    console.log(" Cargando mensajes con:", receiverId);

    try {
      const res = await fetch(`${API_URL}/api/chat/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(" Error messages:", text);
        return;
      }

      const data = await res.json();

      const userId = JSON.parse(atob(token.split(".")[1])).sub;

      const formatted = data.map((msg) => ({
        ...msg,
        isMine: msg.sender_id === userId,
      }));

      setMessages(formatted);
    } catch (err) {
      console.error(" Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !receiverId || !token) return;

    try {
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          content: input,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(" Error sending message:", text);
        return;
      }

      setInput("");
      fetchMessages();
    } catch (err) {
      console.error(" Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [receiverId]);

  
  return (
    <div className="container" style={{ paddingTop: "80px" }}>
      <div className="row">
        
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Clientes</h5>

            {clients.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  console.log(" Cliente seleccionado:", c.id);
                  setReceiverId(c.id);
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  background:
                    receiverId === c.id ? "#f0f0f0" : "transparent",
                }}
              >
                {c.email}
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          <div
            className="card p-3"
            style={{ height: "500px", display: "flex" }}
          >
            <h5>Chat</h5>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {!receiverId && (
                <p style={{ color: "#999" }}>
                  Selecciona un cliente para comenzar
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    textAlign: msg.isMine ? "right" : "left",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      background: msg.isMine ? "#DCF8C6" : "#eee",
                      padding: "8px",
                      borderRadius: "10px",
                      display: "inline-block",
                      maxWidth: "70%",
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="form-control"
                placeholder="Escribe..."
              />

              <button onClick={sendMessage} className="btn btn-primary">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;