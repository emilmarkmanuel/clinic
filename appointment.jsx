import { useEffect, useState } from "react";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking form state
  const [selectedDate, setSelectedDate] = useState(tomorrowISO());
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:20");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "completed",
    notes: "",
    diagnosis: "",
  });
  const [editingStatus, setEditingStatus] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [appts, emps, docs] = await Promise.all([
        api.getAppointments({ date: selectedDate }),
        api.getEmployees({ active: "true" }),
        api.getDoctors(),
      ]);
      setAppointments(appts);
      setEmployees(emps);
      setDoctors(docs.filter((d) => d.active === 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [selectedDate]);

  async function handleBooking(e) {
    e.preventDefault();
    setBooking(true);
    setError("");
    try {
      if (!selectedEmployee || !startTime || !endTime) {
        throw new Error("Employee, start time, and end time are required");
      }
      await api.createAppointment({
        employeeId: Number(selectedEmployee),
        doctorId: selectedDoctor ? Number(selectedDoctor) : null,
        appointmentDate: selectedDate,
        startTime,
        endTime,
        reason: reason || null,
        status: "scheduled",
      });
      // Reset form
      setSelectedEmployee("");
      setSelectedDoctor("");
      setStartTime("10:00");
      setEndTime("10:20");
      setReason("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  }

  async function handleUpdateAppointment(id) {
    setEditingStatus(true);
    setError("");
    try {
      await api.updateAppointment(id, editForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditingStatus(false);
    }
  }

  async function handleCancelAppointment(id) {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await api.cancelAppointment(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const getEmployeeName = (id) => {
    const e = employees.find((x) => x.id === id);
    return e ? `${e.firstName} ${e.lastName}` : "—";
  };

  const getDoctorName = (id) => {
    const d = doctors.find((x) => x.id === id);
    return d ? d.name : "—";
  };

  return (
    <div className="p-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-2xl font-display font-extrabold text-ink">
          Clinic appointments
        </h1>
        <p className="text-sm text-muted mt-1">Book and manage consultations</p>
      </header>

      {error && (
        <div className="mb-4 text-sm text-status-cancelled bg-red-50 border border-red-100 rounded-card px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Booking Panel */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-ink mb-4">
            Book appointment
          </h2>
          <form onSubmit={handleBooking} className="space-y-3">
            <div>
              <label className="label">Date *</label>
              <input
                className="input"
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Employee *</label>
              <select
                className="input"
                required
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select employee…</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} ({e.employeeCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Doctor (optional)</label>
              <select
                className="input"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">No preference</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Reason</label>
              <input
                className="input text-sm"
                placeholder="Health checkup, follow-up, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="label">Start time *</label>
                <input
                  className="input"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="label">End time *</label>
                <input
                  className="input"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={booking}
            >
              {booking ? "Booking…" : "Book appointment"}
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-bg">
              <h3 className="font-display font-bold text-ink">
                {selectedDate === new Date().toISOString().slice(0, 10)
                  ? "Today"
                  : new Date(selectedDate).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
              </h3>
            </div>

            {loading ? (
              <div className="px-5 py-8 text-center text-muted">
                Loading appointments…
              </div>
            ) : appointments.length === 0 ? (
              <div className="px-5 py-8 text-center text-muted">
                No appointments scheduled for this date.
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-4 hover:bg-bg/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-display font-semibold text-ink">
                          {appt.startTime?.slice(0, 5)} –{" "}
                          {appt.endTime?.slice(0, 5)}
                        </div>
                        <div className="text-sm text-muted mt-0.5">
                          {appt.employeeName} {appt.employeeLastName}
                        </div>
                        <div className="text-xs font-mono text-muted">
                          {appt.employeeCode}
                        </div>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>

                    <div className="text-sm text-muted my-2">
                      {appt.doctorName && (
                        <div>
                          Dr. {appt.doctorName} •{" "}
                          {appt.reason || "No reason specified"}
                        </div>
                      )}
                      {!appt.doctorName && (appt.reason || "No reason")}
                    </div>

                    {appt.notes && (
                      <div className="text-xs text-muted bg-bg/50 p-2 rounded my-2">
                        <strong>Notes:</strong> {appt.notes}
                      </div>
                    )}
                    {appt.diagnosis && (
                      <div className="text-xs text-muted bg-bg/50 p-2 rounded my-2">
                        <strong>Diagnosis:</strong> {appt.diagnosis}
                      </div>
                    )}

                    <div className="flex gap-2 mt-3 text-xs">
                      {appt.status !== "completed" &&
                        appt.status !== "cancelled" && (
                          <button
                            className="text-primary font-medium hover:underline"
                            onClick={() => {
                              setEditingId(appt.id);
                              setEditForm({
                                status: appt.status,
                                notes: appt.notes || "",
                                diagnosis: appt.diagnosis || "",
                              });
                            }}
                          >
                            Update
                          </button>
                        )}
                      {appt.status !== "cancelled" && (
                        <button
                          className="text-status-cancelled font-medium hover:underline"
                          onClick={() => handleCancelAppointment(appt.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card w-full max-w-md p-6">
            <h2 className="font-display font-bold text-lg mb-4">
              Update appointment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="checked_in">Checked in</option>
                  <option value="completed">Completed</option>
                  <option value="no_show">No-show</option>
                </select>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  className="input"
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  placeholder="Consultation notes…"
                />
              </div>
              <div>
                <label className="label">Diagnosis</label>
                <textarea
                  className="input"
                  rows={2}
                  value={editForm.diagnosis}
                  onChange={(e) =>
                    setEditForm({ ...editForm, diagnosis: e.target.value })
                  }
                  placeholder="Medical diagnosis…"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="btn-secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  disabled={editingStatus}
                  onClick={() => handleUpdateAppointment(editingId)}
                >
                  {editingStatus ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}