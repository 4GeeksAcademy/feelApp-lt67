import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ClientChat = () => {
  const { store } = useGlobalReducer();

  const [coachId, setCoachId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const userId = store.clientToken
    ? JSON.parse(atob(store.clientToken.split(".")[1])).sub
    : null;

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/access-coach`,
          {
            headers: {
              Authorization: `Bearer ${store.clientToken}`,
            },
          }
        );

        const data = await resp.json();

        if (Array.isArray(data)) {
          const approved = data.find(
            (c) => c.status?.toLowerCase() === "approved"
          );

          if (approved) {
            setCoachId(approved.coach_id);
          }
        }
      } catch (error) {
        console.error("Error fetching coach:", error);
      }
    };

    if (store.clientToken) fetchCoach();
  }, [store.clientToken]);

  useEffect(() => {
    if (!coachId) return;

    const fetchMessages = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/chat/${coachId}`,
          {
            headers: {
              Authorization: `Bearer ${store.clientToken}`,
            },
          }
        );

        const data = await resp.json();

        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [coachId]);

  const handleSend = async () => {
    if (!text.trim() || !coachId) return;

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.clientToken}`,
          },
          body: JSON.stringify({
            receiver_id: coachId,
            content: text,
          }),
        }
      );

      if (resp.ok) {
        const newMessage = await resp.json();
        setMessages((prev) => [...prev, newMessage]);
        setText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h4>Chat con tu coach</h4>

      {!coachId ? (
        <p>No tienes coach asignado o no ha sido aceptado</p>
      ) : (
        <>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              height: "400px",
              overflowY: "auto",
              marginBottom: "10px",
            }}
          >
            {messages.length === 0 ? (
              <p>No hay mensajes aún</p>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.sender_id === userId;

                return (
                  <div
                    key={index}
                    style={{
                      textAlign: isMine ? "right" : "left",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        background: isMine ? "#007bff" : "#e4e6eb",
                        color: isMine ? "white" : "black",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        display: "inline-block",
                        maxWidth: "70%",
                      }}
                    >
                      {msg.content}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientChat;
