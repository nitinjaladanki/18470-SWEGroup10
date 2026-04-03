
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./MyLoginPage.module.css";

const API_BASE = "";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    
    try {
      const response = await fetch(`${API_BASE}/login`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", username);
        navigate('/portal');
      } else {
        setError("Login failed.");
      }
    } catch (error) {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {(
          <form onSubmit={handleSubmit} className={styles.form}>
            <p>Please enter your login information: </p>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Enter"}
            </button>
            <button type="button" className={styles.button} onClick={handleRegisterClick}>
              Create New Account
            </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


export default Login;