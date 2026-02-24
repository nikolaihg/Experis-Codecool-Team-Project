import { useAuth } from "../auth/AuthContext"
import { ClaimsCard } from "../components/AdminComponents/ClaimsCard"
import { decodeToken } from "../services/utils/jwt"
import type { JwtClaims } from "../types"

const AdminPage = () => {
    const { token } = useAuth()
    const claims: JwtClaims | null = token ? decodeToken(token) : null

    if (!claims) {
        return <div style={{ color: "var(--color-text-main)", padding: "2rem" }}>No valid token found or not logged in.</div>
    }

    return (
        <ClaimsCard claims={claims} />
    )
}

export default AdminPage
