import { useState } from "react";
import styles from "./Checkout.module.css";

function Checkout({ projectId }) {
  const [hw1Amount, setHw1Amount] = useState(0);
  const [hw2Amount, setHw2Amount] = useState(0);

  const handleHW1 = (e) => {
    e.preventDefault();
    // TODO: connect to backend API
  };

  const handleHW2 = (e) => {
    e.preventDefault();
    // TODO: connect to backend API
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>HWSet1</h3>
        <h3 className={styles.title}>Availability: X</h3>
        <h3 className={styles.title}>Capacity: Y</h3>
        <p className={styles.caption}>Request amount:</p>
        <form className={styles.form} onSubmit={handleHW1}>
          <input 
            type="number" 
            value={hw1Amount} 
            onChange={(e) => setHw1Amount(e.target.value)} className={styles.input}
          />
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>HWSet2</h3>
        <h3 className={styles.title}>Availability: X</h3>
        <h3 className={styles.title}>Capacity: Y</h3>
        <p className={styles.caption}>Request amount:</p>
        <form className={styles.form} onSubmit={handleHW2}>
          <input 
            type="number" 
            value={hw2Amount} 
            onChange={(e) => setHw2Amount(e.target.value)} className={styles.input}
          />
          <button type="submit" className={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;