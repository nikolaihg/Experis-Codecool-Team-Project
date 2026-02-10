import React from "react";
import { useState } from "react";


const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");

  const validatePassword = (value: string) => {
    const errors: string[] = [];

    if (value.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (!/[A-Z]/.test(value)) {
      errors.push("Password must include at least one capital letter.");
    }

    if (!/[0-9]/.test(value)) {
      errors.push("Password must include at least one number.");
    }

    return errors;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stops page refresh
    const errors = validatePassword(password);
    setPasswordErrors(errors);

    if (errors.length > 0) {
      return;
    }
    console.log("Registering with:", { username, password });
    // Here you'll call your registration API later
  };

  return (
    <form onSubmit={handleSubmit}>
        <h1>Register</h1>
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
          onChange={(e) => {
            const nextValue = e.target.value;
            setPassword(nextValue);
            setPasswordErrors(validatePassword(nextValue));
          }}
          autoComplete="new-password"
          minLength={8}
          pattern="(?=.*[A-Z])(?=.*\d).{8,}"
          title="Password must be at least 8 characters and include one capital letter and one number."
        />
        {passwordErrors.length > 0 && (
          <ul>    
            {passwordErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;