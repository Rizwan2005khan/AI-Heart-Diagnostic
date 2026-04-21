import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  History,
  Clipboard,
  Heart,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [formData, setFormData] = useState({
    age: 50, sex: 1, cp: 0, trestbps: 120, chol: 200,
    fbs: 0, restecg: 0, thalach: 150, exang: 0,
    oldpeak: 0.0, slope: 1, ca: 0, thal: 2
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'oldpeak' ? parseFloat(value) : parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_URL}/predict`, formData);
      setResult(res.data);
      fetchHistory(); // Refresh history after new prediction
    } catch (err) {
      alert("Error processing diagnostic. Make sure the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="app-container">
      {/* Header / Hero */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="glass" style={{ padding: '1rem', borderRadius: '50%' }}>
            <Heart size={40} color="#00d1ff" fill="#00d1ff22" />
          </div>
        </div>
        <h1>AI Heart Diagnostic Portal</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Advanced cardiovascular risk assessment powered by precision machine learning.
          Enter clinical data below for instant AI-driven diagnostics.
        </p>
      </motion.header>

      <main>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <button
            className={`btn-primary ${!showHistory ? '' : 'glass'}`}
            onClick={() => setShowHistory(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: !showHistory ? undefined : 'transparent' }}
          >
            <Activity size={18} /> Run Diagnostic
          </button>
          <button
            className={`btn-primary ${showHistory ? '' : 'glass'}`}
            onClick={() => setShowHistory(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: showHistory ? undefined : 'transparent' }}
          >
            <History size={18} /> View History
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass"
              style={{ padding: '2.5rem' }}
            >
              <h2><Clipboard style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Clinical Parameters</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} min="1" max="110" />
                  </div>
                  <div className="form-group">
                    <label>Sex</label>
                    <select name="sex" value={formData.sex} onChange={handleChange}>
                      <option value={1}>Male</option>
                      <option value={0}>Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Chest Pain Type</label>
                    <select name="cp" value={formData.cp} onChange={handleChange}>
                      <option value={0}>Typical Angina</option>
                      <option value={1}>Atypical Angina</option>
                      <option value={2}>Non-anginal Pain</option>
                      <option value={3}>Asymptomatic</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Resting BP (mmHg)</label>
                    <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Cholesterol (mg/dl)</label>
                    <input type="number" name="chol" value={formData.chol} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Fasting Blood Sugar</label>
                    <select name="fbs" value={formData.fbs} onChange={handleChange}>
                      <option value={0}>&lt; 120 mg/dl</option>
                      <option value={1}>&gt; 120 mg/dl</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Resting ECG</label>
                    <select name="restecg" value={formData.restecg} onChange={handleChange}>
                      <option value={0}>Normal</option>
                      <option value={1}>ST-T Wave Abnormality</option>
                      <option value={2}>LV Hypertrophy</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Max Heart Rate</label>
                    <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Exercise Angina</label>
                    <select name="exang" value={formData.exang} onChange={handleChange}>
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ST Depression</label>
                    <input type="number" step="0.1" name="oldpeak" value={formData.oldpeak} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Peak ST Slope</label>
                    <select name="slope" value={formData.slope} onChange={handleChange}>
                      <option value={0}>Upsloping</option>
                      <option value={1}>Flat</option>
                      <option value={2}>Downsloping</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Major Vessels (0-3)</label>
                    <input type="number" name="ca" value={formData.ca} onChange={handleChange} min="0" max="3" />
                  </div>
                  <div className="form-group">
                    <label>Thalassemia</label>
                    <select name="thal" value={formData.thal} onChange={handleChange}>
                      <option value={1}>Normal</option>
                      <option value={2}>Fixed Defect</option>
                      <option value={3}>Reversible Defect</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.1rem' }}>
                  {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Activity size={20} /> Run AI Analysis</>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass"
              style={{ padding: '2rem' }}
            >
              <h2>Diagnostic History</h2>
              {history.length === 0 ? (
                <p>No records found. Run a diagnostic to see results here.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Age</th>
                        <th style={{ padding: '1rem' }}>Diagnosis</th>
                        <th style={{ padding: '1rem' }}>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(item => (
                        <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '1rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '1rem' }}>{item.patientData.age}</td>
                          <td style={{ padding: '1rem', color: item.prediction.label.includes('Detected') ? 'var(--danger)' : 'var(--success)' }}>
                            {item.prediction.label}
                          </td>
                          <td style={{ padding: '1rem' }}>{item.prediction.confidence.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Modal / Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass result-card active-glow"
            >
              <div className="result-header">Diagnostic Outcome</div>
              <div className={`result-status ${result.prediction === 1 ? 'status-positive' : 'status-negative'}`}>
                {result.prediction === 1 ? <AlertCircle size={48} style={{ marginBottom: '10px' }} /> : <CheckCircle2 size={48} style={{ marginBottom: '10px' }} />}
                <br /> {result.label}
              </div>
              <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                Confidence Level: <strong>{result.confidence.toFixed(2)}%</strong>
              </p>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  width: '60%',
                  margin: '0 auto',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  style={{
                    height: '100%',
                    background: result.prediction === 1 ? 'var(--danger)' : 'var(--success)',
                  }}
                />
              </div>
              <button
                className="btn-primary glass"
                style={{ marginTop: '2rem', padding: '0.5rem 1.5rem' }}
                onClick={() => setResult(null)}
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5 }}>
        <p>© 2026 AI Heart Diagnostic Suite • Powered by Antigravity AI</p>
      </footer>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
