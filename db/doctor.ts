import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

const router = Router();
const { doctors } = schema;

// GET /api/doctors
router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(doctors).orderBy(doctors.name);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// POST /api/doctors
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "name is required" });
    }
    const [row] = await db.insert(doctors).values(req.body).returning();
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create doctor" });
  }
});

// PUT /api/doctors/:id
router.put("/:id", async (req, res) => {
  try {
    const [row] = await db
      .update(doctors)
      .set(req.body)
      .where(eq(doctors.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Doctor not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update doctor" });
  }
});

// DELETE /api/doctors/:id (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .update(doctors)
      .set({ active: 0 })
      .where(eq(doctors.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Doctor not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to deactivate doctor" });
  }
});

export default router;