import { Router } from "express";
import { eq, ilike, or, and } from "drizzle-orm";
import { db, schema } from "../db";

const router = Router();
const { employees } = schema;

// GET /api/employees?search=&department=&active=
router.get("/", async (req, res) => {
  try {
    const { search, department, active } = req.query as Record<
      string,
      string | undefined
    >;

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(employees.firstName, `%${search}%`),
          ilike(employees.lastName, `%${search}%`),
          ilike(employees.employeeCode, `%${search}%`),
          ilike(employees.email, `%${search}%`)
        )
      );
    }
    if (department) {
      conditions.push(eq(employees.department, department));
    }
    if (active !== undefined) {
      conditions.push(eq(employees.active, active === "true" ? 1 : 0));
    }

    const rows = await db
      .select()
      .from(employees)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(employees.lastName);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, Number(req.params.id)));
    if (!row) return res.status(404).json({ error: "Employee not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// POST /api/employees
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.employeeCode || !body.firstName || !body.lastName) {
      return res
        .status(400)
        .json({ error: "employeeCode, firstName and lastName are required" });
    }
    const [row] = await db.insert(employees).values(body).returning();
    res.status(201).json(row);
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Employee code already exists" });
    }
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res) => {
  try {
    const [row] = await db
      .update(employees)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(employees.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Employee not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// DELETE /api/employees/:id  (soft delete -> active = 0)
router.delete("/:id", async (req, res) => {
  try {
    const [row] = await db
      .update(employees)
      .set({ active: 0, updatedAt: new Date() })
      .where(eq(employees.id, Number(req.params.id)))
      .returning();
    if (!row) return res.status(404).json({ error: "Employee not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to deactivate employee" });
  }
});

export default router;