import "./Header.css";
import { NavBar } from "./NavBar";
import { SearchBar } from "./SearchBar";
import { ProfileMenu } from "./ProfileMenu";

type HeaderProps = {
  onSearch?: (value: string) => void;
};

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="app-header">
      <NavBar />

      <div className="header-title">
        Welcome to TVShow Logger
      </div>

      <div className="header-right">
        <SearchBar onSearch={onSearch} />
        <ProfileMenu />
      </div>
    </header>
  );
}
