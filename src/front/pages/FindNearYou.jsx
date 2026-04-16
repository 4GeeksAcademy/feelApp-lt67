import { useState, useEffect, useRef, useCallback } from "react";
import { Map, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";
import useGlobalReducer from "../hooks/useGlobalReducer";

function getInitials(email = "") {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "#E6F1FB", text: "#185FA5" },
  { bg: "#EAF3DE", text: "#3B6D11" },
  { bg: "#FAEEDA", text: "#854F0B" },
  { bg: "#FBEAF0", text: "#993556" },
  { bg: "#E1F5EE", text: "#0F6E56" },
];

function Avatar({ email, photoUrl, index }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={email}
        style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }
  return (
    <div style={{
      width: 48, height: 48, borderRadius: "50%",
      background: color.bg, color: color.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 500, fontSize: 15, flexShrink: 0,
    }}>
      {getInitials(email)}
    </div>
  );
}

function UserCard({ user, index }) {
  return (
    <div style={{
      background: "var(--color-background-primary, #fff)",
      border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
      borderRadius: 12, padding: "14px 12px",
      display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center", gap: 6,
    }}>
      <Avatar email={user.email} photoUrl={user.profile_image} index={index} />
      <p style={{ fontSize: 11, color: "#888", margin: 0, wordBreak: "break-all" }}>
        {user.email}
      </p>
      {user.bio && (
        <p style={{
          fontSize: 11, color: "#aaa", margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {user.bio}
        </p>
      )}
      {user.distance_km !== undefined && (
        <p style={{ fontSize: 11, color: "#185FA5", margin: 0, fontWeight: 500 }}>
          {user.distance_km} km away
        </p>
      )}
    </div>
  );
}

function PlacesAutocomplete({ onPlaceSelect }) {
  const placesLib = useMapsLibrary("places");
  const inputRef  = useRef(null);
  const acRef     = useRef(null);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    acRef.current = new placesLib.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "geometry", "name"],
    });

    acRef.current.addListener("place_changed", () => {
      const place = acRef.current.getPlace();
      if (!place.geometry?.location) return;
      onPlaceSelect({
        lat:      place.geometry.location.lat(),
        lng:      place.geometry.location.lng(),
        label:    place.formatted_address || place.name,
        viewport: place.geometry.viewport ?? null,
      });
    });

    return () => {
      if (window.google?.maps?.event && acRef.current) {
        window.google.maps.event.clearInstanceListeners(acRef.current);
      }
    };
  }, [placesLib, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search a city, neighborhood or address..."
      style={{
        width: "100%", padding: "9px 12px", fontSize: 14,
        borderRadius: 8, border: "0.5px solid #ccc",
        fontFamily: "inherit", boxSizing: "border-box",
      }}
    />
  );
}

