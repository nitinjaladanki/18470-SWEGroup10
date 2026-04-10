import { useState } from "react";
import styles from "./MyRegistrationPage.module.css";
import { useNavigate } from 'react-router-dom';

const API_BASE = "";

function MyRegistrationPage() {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [userId, setuserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = () => {
    navigate('/login'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // handle mistyped password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/add_user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Your account was created.");
        // clear
        setusername("");
        setuserId("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      setError("Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>  
      <div className={styles.card}>
        <h2 className={styles.title}>New user? Create an account</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.caption}>Username</p>
          <input 
            type="text" 
            placeholder="Username" 
            className={styles.input} 
            value={username}
            required onChange={(e) => setusername(e.target.value)} 
          />
          <p className={styles.caption}>Password</p>
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.input}
            value={password} 
            required onChange={(e) => setPassword(e.target.value)} 
          />
          <p className={styles.caption}>Confirm Password</p>
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Have an account?{' '}
          <span
            onClick={handleRegisterClick}
            style={{ cursor: 'pointer', textDecoration: 'underline', color: '#4a90e2' }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default MyRegistrationPage;