# clinic

Wellpoint — Clinic Management System
A modern, full-stack occupational health clinic management system. Company employees can book and manage in-house consultations with clinic doctors.
Tech Stack
Backend: Node.js + Express + TypeScript
Database: PostgreSQL + Drizzle ORM
Frontend: React 18 + Vite + Tailwind CSS
Design: Minimal, healthcare-focused UI with a distinctive visual identity
Features
✓ Employee Management — Register company staff with medical history, emergency contacts, allergies
✓ Doctor Directory — Clinic staff profiles with specializations and schedules
✓ Appointment Booking — Schedule consultations with conflict detection
✓ Consultation Tracking — Notes, diagnosis, and appointment status workflow
✓ Search & Filter — Find employees, doctors, and appointments quickly
✓ Responsive Design — Works on desktop and mobile
Project Structure
Code
Prerequisites
Node.js 18+
PostgreSQL 14+
npm or yarn
Getting Started
1. Set up PostgreSQL
Create a database for the clinic:
Bash
2. Server Setup
Navigate to the server directory:
Bash
Install dependencies:
Bash
Create .env from the template:
Bash
Edit .env with your database credentials:
Env
Generate and run migrations to create tables:
Bash
(Or manually: npm run db:generate then npm run db:migrate)
Seed sample data (optional):
Bash
Start the API server:
Bash
The server runs on http://localhost:4000. Test it:
Bash
3. Client Setup
In a new terminal, navigate to the client directory:
Bash
Install dependencies:
Bash
Start the dev server:
Bash
Open http://localhost:5173 in your browser.
Database Schema
Employees (clinic patients)
id — Primary key
employeeCode — Unique identifier (e.g., EMP-1001)
firstName, lastName — Name
email, phone — Contact info
department, position — Employment details
dateOfBirth, gender, bloodGroup — Medical profile
emergencyContactName, emergencyContactPhone — Emergency contact
allergies — Known allergies/conditions
active — Soft delete flag
Doctors (clinic staff)
id — Primary key
name — Full name
specialization — Medical specialty
email, phone — Contact
roomNumber — Clinic room
workStart, workEnd — Office hours
active — Soft delete flag
Appointments (consultations)
id — Primary key
employeeId — Foreign key to employees
doctorId — Foreign key to doctors (nullable)
appointmentDate — ISO date (YYYY-MM-DD)
startTime, endTime — HH:MM format
reason — Chief complaint/reason
notes — Consultation notes
diagnosis — Medical diagnosis
status — scheduled | checked_in | completed | cancelled | no_show
createdAt, updatedAt — Timestamps
API Endpoints
Employees
Method
Endpoint
Description
GET
/api/employees
List all (supports ?search=, ?department=, ?active=)
GET
/api/employees/:id
Get by ID
POST
/api/employees
Create
PUT
/api/employees/:id
Update
DELETE
/api/employees/:id
Soft delete (deactivate)
Doctors
Method
Endpoint
Description
GET
/api/doctors
List all
POST
/api/doctors
Create
PUT
/api/doctors/:id
Update
DELETE
/api/doctors/:id
Soft delete
Appointments
Method
Endpoint
Description
GET
/api/appointments
List (supports ?date=, ?doctorId=, ?employeeId=, ?status=)
POST
/api/appointments
Book new (auto-detects conflicts)
PUT
/api/appointments/:id
Update status, notes, diagnosis
DELETE
/api/appointments/:id
Cancel (soft delete)
Development Tips
Database Studio (browse/edit data)
Bash
Opens a local UI at http://localhost:3000 to inspect tables.
Rebuild TypeScript
Bash
Output goes to dist/.
Production Build (client)
Bash
Output goes to dist/.
Customization
Colors & Design Tokens
Edit client/tailwind.config.js:
Js
Fonts
Google Fonts are loaded in client/index.html. Pair is Manrope (display) + Inter (body).
API Base URL
By default, the client proxies requests to http://localhost:4000/api in dev mode. To change:
Edit client/vite.config.js:
Js
Deployment
Backend (Express + PostgreSQL)
Build TypeScript:
Bash
Start with:
Bash
Ensure DATABASE_URL and CLIENT_ORIGIN environment variables are set.
Frontend (React + Vite)
Build:
Bash
Deploy dist/ folder to any static host (Vercel, Netlify, S3, etc.).
Update API base URL in code or proxy accordingly.
Troubleshooting
"connect ECONNREFUSED" — Server not running. Start it with npm run dev.
"relation 'employees' does not exist" — Run migrations: npm run db:push.
"Employee code already exists" — Codes must be unique per employee.
"Doctor already has an appointment in that time slot" — Conflict detected. Pick a different time or doctor.
CORS errors — Check CLIENT_ORIGIN in server .env matches where React is running.
License
Internal use for occupational health clinic management.