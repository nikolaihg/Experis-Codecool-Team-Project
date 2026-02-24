import type { JwtClaims } from "../../types";

export function ClaimsCard({ claims }: { claims: JwtClaims }) {
    return (
        <div style={{ color: "var(--color-text-main)", padding: "2rem" }}>
            <h1 style={{ color: "var(--color-primary)" }}>User Claims</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {Object.entries(claims).map(([key, value]) => (
                    <li key={key} style={{ marginBottom: "0.5rem", background: "var(--color-surface)", padding: "0.5rem", borderRadius: "4px" }}>
                        <strong style={{ color: "var(--color-secondary)", wordBreak: "break-all" }}>{key}:</strong>
                        <span style={{ wordBreak: "break-all", marginLeft: "0.5rem" }}>{String(value)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}




