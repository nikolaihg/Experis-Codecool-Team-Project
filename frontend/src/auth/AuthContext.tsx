import { useContext, type ReactNode } from "react";
import { createContext, useState } from "react";


export interface AuthContextType {
    isAuthenticated: boolean,
    token: string | null,
    user: {id: string, email: string} | null,
    diaryListId: number | null,
    login: (username: string, email: string, password: string) => Promise<void>,
    logout: () => void
    register: (username: string, email: string, password: string) => Promise<void>,
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState(() => { return localStorage.getItem("token") })
    const [user, setUser] = useState(null)
    const [diaryListId, setDiaryListId] = useState(null)
    const isAuthenticated = !!token;

    const value = {
        isAuthenticated,
        token,
        user,
        diaryListId,
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

            localStorage.setItem("token", tokenFromServer)
            localStorage.setItem("token", tokenFromServer)
            setToken(tokenFromServer)
            setUser(json.user)
            console.log(tokenFromServer)

        } catch(err) {
            if (err instanceof Error)
                console.log(err.message)
        }
    }

    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("token")
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

            localStorage.setItem("token", tokenFromServer)
            localStorage.setItem("token", tokenFromServer)
            setToken(tokenFromServer)
            setUser(json.user)
            try {
                await createDiary(json.user.id, tokenFromServer)
            } catch(err){
                console.log(err)
            }
            console.log(tokenFromServer)
 
        } catch(err) {
            if (err instanceof Error)
                console.log(err.message)
        }
    }


    async function createDiary(userId: string, token: string) {
        console.log(userId)
        
        const diary = {
            name: "Diary",
            type: 0,
            isPublic: true
        };

        try {
            const response = await fetch(`/api/User/${userId}/lists`,
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
            setDiaryListId(json)
            console.log("hei")
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