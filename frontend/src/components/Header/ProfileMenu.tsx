import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth()

  const handleLogOut = () => {
    logout()
  }

  return (
    <div className="profile-wrapper">
      <button
        className="profile-pic"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      />

      {open && (
        <div className="profile-menu">
          <button className="logout-btn" onClick={handleLogOut}>Log out</button>
        </div>
      )}
    </div>
  );
}

