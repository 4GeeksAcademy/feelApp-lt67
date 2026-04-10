import { useState, useEffect, useRef } from "react";
import { Map, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";

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
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: color.bg,
        color: color.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 500,
        fontSize: 15,
        flexShrink: 0,
      }}
    >
      {getInitials(email)}
    </div>
  );
}

function UserCard({ user, index }) {
  return (
    <div
      style={{
        background: "var(--color-background-primary, #fff)",
        border: "0.5px solid var(--color-border-tertiary, #e0e0e0)",
        borderRadius: 12,
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 6,
      }}
    >
      <Avatar email={user.email} photoUrl={user.profile_image} index={index} />
      <p style={{ fontSize: 11, color: "#888", margin: 0, wordBreak: "break-all" }}>
        {user.email}
      </p>
      {user.bio && (
        <p
          style={{
            fontSize: 11,
            color: "#aaa",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
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
        width: "100%",
        padding: "9px 12px",
        fontSize: 14,
        borderRadius: 8,
        border: "0.5px solid #ccc",
        fontFamily: "inherit",
        boxSizing: "border-box",
      }}
    />
  );
}

export default function FindNearYou() {
  const [mode,       setMode]       = useState("coach");
  const [bioFilter,  setBioFilter]  = useState("");
  const [mapCenter,  setMapCenter]  = useState(null);
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [fetchError, setFetchError] = useState("");

  const handlePlaceSelect = useRef((place) => setMapCenter(place)).current;

  useEffect(() => {
    if (!mapCenter) return;

    const controller = new AbortController();

    async function fetchUsers() {
      setLoading(true);
      setFetchError("");
      setUsers([]);

      try {
        const params = new URLSearchParams({
          role: mode,
          lat:  mapCenter.lat,
          lng:  mapCenter.lng,
          ...(bioFilter.trim() ? { bio: bioFilter.trim() } : {}),
        });

        const res = await fetch(`/api/users/nearby?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Server error ${res.status}`);

        const data = await res.json();
        setUsers(data.users ?? []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setFetchError("Could not load users. Check your connection or try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();
  }, [mapCenter, mode]);

  function handleBioSearch() {
    if (!mapCenter) return;
    setMapCenter((prev) => ({ ...prev }));
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: 860, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
        {mode === "coach" ? "Find coaches near you" : "Find clients near you"}
      </h1>
      <p style={{ fontSize: 14, color: "#888", marginBottom: "1.25rem" }}>
        Search a location to discover{" "}
        {mode === "coach" ? "professionals" : "clients"} in that area.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
        {["coach", "client"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "6px 18px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: 8,
              cursor: "pointer",
              border: mode === m ? "none" : "0.5px solid #ccc",
              background: mode === m ? "#E6F1FB" : "transparent",
              color: mode === m ? "#185FA5" : "#888",
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}s
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>
          Location
        </label>
        <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
      </div>

      <div style={{ marginBottom: "1.25rem", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>
            Looking for (optional)
          </label>
          <textarea
            rows={2}
            placeholder={
              mode === "coach"
                ? "e.g. coach specializing in anxiety and mindfulness..."
                : "e.g. client dealing with work stress..."
            }
            value={bioFilter}
            onChange={(e) => setBioFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleBioSearch();
              }
            }}
            style={{
              width: "100%",
              padding: "8px 10px",
              fontSize: 13,
              borderRadius: 8,
              border: "0.5px solid #ccc",
              resize: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={handleBioSearch}
          disabled={!mapCenter}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 8,
            border: "none",
            background: mapCenter ? "#E6F1FB" : "#f0f0f0",
            color: mapCenter ? "#185FA5" : "#bbb",
            cursor: mapCenter ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
            marginBottom: 2,
          }}
        >
          Search
        </button>
      </div>

      {/* Map */}
      <div
        style={{
          width: "100%",
          height: 260,
          borderRadius: 12,
          border: "0.5px solid #e0e0e0",
          marginBottom: "1.25rem",
          overflow: "hidden",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          fontSize: 13,
        }}
      >
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
              : `${users.length} ${mode}${users.length !== 1 ? "s" : ""} found near ${mapCenter.label}`}
          </p>

          {fetchError && (
            <p style={{ fontSize: 13, color: "#e24b4a", marginBottom: 12 }}>{fetchError}</p>
          )}

          {!loading && !fetchError && users.length === 0 && (
            <p style={{ fontSize: 13, color: "#bbb" }}>
              No {mode}s found
              {bioFilter.trim() ? ` matching "${bioFilter.trim()}"` : " in this area"}.
            </p>
          )}

          {!loading && users.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 10,
              }}
            >
              {users.map((user, i) => (
                <UserCard key={user.id} user={user} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
