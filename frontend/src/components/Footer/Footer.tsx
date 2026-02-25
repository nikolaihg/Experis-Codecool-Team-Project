import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-section left">
        <div className="version-group">
          <span className="version-item" title="App Version">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="footer-icon"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {__APP_VERSION__}
          </span>
          <span className="separator">|</span>
          <span className="version-item" title="Git Commit Hash">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="footer-icon"
            >
              <circle cx="12" cy="12" r="4" />
              <line x1="1.05" y1="12" x2="7" y2="12" />
              <line x1="17.01" y1="12" x2="22.96" y2="12" /> 
            </svg>
            <a href={`https://github.com/nikolaihg/Experis-Codecool-Team-Project/commit/${__GIT_HASH__}`}>{__GIT_HASH__}</a>
          </span>
        </div>
      </div>
      <div className="footer-section center">
        <strong>TVShow Logger</strong>
      </div>
      <div className="footer-section right">
        <span>&copy; {year}</span>
      </div>
    </footer>
  );
}
