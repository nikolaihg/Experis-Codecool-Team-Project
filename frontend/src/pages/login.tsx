import React from "react";
import { useState } from "react";


const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stops page refresh
    console.log("Logging in with:", { username, password });
    // Here you'll call your login API later
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
      <button type="button" onClick={() => window.location.href = "/register"}>
        Register
      </button>
    </form>
  );
}

export default Login;