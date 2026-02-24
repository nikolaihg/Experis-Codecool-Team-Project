import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "../services/utils/jwt";
import NotFoundPage from "../pages/NotFoundPage";

export function RequireAdmin() {
    const { token, isAuthenticated } = useAuth();
    
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    const decodedToken = token ? decodeToken(token) : null;
    const role = decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
    
    const isAdmin = Array.isArray(role) 
        ? role.includes("Admin") 
        : role === "Admin";

    if (!isAdmin) {
        return <NotFoundPage />;
    }

    return <Outlet />;
}
