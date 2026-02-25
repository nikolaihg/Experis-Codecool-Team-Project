import React from "react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";


function RegisterPage(){
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const { register } = useAuth()
  const navigate = useNavigate()

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

    if(!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push("Password must include at least one special character.");
    }

    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stops page refresh
    const errors = validatePassword(password);
    setPasswordErrors(errors);
    setServerError(null);

    if (errors.length > 0) {
      return;
    }
    console.log("Registering with:", { username, password });
    try {
      await register(username, email, password)
      navigate("/")
    } catch(err){
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Registration failed. Please try again.");
      }
      console.log(err)
    }
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
          pattern="(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*\(\),.?:\{\}\|<>]).{8,}"
          title="Password must be at least 8 characters and include one capital letter, one number, and one special character."
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
      {serverError && (
        <p style={{ 
          color: "red", 
          marginTop: "10px",
          textAlign: "center",
          whiteSpace: "pre-wrap"
        }}>
          {serverError}
        </p>
      )}
      
      <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.9em', color: 'var(--color-text-muted)' }}>
          Already have an account?
        </p>
        <button 
          type="button" 
          onClick={() => navigate("/login")}
          style={{ width: '100%' }}
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default RegisterPage;