// Author: Phoebe Franklin 2/23/2026

import { useState } from "react";
import styles from "./MyUserPortal.module.css";

function Portal() {
  
  const [name, setName] = useState("");
  const [projectID, setProjectID] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Project Created: ", name);
    setSubmitted(true);
  };

 return (

<div className={styles.container}>
  <div className={styles.card}>
     <h2>My Project View</h2>
     <div className={styles.projectcard}style={{ backgroundColor: "#005f86" }} >
        <h2>My Project 1</h2>
        
    </div>
         <div className={styles.projectcard}style={{ backgroundColor: "#bf5700" }} >
        <h2>My Project 2</h2>
        
    </div>
         <div className={styles.projectcard}style={{ backgroundColor: "#579d42" }} >
        <h2>My Project 3</h2>
        
    </div>
  </div>
      <div className={styles.card}>
        <h2 className={styles.title}>Create New Project</h2>
        {submitted ? (
          <p>
            Your new project has been created. 
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p>Enter your new project info here:</p>
            <input
              type="name"
              required
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <input
              type="projectID"
              required
              placeholder="Project ID"
              value={projectID}
              onChange={(e) => setProjectID(e.target.value)}
              className={styles.input}
            />
            <input
              type="projectDesc"
              required
              placeholder="Project Description"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Create Project
            </button>
          </form>
        )}
      </div>
    </div>

  );
}


export default Portal;