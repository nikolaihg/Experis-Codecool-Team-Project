import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type UserProfile = {
  id: string;
  email: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export default function Profile() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.id) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setError(null);
        const res = await fetch(`/api/User/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Could not fetch profile");

        const data: UserProfile = await res.json();
        setProfile(data);
      } catch {
        setError("Something went wrong when loading the profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token, user?.id]);

  const avatarSrc = useMemo(() => {
    if (!profile?.id) return null;
    return `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(
      profile.id
    )}`;
  }, [profile?.id]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h2>You are not logged in</h2>
        <button onClick={() => navigate("/")}>Back to home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
        }}
      >
        {avatarSrc && (
          <div className="profile-avatar-box">
            <img src={avatarSrc} alt="Profile avatar" className="profile-avatar" />
            </div>
          )}

        <h1 style={{ margin: 0 }}>Profile</h1>
      </div>

      {loading && <p>Loading profile…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

    {profile && (
      <div className="profile-card">
          <p>
            <strong>Username:</strong> {profile.userName}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(profile.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {new Date(profile.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
