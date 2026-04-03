import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MyProjectPage.module.css';

const API_BASE = "";

const ResourceCard = ({ hwSetName, projectId, userId, onUpdate }) => {
  const [hwInfo, setHwInfo] = useState({ total_capacity: 0, available_capacity: 0 });
  const [checkedOut, setCheckedOut] = useState(0);
  const [requestValue, setRequestValue] = useState('');
  const [returnValue, setReturnValue] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHwInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get_hw_info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hwSetName }),
      });
      const data = await res.json();
      if (data.success) setHwInfo(data.hwSet);
    } catch (err) {
      console.error('Failed to fetch hw info:', err);
    }
  }, [hwSetName]);

  const fetchProjectInfo = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get_project_info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (data.success) {
        setCheckedOut(data.project.hwSets?.[hwSetName] ?? 0);
      }
    } catch (err) {
      console.error('Failed to fetch project info:', err);
    }
  }, [projectId, hwSetName]);

  useEffect(() => {
    fetchHwInfo();
    fetchProjectInfo();
  }, [fetchHwInfo, fetchProjectInfo]);

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/check_out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          hwSetName,
          qty: Number(requestValue),
          userId,
        }),
      });
      const data = await res.json();
      setStatus({ ok: data.success, msg: data.message });
      if (data.success) {
        setRequestValue('');
        await fetchHwInfo();
        await fetchProjectInfo();
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      setStatus({ ok: false, msg: 'Could not connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/check_in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          hwSetName,
          qty: Number(returnValue),
          userId,
        }),
      });
      const data = await res.json();
      setStatus({ ok: data.success, msg: data.message });
      if (data.success) {
        setReturnValue('');
        await fetchHwInfo();
        await fetchProjectInfo();
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      setStatus({ ok: false, msg: 'Could not connect to server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resourceCard}>
      <h3 className={styles.cardTitle}>{hwSetName}</h3>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Capacity</label>
        <div className={styles.displayBox}>{hwInfo.total_capacity}</div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Available</label>
        <div className={styles.displayBox}>{hwInfo.available_capacity}</div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Checked Out (this project)</label>
        <div className={styles.displayBox}>{checkedOut}</div>
      </div>

      {/* Check Out */}
      <form onSubmit={handleCheckOut} className={styles.inputGroup}>
        <label className={styles.label}>Check Out</label>
        <div className={styles.requestRow}>
          <input
            type="number"
            min="1"
            value={requestValue}
            onChange={(e) => setRequestValue(e.target.value)}
            className={styles.smallInput}
            placeholder="qty"
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '…' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Check In */}
      <form onSubmit={handleCheckIn} className={styles.inputGroup}>
        <label className={styles.label}>Check In</label>
        <div className={styles.requestRow}>
          <input
            type="number"
            min="1"
            value={returnValue}
            onChange={(e) => setReturnValue(e.target.value)}
            className={styles.smallInput}
            placeholder="qty"
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '…' : 'Submit'}
          </button>
        </div>
      </form>

      {status && (
        <p className={`${styles.statusText} ${status.ok ? styles.accepted : styles.denied}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
};

// ── Project page ──────────────────────────────────────────────────────────────
const ResourceView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const [project, setProject] = useState(null);
  const [hwNames, setHwNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPage = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projRes, hwRes] = await Promise.all([
        fetch(`${API_BASE}/get_project_info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        }),
        fetch(`${API_BASE}/get_all_hw_names`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }),
      ]);

      const projData = await projRes.json();
      const hwData = await hwRes.json();

      if (!projData.success) {
        setError('Project not found.');
        return;
      }
      setProject(projData.project);
      setHwNames(hwData.hwNames || []);
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    loadPage();
  }, [userId, navigate, loadPage]);

  if (loading) return <p style={{ padding: '2rem' }}>Loading project…</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          {project.projectName} — Resource View
        </h1>
        <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.9rem', color: '#e1e1e1' }}>
          ID: {project.projectId}
        </p>
        <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.9rem', color: '#e1e1e1' }}>
          {project.description}
        </p>
        <button
          onClick={() => navigate('/portal')}
          style={{
            marginTop: '0.5rem',
            padding: '0.3rem 0.8rem',
            cursor: 'pointer',
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            borderRadius: '4px',
          }}
        >
          ← Back to Portal
        </button>
      </header>

      <main className={styles.container}>
        {hwNames.length === 0 && (
          <p>No hardware sets available.</p>
        )}
        {hwNames.map((name) => (
          <ResourceCard
            key={name}
            hwSetName={name}
            projectId={projectId}
            userId={userId}
            onUpdate={loadPage}
          />
        ))}
      </main>
    </div>
  );
};

export default ResourceView;