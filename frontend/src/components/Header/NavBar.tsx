import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { decodeToken } from "../../services/utils/jwt";

export function NavBar() {
  const { token } = useAuth();
  const decodedToken = token ? decodeToken(token) : null;
  const role = decodedToken?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  // jwt role claim is array if user is admin ["User", "Admin"] or "user" if only regular user.
  const isAdmin = Array.isArray(role) 
    ? role.includes("Admin") 
    : role === "Admin";
    
  const displayRole = isAdmin ? "Admin" : (Array.isArray(role) ? role[0] : role);

  return (
    <nav className="header-left">
      <NavLink to="/" className="nav-pill">Home</NavLink>
      <NavLink to="/watchlist" className="nav-pill">Watchlist</NavLink>
      <NavLink to="/about" className="nav-pill">About</NavLink>

      {displayRole && (
        isAdmin ? (
          <NavLink
            to="/admin"
            className="role-badge role-admin"
          >
            {displayRole}
          </NavLink>
        ) : (
          <span className="role-badge role-user">
            {displayRole}
          </span>
        )
      )}
    </nav>
  );
}