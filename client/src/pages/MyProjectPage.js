import React, { useState } from 'react';
import styles from './MyProjectPage.module.css';

const ResourceCard = ({ title, capacity, available }) => {
  const [requestValue, setRequestValue] = useState('');
  const [status, setStatus] = useState(null); // 'Accepted' or 'Denied'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example logic matching your screenshot
    if (requestValue > 0 && requestValue <= available) {
      setStatus('Accepted');
    } else {
      setStatus('Denied');
    }
  };

  return (
    <div className={styles.resourceCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>Capacity</label>
        <div className={styles.displayBox}>{capacity}</div>
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>Available</label>
        <div className={styles.displayBox}>{available}</div>
      </div>

      <form onSubmit={handleSubmit} className={styles.inputGroup}>
        <label className={styles.label}>Request?</label>
        <div className={styles.requestRow}>
          <input 
            type="number" 
            value={requestValue} 
            onChange={(e) => setRequestValue(e.target.value)} 
            className={styles.smallInput}
          />
          <button type="submit" className={styles.submitBtn}>Submit</button>
        </div>
      </form>

      {status && (
        <p className={`${styles.statusText} ${status === 'Accepted' ? styles.accepted : styles.denied}`}>
          {status}
        </p>
      )}
    </div>
  );
};

const ResourceView = () => {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Project 1 Resource View</h1>
      </header>
      
      <main className={styles.container}>
        <ResourceCard title="HW Set1" capacity={100} available={50} />
        <ResourceCard title="HW Set2" capacity={100} available={30} />
      </main>
    </div>
  );
};

export default ResourceView;