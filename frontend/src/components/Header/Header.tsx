import "./Header.css";
import { NavBar } from "./NavBar";
import { ProfileMenu } from "./ProfileMenu";


export function Header() {
  return (
    <header className="app-header">
      <NavBar />

      <div className="header-title">
        Welcome to TVShow Logger
      </div>

      <div className="header-right">
        <ProfileMenu />
      </div>
    </header>
  );
}
