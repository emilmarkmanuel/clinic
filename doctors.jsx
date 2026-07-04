import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = {
  name: "",
  specialization: "General Practitioner",
  email: "",
  phone: "",
  roomNumber: "",
  workStart: "09:00",
  workEnd: "17:00",
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const rows = await api.getDoctors();
      setDoctors(rows.filter((d) => d.active === 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(doctor) {
    setForm({ ...emptyForm, ...doctor });
    setEditingId(doctor.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await api.updateDoctor(editingId, form);
      } else {
        await api.createDoctor(form);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(id) {
    if (!confirm("Deactivate this doctor?")) return;
    try {
      await api.deactivateDoctor(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink">
            Clinic doctors
          </h1>
          <p className="text-sm text-muted mt-1">
            Medical staff available for consultations
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          + Add doctor
        </button>
      </header>

      {error && (
        <div className="mb-4 text-sm text-status-cancelled bg-red-50 border border-red-100 rounded-card px-4 py-3">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-border bg-bg">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Specialization</th>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Hours</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No doctors yet.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-bg/60">
                  <td className="px-4 py-3 font-medium text-ink">
                    {doc.name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {doc.specialization}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {doc.roomNumber || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {doc.workStart?.slice(0, 5)} – {doc.workEnd?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {doc.email && (
                      <div className="text-xs break-all">{doc.email}</div>
                    )}
                    {doc.phone && <div className="text-xs">{doc.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      className="text-xs text-primary font-medium hover:underline mr-3"
                      onClick={() => openEdit(doc)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-status-cancelled font-medium hover:underline"
                      onClick={() => handleDeactivate(doc.id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card w-full max-w-md p-6">
            <h2 className="font-display font-bold text-lg mb-4">
              {editingId ? "Edit doctor" : "Add doctor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Specialization</label>
                <input
                  className="input"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Room number</label>
                <input
                  className="input"
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm({ ...form, roomNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start time</label>
                  <input
                    className="input"
                    type="time"
                    value={form.workStart}
                    onChange={(e) =>
                      setForm({ ...form, workStart: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">End time</label>
                  <input
                    className="input"
                    type="time"
                    value={form.workEnd}
                    onChange={(e) =>
                      setForm({ ...form, workEnd: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}