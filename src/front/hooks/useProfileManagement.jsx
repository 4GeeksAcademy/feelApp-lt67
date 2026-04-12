import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
 
export const useProfileManagement = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);
 
  const activeToken = store.clientToken || store.coachToken || store.admintToken;
  const email = store.clientEmail || store.coachEmail || store.admintEmail;
  const signupDate = store.clientSignupDate || store.coachSignupDate || store.admintSignupDate;
  const avatar = store.userAvatar;
  const userId = store.clientId || store.coachId || store.admintId;
  const initial = email ? email[0].toUpperCase() : "?";
 
  const roleLabel = store.clientToken ? "Client" : store.coachToken ? "Coach" : store.admintToken ? "Admin" : "";
 
  const getUserRole = () => {
    if (store.clientToken) return "client";
    if (store.coachToken) return "coach";
    if (store.admintToken) return "admint";
    return null;
  };
 
  const getEndpoint = (role) => {
    const endpoints = {
      client: `/api/clients/${userId}`,
      coach: `/api/coachs/${userId}`,
      admint: `/api/admints/${userId}`,
    };
    return endpoints[role];
  };
 
  const handleLogout = () => {
    const role = getUserRole();
    if (role === "client") dispatch({ type: "logout_client" });
    else if (role === "coach") dispatch({ type: "logout_coach" });
    else if (role === "admint") dispatch({ type: "logout_admint" });
    navigate("/");
  };
 
  const handleDeleteAccount = async () => {
    setDeleting(true);
    const role = getUserRole();
    const endpoint = getEndpoint(role);
 
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${activeToken}` },
      });
 
      if (role === "client") dispatch({ type: "logout_client" });
      else if (role === "coach") dispatch({ type: "logout_coach" });
      else if (role === "admint") dispatch({ type: "logout_admint" });
 
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
    } finally {
      setDeleting(false);
    }
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
 
  const AvatarCircle = ({ size = 38, fontSize = "1rem", cursor = "pointer" }) => (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: avatar ? "transparent" : "linear-gradient(135deg, #b3e5fc 0%, #f8bbd0 100%)",
      fontWeight: "700",
      fontSize,
      color: "#444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      flexShrink: 0,
      cursor,
    }}>
      {avatar
        ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initial
      }
    </div>
  );
 
  return {
    uploadingAvatar,
    deleting,
    fileInputRef,
    activeToken,
    email,
    signupDate,
    avatar,
    userId,
    initial,
    roleLabel,
    handleLogout,
    handleDeleteAccount,
    handleAvatarChange,
    AvatarCircle,
    getUserRole,
  };
};