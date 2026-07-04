import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [appts, employees, doctors] = await Promise.all([
          api.getAppointments({ date: todayISO() }),
          api.getEmployees({ active: "true" }),
          api.getDoctors(),
        ]);
        setAppointments(appts);
        setEmployeeCount(employees.length);
        setDoctorCount(doctors.filter((d) => d.active === 1).length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const scheduledToday = appointments.filter(
    (a) => a.status === "scheduled" || a.status === "checked_in"
  ).length;
  const completedToday = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <div className="p-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-2xl font-display font-extrabold text-ink">
          Today at the clinic
        </h1>
        <p className="text-sm text-muted mt-1">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {error && (
        <div className="mb-6 text-sm text-status-cancelled bg-red-50 border border-red-100 rounded-card px-4 py-3">
          {error} — is the API server running on port 4000?
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Active employees" value={employeeCount} />
        <StatCard label="Clinic doctors" value={doctorCount} />
        <StatCard label="Awaiting today" value={scheduledToday} accent="status-scheduled" />
        <StatCard label="Completed today" value={completedToday} accent="status-completed" />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink">
            Today's appointments
          </h2>
          <Link to="/appointments" className="text-sm text-primary font-medium hover:underline">
            Book new →
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">
            Nothing on the schedule yet today.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-border">
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Employee</th>
                <th className="pb-2 font-medium">Doctor</th>
                <th className="pb-2 font-medium">Reason</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 font-mono text-xs text-ink">
                    {a.startTime?.slice(0, 5)}
                  </td>
                  <td className="py-3">
                    {a.employeeName} {a.employeeLastName}
                    <div className="text-xs text-muted font-mono">
                      {a.employeeCode}
                    </div>
                  </td>
                  <td className="py-3 text-muted">{a.doctorName || "—"}</td>
                  <td className="py-3 text-muted">{a.reason || "—"}</td>
                  <td className="py-3">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <div className="text-2xl font-display font-extrabold text-ink">
        {value}
      </div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}