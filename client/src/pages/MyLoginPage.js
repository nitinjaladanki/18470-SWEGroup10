
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./ForgotMyPassword.module.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassWord] = useState("");
    const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User submitted login request");
    setSubmitted(true);
  };
  const handleClick = () => {
    navigate('/forgot-password');
  };

 return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {(
          <form onSubmit={handleSubmit} className={styles.form}>
            <p>Please enter your login information: </p>
            <input
              type="username"
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
          </form>
          
        )}
                    <button type="submit" className={styles.button}>
              Enter
            </button>
            <button onClick={handleClick} className={styles.button}>
      Forgot Password?
    </button>
      </div>
    </div>
  );
}


export default Login;