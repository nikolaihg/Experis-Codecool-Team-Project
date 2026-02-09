import React from "react";
import { useState } from "react";


const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stops page refresh
    console.log("Registering with:", { username, password });
    // Here you'll call your registration API later
  };

  return (
    <form onSubmit={handleSubmit}>
        <h1>Register</h1>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;