import { useState } from "react";
import styles from "./MyRegistrationPage.module.css";

function MyRegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration request for:", { firstName, lastName, email, password });
  };

  return (
    <div className={styles.container}>  
      <div className={styles.card}>
        <h2 className={styles.title}>New user? Create an account</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.caption}>First Name</p>
          <input 
            type="text" 
            placeholder="First Name" 
            className={styles.input} 
            required onChange={(e) => setFirstName(e.target.value)} 
          />
          <p className={styles.caption}>Last Name</p>
          <input 
            type="text" 
            placeholder="Last Name" 
            className={styles.input} 
            required onChange={(e) => setLastName(e.target.value)} 
          />
          <p className={styles.caption}>Email Address</p>
          <input 
            type="email" 
            placeholder="Email Address" 
            className={styles.input} 
            required onChange={(e) => setEmail(e.target.value)} 
          />
          <p className={styles.caption}>Password</p>
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.input} 
            required onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default MyRegistrationPage;