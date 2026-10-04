import { useState } from 'react';

export default function PatientForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial || { name: '', age: '', gender: 'Female', phone: '', conditionNotes: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { await onSave({ ...f, age: Number(f.age) }); } catch (x) { setErr(x.message); }
  };

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>{initial ? 'Edit patient' : 'New patient'}</h2>
      {err && <div className="error" role="alert">{err}</div>}
      <div className="grid">
        <div><label htmlFor="n">Full name</label><input id="n" required value={f.name} onChange={set('name')} /></div>
        <div><label htmlFor="a">Age</label><input id="a" type="number" min="0" max="130" required value={f.age} onChange={set('age')} /></div>
        <div><label htmlFor="g">Gender</label>
          <select id="g" value={f.gender} onChange={set('gender')}><option>Female</option><option>Male</option><option>Other</option></select></div>
        <div><label htmlFor="p">Phone</label><input id="p" value={f.phone || ''} onChange={set('phone')} /></div>
      </div>
      <div><label htmlFor="c">Condition / notes</label><textarea id="c" rows="2" maxLength="500" value={f.conditionNotes || ''} onChange={set('conditionNotes')} /></div>
      <div className="row">
        <button className="btn" type="submit">Save patient</button>
        <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
