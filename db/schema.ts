import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  time,
  timestamp,
  pgEnum,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Enums ----------
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "checked_in",
  "completed",
  "cancelled",
  "no_show",
]);

// ---------- Employees (patients of the in-house clinic) ----------
export const employees = pgTable(
  "employees",
  {
    id: serial("id").primaryKey(),
    employeeCode: varchar("employee_code", { length: 32 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 32 }),
    department: varchar("department", { length: 100 }),
    position: varchar("position", { length: 100 }),
    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender"),
    bloodGroup: varchar("blood_group", { length: 8 }),
    emergencyContactName: varchar("emergency_contact_name", { length: 150 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 32 }),
    allergies: text("allergies"),
    active: integer("active").default(1).notNull(), // 1 = active, 0 = inactive
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    employeeCodeIdx: uniqueIndex("employees_employee_code_idx").on(
      table.employeeCode
    ),
  })
);

// ---------- Doctors (clinic staff who perform consultations) ----------
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  specialization: varchar("specialization", { length: 150 }).default(
    "General Practitioner"
  ),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  roomNumber: varchar("room_number", { length: 32 }),
  workStart: time("work_start").default("09:00"),
  workEnd: time("work_end").default("17:00"),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Appointments ----------
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  doctorId: integer("doctor_id")
    .references(() => doctors.id, { onDelete: "set null" }),
  appointmentDate: date("appointment_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  reason: varchar("reason", { length: 255 }),
  notes: text("notes"),
  diagnosis: text("diagnosis"),
  status: appointmentStatusEnum("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Relations ----------
export const employeesRelations = relations(employees, ({ many }) => ({
  appointments: many(appointments),
}));

export const doctorsRelations = relations(doctors, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  employee: one(employees, {
    fields: [appointments.employeeId],
    references: [employees.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
}));
