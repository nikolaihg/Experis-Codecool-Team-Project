import type { JwtClaims } from "../../types"
import "../../pages/AdminPage.css" // Ensure admin-view styling is applied

interface UserClaimsViewProps {
    claims: JwtClaims
}

export function UserClaimsView({ claims }: UserClaimsViewProps) {
    return (
        <div className="admin-content">
            <header className="admin-view-header">
                <h2 className="admin-view-title">User Claims</h2>
                <p className="admin-view-description">
                    Authentication details and roles associated with your current session.
                </p>
            </header>
            
            <div className="claims-list">
                {Object.entries(claims).map(([key, value]) => (
                    <div key={key} className="claim-item">
                        <span className="claim-key">{key}</span>
                        <span className="claim-value">{String(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
