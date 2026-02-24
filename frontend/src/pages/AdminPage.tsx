import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { UserClaimsView } from "../components/AdminComponents/UserClaimsView"
import { TvShowsView } from "../components/AdminComponents/TvShowsView"
import { UsersView } from "../components/AdminComponents/UsersView"
import { decodeToken } from "../services/utils/jwt"
import type { JwtClaims } from "../types"
import "../components/Header/Header.css"
import "./AdminPage.css"

const AdminPage = () => {
    const { token } = useAuth()
    const [activeView, setActiveView] = useState<'claims' | 'tvshows' | 'users'>('claims')

    const claims: JwtClaims | null = token ? decodeToken(token) : null

    if (!claims) {
        return <div className="admin-content">No valid token found or not logged in.</div>
    }

    const getButtonClass = (viewName: typeof activeView) =>
        `nav-pill admin-nav-button ${activeView === viewName ? 'active' : ''}`

    return (
        <div className="admin-dashboard">
            <h1 className="admin-title">Admin Dashboard</h1>
            <div className="admin-nav">
                <button
                    onClick={() => setActiveView('tvshows')}
                    className={getButtonClass('tvshows')}
                >
                    TV Shows
                </button>
                <button
                    onClick={() => setActiveView('users')}
                    className={getButtonClass('users')}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveView('claims')}
                    className={getButtonClass('claims')}
                >
                    User Claims
                </button>
            </div>
            <div className="admin-content">
                {activeView === 'tvshows' && <TvShowsView />}
                {activeView === 'users' && <UsersView />}
                {activeView === 'claims' && <UserClaimsView claims={claims} />}
            </div>
        </div>
    )
}

export default AdminPage
