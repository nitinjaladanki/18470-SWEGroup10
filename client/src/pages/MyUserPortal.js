import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import styles from "./MyUserPortal.module.css";

const API_BASE = "http://localhost:5000";

const PROJECT_COLORS = ["#005f86", "#bf5700", "#579d42", "#7b2d8b", "#c0392b", "#16a085"];

function Portal() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [joinProjectId, setJoinProjectId] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const res = await fetch(`${API_BASE}/get_user_projects_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      const projectIds = data.projects || [];

      const details = await Promise.all(
        projectIds.map(async (pid) => {
          const r = await fetch(`${API_BASE}/get_project_info`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: pid }),
          });
          const d = await r.json();
          return d.success ? d.project : null;
        })
      );
      setProjects(details.filter(Boolean));
    } catch (err) {
      setProjectsError("Could not load projects.");
    } finally {
      setProjectsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchProjects();
  }, [userId, fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_BASE}/create_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, projectId, description: projectDesc, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setCreateSuccess("Project created successfully!");
        setProjectName("");
        setProjectId("");
        setProjectDesc("");
        fetchProjects();
      } else {
        setCreateError(data.message || "Failed to create project.");
      }
    } catch (err) {
      setCreateError("Could not connect to server.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinProject = async (e) => {
    e.preventDefault();
    setJoinError("");
    setJoinSuccess("");
    setJoinLoading(true);
    try {
      const res = await fetch(`${API_BASE}/join_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, projectId: joinProjectId }),
      });
      const data = await res.json();
      if (data.success) {
        setJoinSuccess("Joined project successfully!");
        setJoinProjectId("");
        fetchProjects();
      } else {
        setJoinError(data.message || "Failed to join project.");
      }
    } catch (err) {
      setJoinError("Could not connect to server.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate('/login');
  };

  return (
    <div className={styles.container}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
        <h2>Welcome, {username}</h2>
        <button onClick={handleLogout} className={styles.button} style={{ width: 'auto', padding: '0.4rem 1rem' }}>
          Logout
        </button>
      </div>

      {/* My Projects */}
      <div className={styles.card}>
        <h2>My Projects</h2>
        {projectsLoading && <p>Loading projects...</p>}
        {projectsError && <p style={{ color: 'red' }}>{projectsError}</p>}
        {!projectsLoading && projects.length === 0 && (
          <p>You have no projects yet. Create or join one below.</p>
        )}
        {projects.map((project, i) => (
          <Link
            key={project.projectId}
            to={`/project/${project.projectId}`}
            className={styles.cardLink}
          >
            <div
              className={styles.projectcard}
              style={{ backgroundColor: PROJECT_COLORS[i % PROJECT_COLORS.length] }}
            >
              <h2 style={{ margin: 0 }}>{project.projectName}</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', opacity: 0.85 }}>
                ID: {project.projectId}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Create New Project */}
      <div className={styles.card}>
        <h2 className={styles.title}>Create New Project</h2>
        <form onSubmit={handleCreateProject} className={styles.form}>
          <input
            type="text"
            required
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            required
            placeholder="Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            required
            placeholder="Project Description"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            className={styles.input}
          />
          {createError && <p style={{ color: 'red' }}>{createError}</p>}
          {createSuccess && <p style={{ color: 'green' }}>{createSuccess}</p>}
          <button type="submit" className={styles.button} disabled={createLoading}>
            {createLoading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>

      {/* Join Existing Project */}
      <div className={styles.card}>
        <h2 className={styles.title}>Join Existing Project</h2>
        <form onSubmit={handleJoinProject} className={styles.form}>
          <p>Please enter the ID of the project you would like to join:</p>
          <input
            type="text"
            required
            placeholder="Project ID"
            value={joinProjectId}
            onChange={(e) => setJoinProjectId(e.target.value)}
            className={styles.input}
          />
          {joinError && <p style={{ color: 'red' }}>{joinError}</p>}
          {joinSuccess && <p style={{ color: 'green' }}>{joinSuccess}</p>}
          <button type="submit" className={styles.button} disabled={joinLoading}>
            {joinLoading ? "Joining..." : "Join Project"}
          </button>
        </form>
      </div>

    </div>
  );
}

export default Portal;