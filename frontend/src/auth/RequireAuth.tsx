import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";


export function RequireAuth(){
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated)
        return <Navigate to="/login" />

    return <Outlet />
}