import { useState } from "react";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);

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
          <button className="logout-btn">Log out</button>
        </div>
      )}
    </div>
  );
}

