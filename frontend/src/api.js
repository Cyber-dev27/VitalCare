const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(res.status === 400 ? 'Please check the values entered.' : 'Request failed (' + res.status + ').');
  return res.status === 204 ? null : res.json();
}

export const api = {
  patients: (q = '') => req('/patients?q=' + encodeURIComponent(q)),
  patient: (id) => req('/patients/' + id),
  addPatient: (body) => req('/patients', { method: 'POST', body }),
  updatePatient: (id, body) => req('/patients/' + id, { method: 'PUT', body }),
  deletePatient: (id) => req('/patients/' + id, { method: 'DELETE' }),
  vitals: (id) => req('/patients/' + id + '/vitals'),
  addVital: (id, body) => req('/patients/' + id + '/vitals', { method: 'POST', body }),
  latest: () => req('/vitals/latest'),
};

// Reference ranges: returns 'ok' | 'warn' | 'crit'
export const METRICS = {
  bp: { label: 'Blood pressure', unit: 'mmHg' },
  spo2: { label: 'SpO₂', unit: '%' },
  heartRate: { label: 'Heart rate', unit: 'bpm' },
  temperature: { label: 'Temperature', unit: '°C' },
  respRate: { label: 'Resp. rate', unit: '/min' },
};

export function status(key, v) {
  if (!v) return 'none';
  const r = (val, crit, warn) => (crit(val) ? 'crit' : warn(val) ? 'warn' : 'ok');
  switch (key) {
    case 'spo2': return r(v.spo2, (x) => x < 92, (x) => x < 95);
    case 'heartRate': return r(v.heartRate, (x) => x < 50 || x > 120, (x) => x < 60 || x > 100);
    case 'temperature': return r(v.temperature, (x) => x >= 39 || x < 35, (x) => x >= 37.8 || x < 36);
    case 'respRate': return r(v.respRate, (x) => x < 10 || x > 24, (x) => x < 12 || x > 20);
    case 'bp': {
      const s = v.systolic, d = v.diastolic;
      if (s >= 180 || d >= 120 || s < 90) return 'crit';
      if (s >= 130 || d >= 85 || s < 100) return 'warn';
      return 'ok';
    }
    default: return 'none';
  }
}

export function overall(v) {
  if (!v) return 'none';
  const all = Object.keys(METRICS).map((k) => status(k, v));
  return all.includes('crit') ? 'crit' : all.includes('warn') ? 'warn' : 'ok';
}
