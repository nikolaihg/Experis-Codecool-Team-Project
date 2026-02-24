import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function ProfileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) setOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const avatarSrc =
    isAuthenticated && user
      ? `https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(
          user.id ?? user.email ?? "guest"
        )}`
      : null;

  return (
    <div className="profile-wrapper" ref={ref}>
      <button
        className={`profile-pic ${isAuthenticated ? "is-auth" : "is-guest"}`}
        type="button"
        onClick={() => isAuthenticated && setOpen((p) => !p)}
        aria-haspopup={isAuthenticated ? "menu" : undefined}
        aria-expanded={isAuthenticated ? open : undefined}
        aria-label={isAuthenticated ? "Open profile menu" : "Not logged in"}
      >
        {avatarSrc && (
          <img
            src={avatarSrc}
            alt="Profile avatar"
            className="profile-avatar-img"
            referrerPolicy="no-referrer"
          />
        )}
      </button>

      {isAuthenticated && open && (
        <div className="profile-menu" role="menu">
          <button
            type="button"
            className="profile-menu-item"
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
          >
            Profile
          </button>

          <button
            type="button"
            className="logout-btn"
            role="menuitem"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}