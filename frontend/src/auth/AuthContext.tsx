import { useContext, type ReactNode } from "react";
import { createContext, useState } from "react";


export interface AuthContextType {
    isAuthenticated: boolean,
    token: string | null,
    login: (username: string, email: string, password: string) => Promise<void>,
    logout: () => void
    register: (username: string, email: string, password: string) => Promise<void>,
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState(() => { return localStorage.getItem("auth_token") })
    const isAuthenticated = !!token;

    const value = {
        isAuthenticated,
        token,
        login,
        logout,
        register
    }

    async function login(username: string, email: string, password: string) {
        try {
            const response = await fetch("http://localhost:5102/api/Auth/login", 
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
            setToken(tokenFromServer)
            console.log(tokenFromServer)

        } catch(err) {
            if (err instanceof Error)
                console.log(err.message)
        }
    }

    function logout(){
        localStorage.removeItem("auth_token")
        setToken(null)
    }

    async function register(username: string, email: string, password: string) {
        try {
            const response = await fetch("http://localhost:5102/api/Auth/register", 
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
            setToken(tokenFromServer)
            console.log(tokenFromServer)
 
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