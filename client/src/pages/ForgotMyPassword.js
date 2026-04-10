import { useState } from "react";
import styles from "./ForgotMyPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset request for:", email);
    setSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Forgot Password</h2>
        {submitted ? (
          <p>
            Check your email for a password reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p>Enter your email address to receive a password reset link.</p>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;