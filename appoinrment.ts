import { Router } from "express";
import { eq, and, ne, lt, gt, asc } from "drizzle-orm";
import { db, schema } from "../db";

const router = Router();
const { appointments, employees, doctors } = schema;

// GET /api/appointments?date=YYYY-MM-DD&doctorId=&employeeId=&status=
router.get("/", async (req, res) => {
  try {
    const { date, doctorId, employeeId, status } = req.query as Record<
      string,
      string | undefined
    >;

    const conditions = [];
    if (date) conditions.push(eq(appointments.appointmentDate, date));
    if (doctorId) conditions.push(eq(appointments.doctorId, Number(doctorId)));
    if (employeeId)
      conditions.push(eq(appointments.employeeId, Number(employeeId)));
    if (status) conditions.push(eq(appointments.status, status as any));

    const rows = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        reason: appointments.reason,
        notes: appointments.notes,
        diagnosis: appointments.diagnosis,
        status: appointments.status,
        createdAt: appointments.createdAt,
        employeeId: employees.id,
        employeeName: employees.firstName,
        employeeLastName: employees.lastName,
        employeeCode: employees.employeeCode,
        department: employees.department,
        doctorId: doctors.id,
        doctorName: doctors.name,
      })
      .from(appointments)
      .leftJoin(employees, eq(appointments.employeeId, employees.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(appointments.appointmentDate), asc(appointments.startTime));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

async function hasConflict(
  doctorId: number,
  appointmentDate: string,
  startTime: string,
  endTime: string,
  excludeId?: number
) {
  const conditions = [
    eq(appointments.doctorId, doctorId),
    eq(appointments.appointmentDate, appointmentDate),
    ne(appointments.status, "cancelled"),
    lt(appointments.startTime, endTime),
    gt(appointments.endTime, startTime),
  ];
  if (excludeId) conditions.push(ne(appointments.id, excludeId));

  const rows = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(and(...conditions));
  return rows.length > 0;
}

// POST /api/appointments  (book a new consultation)
router.post("/", async (req, res) => {
  try {
    const { employeeId, doctorId, appointmentDate, startTime, endTime } =
      req.body;

    if (!employeeId || !appointmentDate || !startTime || !endTime) {
      return res.status(400).json({
        error:
          "employeeId, appointmentDate, startTime and endTime are required",
      });
    }

    if (doctorId) {
      const conflict = await hasConflict(
        doctorId,
        appointmentDate,
        startTime,
        endTime
      );
      if (conflict) {
        return res.status(409).json({
          error: "This doctor already has an appointment in that time slot",
        });
      }
    }

    const [row] = await db.insert(appointments).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// PUT /api/appointments/:id  (reschedule, update status, add notes/diagnosis)
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { doctorId, appointmentDate, startTime, endTime } = req.body;

    if (doctorId && appointmentDate && startTime && endTime) {
      const conflict = await hasConflict(
        doctorId,
        appointmentDate,
        startTime,
        endTime,
        id
      );
      if (conflict) {
        return res.status(409).json({
          error: "This doctor already has an appointment in that time slot",
        });
      }
    }

    const [row] = await db
      .update(appointments)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    if (!row) return res.status(404).json({ error: "Appointment not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// DELETE /api/appointments/:id (cancel)
router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .update(appointments)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(appointments.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Appointment not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

export default router;
