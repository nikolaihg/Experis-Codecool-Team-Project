import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useDelayedSpinner } from "../../hooks/useDelayedSpinner";
import { LoadingComponent } from "../Loading/Loading";
import type { User } from "../../types";

export function UsersView() {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const showSpinner = useDelayedSpinner(loading);

    useEffect(() => {
        loadUsers();
    }, [token]);

    async function loadUsers() {
        if (!token) {
            setUsers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/User", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to load users");

            const data: User[] = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to load users", err);
            setError("Failed to load users. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    if (loading && showSpinner) return <LoadingComponent />;
    if (loading && !showSpinner) return null;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <div className="admin-view-header">
                <h2 className="admin-view-title">Manage Users</h2>
                <p className="admin-view-description">All users from the backend user endpoint.</p>
            </div>

            <div className="claims-list">
                {users.map((user) => (
                    <div key={user.id} className="claim-item">
                        <div>
                            <div><strong>Username:</strong> {user.userName}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</div>
                            <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
                            <div><strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</div>
                        </div>
                        <span className="claim-value">{user.id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
