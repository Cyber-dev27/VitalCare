import { useEffect, useState, useCallback } from 'react';
import { api, status, overall, METRICS } from './api.js';
import PatientForm from './PatientForm.jsx';
import PatientDetail from './PatientDetail.jsx';

const LABEL = { ok: 'Normal', warn: 'Watch', crit: 'Critical', none: 'No readings' };
export const Badge = ({ s }) => <span className={'badge ' + s}>{LABEL[s]}</span>;
export const fmt = (d) => new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

export default function App() {
  const [openId, setOpenId] = useState(null);
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <button className="brand" onClick={() => setOpenId(null)}>VitalCare</button>
          <span className="muted">Patient vitals monitoring</span>
        </div>
      </header>
      <main className="wrap">
        {openId ? <PatientDetail id={openId} onBack={() => setOpenId(null)} /> : <Dashboard onOpen={setOpenId} />}
      </main>
    </>
  );
}

function Dashboard({ onOpen }) {
  const [patients, setPatients] = useState([]);
  const [latest, setLatest] = useState({});
  const [q, setQ] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, l] = await Promise.all([api.patients(q), api.latest()]);
      setPatients(p);
      setLatest(Object.fromEntries(l.map((v) => [v.patientId, v])));
      setError('');
    } catch (e) { setError('Cannot reach the server. Make sure the backend is running on port 8080.'); }
  }, [q]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  useEffect(() => { const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const levels = patients.map((p) => overall(latest[p.id]));
  const count = (s) => levels.filter((x) => x === s).length;

  return (
    <div className="stack">
      <div className="row between">
        <h1>Patients</h1>
        <button className="btn" onClick={() => setAdding(true)}>Add patient</button>
      </div>
      {error && <div className="error" role="alert">{error}</div>}

      <div className="stats">
        <div className="card stat"><span className="muted">Total patients</span><b>{patients.length}</b></div>
        <div className="card stat"><span className="muted">Critical</span><b style={{ color: 'var(--crit)' }}>{count('crit')}</b></div>
        <div className="card stat"><span className="muted">Watch</span><b style={{ color: 'var(--warn)' }}>{count('warn')}</b></div>
        <div className="card stat"><span className="muted">Normal</span><b style={{ color: 'var(--ok)' }}>{count('ok')}</b></div>
      </div>

      {adding && (
        <PatientForm onCancel={() => setAdding(false)}
          onSave={async (b) => { const p = await api.addPatient(b); setAdding(false); onOpen(p.id); }} />
      )}

      <div className="card stack">
        <input className="search" placeholder="Search by name" aria-label="Search patients" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="scroll">
          <table>
            <thead><tr><th>Name</th><th>Age</th><th>BP</th><th>SpO₂</th><th>Heart rate</th><th>Last reading</th><th>Status</th></tr></thead>
            <tbody>
              {patients.map((p) => {
                const v = latest[p.id];
                return (
                  <tr key={p.id} className="click" tabIndex={0} onClick={() => onOpen(p.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}>
                    <td><b>{p.name}</b></td>
                    <td>{p.age}</td>
                    <td>{v ? `${v.systolic}/${v.diastolic}` : '–'}</td>
                    <td>{v ? v.spo2 + '%' : '–'}</td>
                    <td>{v ? v.heartRate : '–'}</td>
                    <td>{v ? fmt(v.recordedAt) : '–'}</td>
                    <td><Badge s={overall(v)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!patients.length && !error && <div className="empty">No patients yet. Select “Add patient” to create the first record.</div>}
        </div>
      </div>
    </div>
  );
}
