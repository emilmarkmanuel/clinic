import { useEffect, useState } from "react";
import { api } from "../api";

const emptyForm = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  allergies: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load(searchTerm = "") {
    setLoading(true);
    try {
      const rows = await api.getEmployees(
        searchTerm ? { search: searchTerm } : {}
      );
      setEmployees(rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(emp) {
    setForm({ ...emptyForm, ...emp, dateOfBirth: emp.dateOfBirth || "" });
    setEditingId(emp.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.dateOfBirth) delete payload.dateOfBirth;
      if (!payload.gender) delete payload.gender;
      if (editingId) {
        await api.updateEmployee(editingId, payload);
      } else {
        await api.createEmployee(payload);
      }
      setShowForm(false);
      await load(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(id) {
    if (!confirm("Deactivate this employee record?")) return;
    try {
      await api.deactivateEmployee(id);
      await load(search);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink">
            Employees
          </h1>
          <p className="text-sm text-muted mt-1">
            Company staff registered with the in-house clinic
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          + Add employee
        </button>
      </header>

      <div className="mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search by name, code, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-4 text-sm text-status-cancelled bg-red-50 border border-red-100 rounded-card px-4 py-3">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-border bg-bg">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-bg/60">
                  <td className="px-4 py-3 font-mono text-xs">
                    {emp.employeeCode}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {emp.firstName} {emp.lastName}
                    <div className="text-xs text-muted font-normal">
                      {emp.position}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {emp.department || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {emp.email && <div>{emp.email}</div>}
                    {emp.phone && <div>{emp.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      className="text-xs text-primary font-medium hover:underline mr-3"
                      onClick={() => openEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-status-cancelled font-medium hover:underline"
                      onClick={() => handleDeactivate(emp.id)}
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
          <div className="bg-white rounded-card w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <h2 className="font-display font-bold text-lg mb-4">
              {editingId ? "Edit employee" : "Add employee"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Employee code *</label>
                  <input
                    className="input"
                    required
                    value={form.employeeCode}
                    onChange={(e) =>
                      setForm({ ...form, employeeCode: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input
                    className="input"
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">First name *</label>
                  <input
                    className="input"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Last name *</label>
                  <input
                    className="input"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
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
                <div>
                  <label className="label">Position</label>
                  <input
                    className="input"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Date of birth</label>
                  <input
                    className="input"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select
                    className="input"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Blood group</label>
                  <input
                    className="input"
                    placeholder="O+"
                    value={form.bloodGroup}
                    onChange={(e) =>
                      setForm({ ...form, bloodGroup: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Emergency contact name</label>
                  <input
                    className="input"
                    value={form.emergencyContactName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        emergencyContactName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Emergency contact phone</label>
                  <input
                    className="input"
                    value={form.emergencyContactPhone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="label">Allergies / known conditions</label>
                <textarea
                  className="input"
                  rows={2}
                  value={form.allergies}
                  onChange={(e) =>
                    setForm({ ...form, allergies: e.target.value })
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
                  {saving ? "Saving…" : "Save employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
