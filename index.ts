import "dotenv/config";
import express from "express";
import cors from "cors";
import employeesRouter from "./routes/employees";
import doctorsRouter from "./routes/doctors";
import appointmentsRouter from "./routes/appointments";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/employees", employeesRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/appointments", appointmentsRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Clinic API listening on http://localhost:${PORT}`);
});