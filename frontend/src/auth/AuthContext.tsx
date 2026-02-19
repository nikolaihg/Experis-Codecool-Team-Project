import { useContext, type ReactNode } from "react";
import { createContext, useState } from "react";
import type { JwtPayload } from "../types";


export interface AuthContextType {
    isAuthenticated: boolean,
    token: string | null,
    user: {id: string, email: string} | null,
    login: (username: string, email: string, password: string) => Promise<void>,
    logout: () => void
    register: (username: string, email: string, password: string) => Promise<void>,
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function decodeTokenUser(token: string | null): { id: string; email: string } | null {
    if (!token) return null;

    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const json = atob(padded);
        const payload = JSON.parse(json) as JwtPayload;

        const id =
            (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string | undefined) ??
            payload.nameid ??
            payload.sub;
        const email = payload.email ?? "";

        if (!id) return null;
        return { id, email };
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState(() => { return localStorage.getItem("auth_token") })
    const [user, setUser] = useState<{id: string, email: string} | null>(() => decodeTokenUser(localStorage.getItem("auth_token")))
  
    const isAuthenticated = !!token;

    const value = {
        isAuthenticated,
        token,
        user,
        login,
        logout,
        register
    }

    async function login(username: string, email: string, password: string) {
        try {
            const response = await fetch("/api/Auth/login", 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, email, password}),
                })
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const json = await response.json()
            const tokenFromServer = json.token

            localStorage.setItem("auth_token", tokenFromServer)
            localStorage.setItem("auth_user", JSON.stringify(json.user))
            setToken(tokenFromServer)
            setUser(decodeTokenUser(localStorage.getItem("auth_token")))
            console.log(tokenFromServer)

        } catch(err) {
            if (err instanceof Error)
                console.log(err.message)
        }
    }

    function logout(){
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        setToken(null)
        setUser(null)
    }

    async function register(username: string, email: string, password: string) {
        try {
            const response = await fetch("/api/Auth/register", 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, email, password}),
                })
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const json = await response.json()
            const tokenFromServer = json.token

            localStorage.setItem("auth_token", tokenFromServer)
            localStorage.setItem("auth_user", JSON.stringify(json.user))
            setToken(tokenFromServer)
            setUser(decodeTokenUser(localStorage.getItem("auth_token")))
            try {
                await createDiary(tokenFromServer)
            } catch(err){
                console.log(err)
            }
            console.log(tokenFromServer)
 
        } catch(err) {
            if (err instanceof Error)
                console.log(err.message)
        }
    }


    async function createDiary(token: string) {
        
        const diary = {
            name: "Diary",
            type: 0,
            isPublic: true
        };

        try {
            const response = await fetch(`/api/lists`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(diary),
                })
            if (!response.ok) {
                throw new Error("Not able to create diary");
            }
            const json = await response.json()
            console.log(json)
        } catch(err) {
            if (err instanceof Error)
                console.log(err.message)
        }

    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}