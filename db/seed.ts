import "dotenv/config";
import { db, schema } from "./index";

async function seed() {
  console.log("Seeding database...");

  const [doc1] = await db
    .insert(schema.doctors)
    .values({
      name: "Dr. Amara Chen",
      specialization: "General Practitioner",
      email: "amara.chen@clinic.internal",
      phone: "555-0101",
      roomNumber: "G-01",
      workStart: "09:00",
      workEnd: "17:00",
    })
    .returning();

  const [doc2] = await db
    .insert(schema.doctors)
    .values({
      name: "Dr. Miguel Ortiz",
      specialization: "Occupational Medicine",
      email: "miguel.ortiz@clinic.internal",
      phone: "555-0102",
      roomNumber: "G-02",
      workStart: "08:00",
      workEnd: "16:00",
    })
    .returning();

  const employeeRows = await db
    .insert(schema.employees)
    .values([
      {
        employeeCode: "EMP-1001",
        firstName: "Jordan",
        lastName: "Blake",
        email: "jordan.blake@company.com",
        phone: "555-2001",
        department: "Warehouse",
        position: "Logistics Coordinator",
        dateOfBirth: "1990-04-12",
        gender: "male",
        bloodGroup: "O+",
      },
      {
        employeeCode: "EMP-1002",
        firstName: "Priya",
        lastName: "Nair",
        email: "priya.nair@company.com",
        phone: "555-2002",
        department: "Engineering",
        position: "Site Reliability Engineer",
        dateOfBirth: "1993-09-02",
        gender: "female",
        bloodGroup: "A+",
      },
      {
        employeeCode: "EMP-1003",
        firstName: "Sam",
        lastName: "Okafor",
        email: "sam.okafor@company.com",
        phone: "555-2003",
        department: "Manufacturing",
        position: "Line Supervisor",
        dateOfBirth: "1988-01-27",
        gender: "male",
        bloodGroup: "B-",
      },
    ])
    .returning();

  const today = new Date().toISOString().slice(0, 10);

  await db.insert(schema.appointments).values([
    {
      employeeId: employeeRows[0].id,
      doctorId: doc1.id,
      appointmentDate: today,
      startTime: "10:00",
      endTime: "10:20",
      reason: "Annual health checkup",
      status: "scheduled",
    },
    {
      employeeId: employeeRows[1].id,
      doctorId: doc2.id,
      appointmentDate: today,
      startTime: "11:00",
      endTime: "11:20",
      reason: "Back pain follow-up",
      status: "scheduled",
    },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});