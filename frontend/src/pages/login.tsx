import React from "react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";


const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops page refresh
    console.log("Logging in with:", { username, password });
    // Here you'll call your login API later
    try {
      await login(username, email, password)
    } catch (err) {
      console.log(err)
    }
    navigate("/")
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div>
        <label htmlFor="username">Username </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="email">Email </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="password">Password </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <button type="submit">Log in</button>

      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.9em', color: 'var(--color-text-muted)' }}>
          Don't have an account?
        </p>
        <button 
          type="button" 
          onClick={() => navigate("/register")}
          style={{ width: '100%' }}
        >
          Register
        </button>
      </div>
    </form>
  );
}

export default Login;