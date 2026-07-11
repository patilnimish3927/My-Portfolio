import { Router } from "express";
import { db } from "@workspace/db";
import { visitorsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

// GET /visitors
router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(visitorsTable).limit(1);
    if (rows.length === 0) {
      await db.insert(visitorsTable).values({ count: 0 });
      res.json({ count: 0 });
      return;
    }
    res.json({ count: rows[0]!.count });
  } catch (err) {
    req.log.error({ err }, "Failed to get visitor count");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /visitors — record a new visit
router.post("/", async (req, res) => {
  try {
    const rows = await db.select().from(visitorsTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(visitorsTable).values({ count: 1 }).returning();
      res.json({ count: inserted[0]!.count });
      return;
    }
    const updated = await db
      .update(visitorsTable)
      .set({ count: sql`${visitorsTable.count} + 1` })
      .where(eq(visitorsTable.id, rows[0]!.id))
      .returning();
    res.json({ count: updated[0]!.count });
  } catch (err) {
    req.log.error({ err }, "Failed to record visit");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
