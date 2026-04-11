import { useState } from "react";
import { useProfileManagement } from "../hooks/useProfileManagement";

export const Profile = () => {
  const {
    uploadingAvatar,
    deleting,
    fileInputRef,
    email,
    signupDate,
    roleLabel,
    handleLogout,
    handleDeleteAccount,
    handleAvatarChange,
    AvatarCircle,
  } = useProfileManagement();

  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openProfileModal = () => setShowProfile(true);
  const closeProfileModal = () => setShowProfile(false);

  return (
    <>
      <button
        onClick={openProfileModal}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        title="Profile settings"
      >
        <AvatarCircle size={40} fontSize="1rem" />
      </button>

      {showProfile && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1055,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProfileModal();
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "360px" }}>
            <div
              className="modal-content border-0"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #b3e5fc 0%, #f8bbd0 100%)",
                  padding: "30px 24px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ position: "relative", display: "inline-block", marginBottom: "12px" }}>
                  <AvatarCircle size={64} fontSize="1.6rem" cursor="default" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    {uploadingAvatar ? (
                      <span className="spinner-border spinner-border-sm text-white" />
                    ) : (
                      <i className="bi bi-camera-fill" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "1rem", color: "#333" }}>
                  {email}
                </p>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.6)",
                    color: "#555",
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
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
                <button
                  className="w-100 text-start d-flex align-items-center gap-2"
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    color: "#ef4444",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  onClick={() => {
                    closeProfileModal();
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="bi bi-trash"></i> Delete account
                </button>
                <button
                  className="w-100 text-start d-flex align-items-center gap-2"
                  style={{
                    background: "none",
                    border: "none",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    color: "#6b7280",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1055,
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "360px" }}>
            <div
              className="modal-content border-0"
              style={{ borderRadius: "20px", padding: "10px" }}
            >
              <div className="modal-body text-center py-4">
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>
                <h5 className="fw-bold mb-2">Delete account?</h5>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  This will permanently delete your account and all your data. This action cannot be
                  undone.
                </p>
              </div>
              <div className="d-flex gap-2 px-3 pb-3">
                <button
                  className="btn w-50 rounded-pill"
                  style={{ backgroundColor: "#f3f4f6", border: "none", fontWeight: "500" }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setShowProfile(true);
                  }}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger w-50 rounded-pill"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
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
