import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const activeToken = store.clientToken || store.coachToken || store.admintToken;
  const email = store.clientEmail || store.coachEmail || store.admintEmail;
  const signupDate = store.clientSignupDate || store.coachSignupDate || store.admintSignupDate;
  const initial = email ? email[0].toUpperCase() : "?";
  const avatar = store.userAvatar;

  const roleLabel = store.clientToken ? "Client" : store.coachToken ? "Coach" : store.admintToken ? "Admin" : "";

  const getHomePath = () => {
    if (store.clientToken) return "/client-private";
    if (store.coachToken) return "/coach-private";
    if (store.admintToken) return "/admint-private";
    return "/";
  };

  const handleLogout = () => {
    if (store.clientToken) dispatch({ type: "logout_client" });
    else if (store.coachToken) dispatch({ type: "logout_coach" });
    else if (store.admintToken) dispatch({ type: "logout_admint" });
    setShowProfile(false);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const id = store.clientId || store.coachId || store.admintId;
    let endpoint = "";
    if (store.clientToken) endpoint = `/api/clients/${id}`;
    else if (store.coachToken) endpoint = `/api/coachs/${id}`;
    else if (store.admintToken) endpoint = `/api/admints/${id}`;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${activeToken}` },
    });

    if (store.clientToken) dispatch({ type: "logout_client" });
    else if (store.coachToken) dispatch({ type: "logout_coach" });
    else if (store.admintToken) dispatch({ type: "logout_admint" });

    setDeleting(false);
    setShowDeleteModal(false);
    setShowProfile(false);
    navigate("/");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const cloudRes = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const cloudData = await cloudRes.json();
      const avatarUrl = cloudData.secure_url;
      if (!avatarUrl) throw new Error("Cloudinary upload failed");

      const backendRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile-image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeToken}` },
        body: JSON.stringify({ profile_image: avatarUrl }),
      });
      if (!backendRes.ok) throw new Error("Backend update failed");

      dispatch({ type: "set_user_avatar", payload: avatarUrl });
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const AvatarCircle = ({ size = 38, fontSize = "1rem" }) => (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatar ? "transparent" : "linear-gradient(135deg, #b3e5fc 0%, #f8bbd0 100%)",
      fontWeight: "700", fontSize, color: "#444",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden", flexShrink: 0,
    }}>
      {avatar
        ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initial
      }
    </div>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
        <div className="container-fluid container">
          <Link className="navbar-brand logo-feelapp" to="/">
            <img src="public/favicon.png" alt="Logo" width="35" height="35" className="d-inline-block align-top me-2" />
            FeelApp
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto text-center">
              <li className="nav-item"><Link className="nav-link fw-bold" to={getHomePath()}>Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/crudlist">CRUDs</Link></li>
            </ul>
            <div className="d-flex flex-column flex-lg-row align-items-center gap-2 ms-auto">
              {!activeToken ? (
                <div className="dropdown">
                  <button className="btn btn-login dropdown-toggle" type="button" data-bs-toggle="dropdown">Login</button>
                  <ul className="dropdown-menu dropdown-menu-end shadow text-center">
                    <li><Link className="dropdown-item" to="/client-login">Client</Link></li>
                    <li><Link className="dropdown-item" to="/coach-login">Coach</Link></li>
                    <li><Link className="dropdown-item" to="/admint-login">Admin</Link></li>
                  </ul>
                </div>
              ) : (
                <button onClick={() => setShowProfile(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                  <AvatarCircle size={38} fontSize="1rem" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showProfile && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 1055 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowProfile(false); }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "360px" }}>
            <div className="modal-content border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>

              <div style={{ background: "linear-gradient(135deg, #b3e5fc 0%, #f8bbd0 100%)", padding: "30px 24px 20px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: "12px" }}>
                  <AvatarCircle size={64} fontSize="1.6rem" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    style={{
                      position: "absolute", inset: 0, borderRadius: "50%", border: "none",
                      background: "rgba(0,0,0,0.35)", color: "white", fontSize: "1.1rem",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    {uploadingAvatar
                      ? <span className="spinner-border spinner-border-sm text-white" />
                      : <i className="bi bi-camera-fill" />
                    }
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                </div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "1rem", color: "#333" }}>{email}</p>
                <span style={{ backgroundColor: "rgba(255,255,255,0.6)", color: "#555", padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" }}>
                  {roleLabel}
                </span>
              </div>

              <div style={{ padding: "20px 24px" }}>
                {signupDate && (
                  <p className="text-muted mb-0 text-center" style={{ fontSize: "0.85rem" }}>
                    <i className="bi bi-calendar3 me-2"></i>
                    Member since {new Date(signupDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <hr className="my-0" style={{ borderColor: "#f3f4f6" }} />

              <div style={{ padding: "12px 24px 20px" }}>
                <button className="w-100 text-start d-flex align-items-center gap-2"
                  style={{ background: "none", border: "none", padding: "10px 12px", borderRadius: "10px", color: "#ef4444", fontWeight: "500", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                  onClick={() => { setShowProfile(false); setShowDeleteModal(true); }}>
                  <i className="bi bi-trash"></i> Delete account
                </button>
                <button className="w-100 text-start d-flex align-items-center gap-2"
                  style={{ background: "none", border: "none", padding: "10px 12px", borderRadius: "10px", color: "#6b7280", fontWeight: "500", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                  onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "360px" }}>
            <div className="modal-content border-0" style={{ borderRadius: "20px", padding: "10px" }}>
              <div className="modal-body text-center py-4">
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
                <h5 className="fw-bold mb-2">Delete account?</h5>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  This will permanently delete your account and all your data. This action cannot be undone.
                </p>
              </div>
              <div className="d-flex gap-2 px-3 pb-3">
                <button className="btn w-50 rounded-pill" style={{ backgroundColor: "#f3f4f6", border: "none", fontWeight: "500" }}
                  onClick={() => { setShowDeleteModal(false); setShowProfile(true); }} disabled={deleting}>
                  Cancel
                </button>
                <button className="btn btn-danger w-50 rounded-pill" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
