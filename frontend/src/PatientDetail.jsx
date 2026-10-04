import { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { api, status, overall, METRICS } from './api.js';
import { Badge, fmt } from './App.jsx';
import PatientForm from './PatientForm.jsx';

const EMPTY = { systolic: '', diastolic: '', spo2: '', heartRate: '', temperature: '', respRate: '' };

export default function PatientDetail({ id, onBack }) {
  const [p, setP] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [pt, v] = await Promise.all([api.patient(id), api.vitals(id)]);
      setP(pt); setVitals(v);
    } catch { setError('Could not load this patient.'); }
  }, [id]);
  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : Number(v)]));
      await api.addVital(id, body);
      setForm(EMPTY); setError(''); load();
    } catch (x) { setError(x.message); }
  };

  const remove = async () => {
    if (window.confirm('Delete this patient and all their readings?')) { await api.deletePatient(id); onBack(); }
  };

  if (!p) return <div>{error || 'Loading…'}</div>;
  const last = vitals[0];
  const chart = [...vitals].reverse().map((v) => ({
    time: new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    Systolic: v.systolic, Diastolic: v.diastolic, 'SpO₂': v.spo2, 'Heart rate': v.heartRate,
  }));
  const tiles = [
    ['bp', last && `${last.systolic}/${last.diastolic}`], ['spo2', last && last.spo2],
    ['heartRate', last && last.heartRate], ['temperature', last && last.temperature], ['respRate', last && last.respRate],
  ];
  const num = (k, label, props = {}) => (
    <div><label htmlFor={k}>{label}</label>
      <input id={k} type="number" step={props.step || 1} required value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
  );

  return (
    <div className="stack">
      <button className="btn ghost small" onClick={onBack}>Back to patients</button>

      {editing ? (
        <PatientForm initial={p} onCancel={() => setEditing(false)}
          onSave={async (b) => { await api.updatePatient(id, b); setEditing(false); load(); }} />
      ) : (
        <div className="card row between">
          <div>
            <h1>{p.name}</h1>
            <div className="muted">{p.age} yrs · {p.gender}{p.phone ? ' · ' + p.phone : ''}</div>
            {p.conditionNotes && <p style={{ margin: '8px 0 0' }}>{p.conditionNotes}</p>}
          </div>
          <div className="row">
            <Badge s={overall(last)} />
            <button className="btn ghost small" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn danger small" onClick={remove}>Delete</button>
          </div>
        </div>
      )}

      <div className="tiles">
        {tiles.map(([k, val]) => (
          <div key={k} className={'tile ' + status(k, last)}>
            <small>{METRICS[k].label}</small><br />
            <b>{val ?? '–'}</b> <small>{METRICS[k].unit}</small>
          </div>
        ))}
      </div>

      <form className="card stack" onSubmit={submit}>
        <h2>Record new reading</h2>
        {error && <div className="error" role="alert">{error}</div>}
        <div className="grid">
          {num('systolic', 'Systolic (mmHg)')}{num('diastolic', 'Diastolic (mmHg)')}
          {num('spo2', 'SpO₂ (%)')}{num('heartRate', 'Heart rate (bpm)')}
          {num('temperature', 'Temperature (°C)', { step: 0.1 })}{num('respRate', 'Resp. rate (/min)')}
        </div>
        <div><button className="btn" type="submit">Save reading</button></div>
      </form>

      <div className="card stack">
        <h2>Trends</h2>
        {chart.length < 2 ? <div className="empty">Record at least two readings to see trends.</div> : (
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chart}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="var(--muted)" /><YAxis stroke="var(--muted)" domain={['auto', 'auto']} />
                <Tooltip /><Legend />
                <Line dataKey="Systolic" stroke="#c0645a" dot={false} strokeWidth={2} />
                <Line dataKey="Diastolic" stroke="#d9a05b" dot={false} strokeWidth={2} />
                <Line dataKey="SpO₂" stroke="#2f7d77" dot={false} strokeWidth={2} />
                <Line dataKey="Heart rate" stroke="#6b8fc4" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card stack">
        <h2>History</h2>
        <div className="scroll">
          <table>
            <thead><tr><th>Time</th><th>BP</th><th>SpO₂</th><th>HR</th><th>Temp</th><th>RR</th><th>Status</th></tr></thead>
            <tbody>
              {vitals.map((v) => (
                <tr key={v.id}><td>{fmt(v.recordedAt)}</td><td>{v.systolic}/{v.diastolic}</td><td>{v.spo2}%</td>
                  <td>{v.heartRate}</td><td>{v.temperature}</td><td>{v.respRate}</td><td><Badge s={overall(v)} /></td></tr>
              ))}
            </tbody>
          </table>
          {!vitals.length && <div className="empty">No readings yet. Use the form above to record the first one.</div>}
        </div>
      </div>
    </div>
  );
}
