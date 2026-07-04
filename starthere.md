🏥 Wellpoint — Clinic Management System
Complete, production-ready in-house clinic management system for employee health consultations.
What You're Getting
A full-stack application with ~1500 lines of production code across:
✅ PostgreSQL + Drizzle ORM — Type-safe database schema with relations
✅ Express + TypeScript — REST API with appointment conflict detection
✅ React 18 + Tailwind — Modern, responsive UI with healthcare aesthetic
✅ Zero external auth — Ready for internal network deployment
What It Does
Register employees — Store medical profiles, emergency contacts, allergies
Manage doctors — Track clinic staff, specializations, office hours
Book consultations — Schedule appointments with automatic conflict detection
Track visits — Update status (scheduled → checked-in → completed), add notes/diagnosis
Dashboard — Overview of today's schedule and clinic metrics
Quick Start (Pick One)
Option A: Docker (Easiest)
Bash
Option B: Manual PostgreSQL
Bash
See SETUP.md for detailed instructions.
File Structure
Code
Key Features
🗂️ Data Management
Employees — Medical profiles with DOB, blood group, allergies, emergency contacts
Doctors — Clinic staff with specializations and office hours
Appointments — Time-slot based bookings with doctor assignment
⚙️ Intelligent Booking
✓ Automatic conflict detection (prevents double-booking)
✓ Status workflow: scheduled → checked-in → completed
✓ Capture consultation notes & diagnosis
✓ Soft deletes (preserve audit trail)
🎨 Healthcare Design
Teal/pine green color scheme (trust, calm, health)
Minimal, spacious layout (reduces cognitive load)
Custom SVG clinic mark logo
Responsive mobile-friendly design
📊 Dashboard
Overview of today's appointments
Active employee count
Clinic doctor count
Quick access to all sections
Database Schema (30 seconds)
Sql
API Endpoints (Quick Reference)
Code
See API.md for full documentation with curl examples.
What's Included
✅ Full TypeScript backend with type safety
✅ Drizzle ORM with schema relations
✅ React components with proper state management
✅ Tailwind CSS with custom design tokens
✅ Docker Compose for PostgreSQL
✅ Database seed script with demo data
✅ Comprehensive documentation (README, SETUP, API, FEATURES)
✅ gitignore configured
✅ Error handling and validation
✅ CORS configured
✅ Mobile responsive
What's NOT Included (By Design)
These are intentionally left out for you to add based on your needs:
❌ Authentication (add JWT/session based on your org)
❌ Authorization (add role-based access control)
❌ Email/SMS notifications
❌ File uploads (medical documents, X-rays)
❌ Telemedicine (video calls)
❌ Billing/insurance integration
❌ Multi-language support
The architecture is flexible enough to add these without major refactors.
Next Steps
Read SETUP.md — Choose your setup method (Docker or manual PostgreSQL)
Run the app — Get it running locally
Explore the UI — Book an appointment, add an employee
Test the API — Use curl/Postman from API.md
Customize — Change colors in tailwind.config.js, add your clinic name/logo
Add features — Extend schema in schema.ts, add routes, add React components
Tech Stack Summary
Layer
Stack
Why
Database
PostgreSQL + Drizzle
Type-safe, lightweight, ACID transactions
Backend
Express + TypeScript
Fast, minimal, production-ready
Frontend
React + Vite
Modern, responsive, fast dev experience
Styling
Tailwind CSS
Utility-first, easy customization
Hosting
Docker ready
Deploy anywhere (AWS, DigitalOcean, Heroku)
Design Philosophy
Wellpoint is built for simplicity with integrity:
Clean, focused UI — Clinic staff are busy, no unnecessary clicks
Type-safe codebase — Catch errors at compile time, not production
Healthcare-specific design — Not a generic appointment app
Privacy-first — No analytics, no tracking, just patient data
Auditable — Soft deletes preserve history for compliance
Questions?
How do I...? → Check README.md
How do I set up...? → Check SETUP.md
What's the API for...? → Check API.md
Why did you...? → Check FEATURES.md
Support for Extending
The codebase is simple and modular:
Add a new doctor field? Edit schema.ts, run migration, update React form
Add a new report? Create a new React page, fetch from API
Add email reminders? Add a cron job in server/src, call SMTP
Add authentication? Add middleware to Express routes
See FEATURES.md for potential enhancements and architecture decisions.
Ready to go? → Start with SETUP.md
🏥 Wellpoint — Simple, clean, health-focused.