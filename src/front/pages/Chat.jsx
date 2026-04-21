import { useEffect, useState, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [showContacts, setShowContacts] = useState(true);

  const activeToken = store.coachToken || store.clientToken;
  const isCoach = !!store.coachToken;
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const scrollRef = useRef();

  useEffect(() => {
    if (!activeToken) {
      navigate("/");
    }
    return () => {
      dispatch({ type: "clear_chat" });
      dispatch({ type: "set_access_coach", payload: [] });
      setReceiverId(null);
    };
  }, [activeToken, navigate, dispatch]);

  const fetchContacts = async () => {
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_URL}/api/access-coach`, {
        headers: {
          "Authorization": `Bearer ${activeToken}`,
          "Cache-Control": "no-cache"
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const approved = data.filter(item => item.status === "approved");
        dispatch({ type: "set_access_coach", payload: approved });
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const fetchMessages = async () => {
    if (!receiverId || !activeToken) return;

    try {
      const res = await fetch(`${API_URL}/api/chat/${receiverId}`, {
        headers: {
          "Authorization": `Bearer ${activeToken}`,
          "Cache-Control": "no-cache"
        },
      });

      if (res.status === 401) return;

      const data = await res.json();
      const payload = JSON.parse(atob(activeToken.split(".")[1]));
      const currentUserId = payload.sub;

      const formatted = data.map((msg) => ({
        ...msg,
        isMine: String(msg.sender_id) === String(currentUserId),
      }));

      dispatch({ type: "set_messages", payload: formatted });
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (receiverId) fetchMessages();
    const interval = setInterval(() => {
      if (receiverId && activeToken) fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [receiverId, activeToken]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !receiverId || !activeToken) return;

    try {
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          content: input,
        }),
      });

      if (res.ok) {
        setInput("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => { fetchContacts(); }, [activeToken]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [store.messages]);

  const getOtherPartyEmail = () => {
    if (!store.access_coach) return "";
    const contact = store.access_coach.find(c => (isCoach ? c.client_id : c.coach_id) === receiverId);
    return isCoach ? contact?.client_email : contact?.coach_email;
  };

  return (
    <div className="container" style={{ paddingTop: "100px", height: "90vh" }}>
      <style>{`
        .glass-chat-container {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 24px;
            height: 100%;
            display: flex;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.05);
        }
        .contact-sidebar {
            width: ${showContacts ? '300px' : '0px'};
            transition: all 0.3s ease;
            border-right: 1px solid rgba(255,255,255,0.2);
            background: rgba(255, 255, 255, 0.2);
            overflow: hidden;
        }
        .message-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.1);
        }
        .contact-item {
            padding: 15px 20px;
            cursor: pointer;
            transition: 0.2s;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .contact-item:hover { background: rgba(255,255,255,0.3); }
        .contact-item.active { background: white; font-weight: 600; }
        
        .bubble {
            padding: 10px 16px;
            border-radius: 18px;
            max-width: 75%;
            font-size: 0.95rem;
            display: block;
            word-wrap: break-word;
            backdrop-filter: blur(5px);
        }
        .bubble-mine { 
            background: rgba(255, 255, 255, 0.7); 
            color: #333; 
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-bottom-right-radius: 4px; 
        }
        .bubble-other { 
            background: rgba(255, 255, 255, 0.3); 
            color: #333; 
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-bottom-left-radius: 4px; 
        }
        .msg-label {
            font-size: 0.7rem;
            margin-bottom: 2px;
            display: block;
        }
      `}</style>

      <div className="glass-chat-container">
        <div className="contact-sidebar">
          <div className="p-4 border-bottom border-white border-opacity-25">
            <h6 className="fw-bold mb-0">{isCoach ? "Clients" : "Coaches"}</h6>
          </div>
          <div className="overflow-auto" style={{ height: "calc(100% - 60px)" }}>
            {store.access_coach && store.access_coach.map((c) => (
              <div
                key={c.id}
                onClick={() => setReceiverId(isCoach ? c.client_id : c.coach_id)}
                className={`contact-item ${receiverId === (isCoach ? c.client_id : c.coach_id) ? 'active' : ''}`}
              >
                <div className="small text-muted mb-1">{isCoach ? "Client" : "Coach"}</div>
                <div className="text-truncate" style={{ fontSize: "0.9rem" }}>{isCoach ? c.client_email : c.coach_email}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="message-area">
          <div className="p-3 border-bottom border-white border-opacity-25 d-flex align-items-center gap-3">
            <button className="btn btn-sm btn-light rounded-pill" onClick={() => setShowContacts(!showContacts)}>
              <i className={`bi bi-chevron-${showContacts ? 'left' : 'right'}`}></i>
            </button>
            <span className="fw-bold" style={{ color: "#333" }}>
              {receiverId ? "Conversation" : "Select a contact"}
            </span>
          </div>

          <div ref={scrollRef} className="flex-grow-1 p-4 overflow-auto d-flex flex-column">
            {!receiverId && (
              <div className="text-center my-auto text-muted opacity-50">
                <i className="bi bi-chat-heart display-4 d-block mb-3"></i>
                <p>Private Chat</p>
              </div>
            )}
            {store.messages && store.messages.map((msg) => (
              <div key={msg.id} className={`d-flex flex-column mb-3 ${msg.isMine ? 'align-items-end text-end' : 'align-items-start text-start'}`}>
                <span className="msg-label text-muted px-2">
                  {msg.isMine ? "You" : getOtherPartyEmail()}
                </span>
                <div className={`bubble ${msg.isMine ? 'bubble-mine shadow-sm' : 'bubble-other shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4">
            <form onSubmit={sendMessage} className="d-flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="form-control rounded-pill border-0 shadow-sm px-4 py-2"
                placeholder="Type a message..."
                disabled={!receiverId}
                style={{ background: "rgba(255,255,255,0.7)" }}
              />
              <button type="submit" className="btn btn-custom rounded-circle d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }} disabled={!receiverId || !input.trim()}>
                <i className="bi bi-send"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;