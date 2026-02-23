import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="header-left">
      <NavLink to="/" className="nav-pill">Home</NavLink>
      <NavLink to="/watchlist" className="nav-pill">Watchlist</NavLink>
      <NavLink to="/about" className="nav-pill">About</NavLink>
    </nav>
  );
}