export default function FindNearYou() {
  const { store, dispatch } = useGlobalReducer();

  const activeToken = store.clientToken || store.coachToken || store.admintToken;
  const userRole = store.clientToken ? "client" : store.coachToken ? "coach" : "admin";
  const defaultMode = userRole === "client" ? "coach" : "client";

  const [bioFilter,  setBioFilter]  = useState("");
  const [mapCenter,  setMapCenter]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [bioValue, setBioValue] = useState("");

  const nearbyUsers = store.nearbyUsers ?? [];

  const handlePlaceSelect = useCallback((place) => {
    setMapCenter(place);
  }, []);

  useEffect(() => {
    if (!activeToken) return;

    async function loadUserData() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${activeToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            setMapCenter({
              lat: data.latitude,
              lng: data.longitude,
              label: `${data.latitude}, ${data.longitude}`,
            });
          }
          if (data.bio) {
            setBioValue(data.bio);
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    }

    loadUserData();
  }, [activeToken]);

  useEffect(() => {
    if (!mapCenter) return;

    const controller = new AbortController();

    async function fetchNearby() {
      setLoading(true);
      setFetchError("");
      dispatch({ type: "clear_nearby_users" });

      try {
        const params = new URLSearchParams({
          role: defaultMode,
          lat:  mapCenter.lat,
          lng:  mapCenter.lng,
          ...(bioFilter.trim() ? { bio: bioFilter.trim() } : {}),
        });

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/nearby?${params}`,
          {
            headers: {
              Authorization: `Bearer ${activeToken}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error(`Server error ${res.status}`);

        const data = await res.json();
        dispatch({ type: "set_nearby_users", payload: data.users ?? [] });
      } catch (err) {
        if (err.name !== "AbortError") {
          setFetchError("Could not load users. Check your connection or try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNearby();
    return () => controller.abort();
  }, [mapCenter, defaultMode, bioFilter, activeToken, dispatch]);

  const handleSaveLocation = async () => {
    if (!mapCenter || !activeToken) return;

    setSavingLocation(true);
    setSaveMessage(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile/location`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: mapCenter.lat,
            longitude: mapCenter.lng,
            bio: bioValue,
          }),
        }
      );

      setSavingLocation(false);

      if (res.ok) {
        setSaveMessage({
          type: "success",
          text: "Location and bio saved successfully!",
        });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        const data = await res.json();
        setSaveMessage({
          type: "error",
          text: data.msg || data.error || "Failed to save location.",
        });
      }
    } catch (err) {
      setSavingLocation(false);
      setSaveMessage({
        type: "error",
        text: "Error saving location. Try again.",
      });
    }
  };

  function handleBioSearch() {
    if (!mapCenter) return;
    setMapCenter((prev) => ({ ...prev }));
  }

  useEffect(() => {
    return () => dispatch({ type: "clear_nearby_users" });
  }, [dispatch]);

  return (
    <div className="container" style={{maxWidth: 680, paddingTop: "80px", paddingBottom: "60px"}}>
      <h2 className="mt-5 mb-0" style={{ fontWeight: 500, marginBottom: 4 }}>
        {defaultMode === "coach" ? "Find coaches near you" : "Find clients near you"}
      </h2>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: "1.25rem" }}>
        Search a location to discover {defaultMode === "coach" ? "professionals" : "clients"} in that area.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>
          Location
        </label>
        <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
      </div>

      <div style={{ marginBottom: "1.25rem", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>
            Bio (optional)
          </label>
          <textarea
            rows={2}
            placeholder={
              userRole === "coach"
                ? "e.g. I specialize in anxiety and mindfulness coaching..."
                : "e.g. I'm dealing with work stress and looking for guidance..."
            }
            value={bioValue}
            onChange={(e) => setBioValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleBioSearch();
              }
            }}
            style={{
              width: "100%", padding: "8px 10px", fontSize: 13,
              borderRadius: 8, border: "0.5px solid #ccc",
              resize: "none", fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={handleSaveLocation}
          disabled={!mapCenter || savingLocation}
          style={{
            padding: "8px 16px", fontSize: 13, fontWeight: 500,
            borderRadius: 8, border: "none",
            background: mapCenter && !savingLocation ? "#E6F1FB" : "#f0f0f0",
            color: mapCenter && !savingLocation ? "#185FA5" : "#bbb",
            cursor: mapCenter && !savingLocation ? "pointer" : "not-allowed",
            whiteSpace: "nowrap", marginBottom: 2,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (mapCenter && !savingLocation) {
              e.currentTarget.style.background = "#d4ebf7";
            }
          }}
          onMouseLeave={(e) => {
            if (mapCenter && !savingLocation) {
              e.currentTarget.style.background = "#E6F1FB";
            }
          }}
        >
          {savingLocation ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            "Save Location"
          )}
        </button>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            marginBottom: "1.25rem",
            fontSize: "13px",
            fontWeight: 500,
            background: saveMessage.type === "success" ? "#d1fae5" : "#fee2e2",
            color: saveMessage.type === "success" ? "#065f46" : "#991b1b",
            textAlign: "center",
          }}
        >
          {saveMessage.text}
        </div>
      )}

      <div style={{
        width: "100%", height: 260, borderRadius: 12,
        border: "0.5px solid #e0e0e0", marginBottom: "1.25rem",
        overflow: "hidden", background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#bbb", fontSize: 13,
      }}>
        {mapCenter ? (
          <Map
            style={{ width: "100%", height: "100%" }}
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            zoom={13}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
          >
            <Marker position={{ lat: mapCenter.lat, lng: mapCenter.lng }} />
          </Map>
        ) : (
          "Search a location above to load the map"
        )}
      </div>

      {mapCenter && (
        <>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#888", marginBottom: 10 }}>
            {loading
              ? "Loading..."
              : fetchError
              ? ""
              : `${nearbyUsers.length} ${defaultMode}${nearbyUsers.length !== 1 ? "s" : ""} found near ${mapCenter.label}`}
          </p>

          {fetchError && (
            <p style={{ fontSize: 13, color: "#e24b4a", marginBottom: 12 }}>{fetchError}</p>
          )}

          {!loading && !fetchError && nearbyUsers.length === 0 && (
            <p style={{ fontSize: 13, color: "#bbb" }}>
              No {defaultMode}s found{bioFilter.trim() ? ` matching "${bioFilter.trim()}"` : " in this area"}.
            </p>
          )}

          {!loading && nearbyUsers.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10, marginBottom: "40px"
            }}>
              {nearbyUsers.map((user, i) => (
                <UserCard key={`${defaultMode}-${user.id}`} user={user} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}