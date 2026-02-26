import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LoadingComponent } from "../components/Loading/Loading";
import { useDelayedSpinner } from "../hooks/useDelayedSpinner";

type UserProfile = {
  id: string;
  email: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showSpinner = useDelayedSpinner(loading);

  useEffect(() => {
    if (!token || !user?.id) return;

    let isActive = true;

    async function fetchProfile() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/User/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Could not fetch profile");

        const data: UserProfile = await res.json();
        if (isActive) setProfile(data);
      } catch {
        if (isActive) setError("Something went wrong when loading the profile.");
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      isActive = false;
    };
  }, [token, user?.id]);

  const avatarSrc = useMemo(() => {
    if (!profile?.id) return null;
    return `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(
      profile.id
    )}`;
  }, [profile?.id]);

  if (!isAuthenticated) {
    return (
      <div className="page-container" style={{ padding: 24, maxWidth: 720, textAlign: "center" }}>
        <h2>You are not logged in</h2>
        <button onClick={() => navigate("/")}>Back to home</button>
      </div>
    );
  }

  if (loading && showSpinner) return <LoadingComponent />;
  if (error) return <p className="page-container" style={{ color: "crimson", maxWidth: 720, textAlign: "center" }}>{error}</p>;
  if (loading && !showSpinner) return null;

  if (!profile) return <p className="page-container" style={{ maxWidth: 720, textAlign: "center" }}>No profile found.</p>;

  return (
    <div className="page-container" style={{ padding: 24, maxWidth: 720, textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

      <div className="profile-card">
        <p><strong>Username:</strong> {profile.userName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}</p>
        <p><strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
        <p><strong>Updated:</strong> {new Date(profile.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
