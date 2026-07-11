import { Router } from "express";
import { db } from "@workspace/db";
import {
  profileTable,
  skillsTable,
  projectsTable,
  experienceTable,
  educationTable,
  achievementsTable,
  certificatesTable,
  contactTable,
  portfolioSettingsTable,
  insertProfileSchema,
  insertSkillSchema,
  insertProjectSchema,
  insertExperienceSchema,
  insertEducationSchema,
  insertAchievementSchema,
  insertCertificateSchema,
  insertContactSchema,
  insertPortfolioSettingsSchema,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin, setAdminSession, clearAdminSession } from "../middleware/auth";
import { ADMIN_CONFIG } from "../config/admin";

const router = Router();

// ─── Auth ────────────────────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body as { username: string; password: string };
    if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
      setAdminSession(res);
      res.json({ authenticated: true, username });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  clearAdminSession(res);
  res.json({ success: true });
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ authenticated: true, username: ADMIN_CONFIG.username });
});

// ─── Profile ─────────────────────────────────────────────────────────────────

router.put("/profile", requireAdmin, async (req, res) => {
  try {
    const parsed = insertProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data" });
      return;
    }
    const rows = await db.select().from(profileTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(profileTable).values(parsed.data).returning();
      res.json(inserted[0]);
    } else {
      const updated = await db.update(profileTable).set(parsed.data).where(eq(profileTable.id, rows[0]!.id)).returning();
      res.json(updated[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Skills ──────────────────────────────────────────────────────────────────

router.post("/skills", requireAdmin, async (req, res) => {
  try {
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const inserted = await db.insert(skillsTable).values(parsed.data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/skills/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const updated = await db.update(skillsTable).set(parsed.data).where(eq(skillsTable.id, id)).returning();
    if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/skills/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    await db.delete(skillsTable).where(eq(skillsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete skill");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Projects ────────────────────────────────────────────────────────────────

router.post("/projects", requireAdmin, async (req, res) => {
  try {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const inserted = await db.insert(projectsTable).values(parsed.data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const updated = await db.update(projectsTable).set(parsed.data).where(eq(projectsTable.id, id)).returning();
    if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update project");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/projects/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete project");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Experience ──────────────────────────────────────────────────────────────

router.post("/experience", requireAdmin, async (req, res) => {
  try {
    const parsed = insertExperienceSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const inserted = await db.insert(experienceTable).values(parsed.data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create experience");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/experience/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const parsed = insertExperienceSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const updated = await db.update(experienceTable).set(parsed.data).where(eq(experienceTable.id, id)).returning();
    if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update experience");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/experience/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    await db.delete(experienceTable).where(eq(experienceTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete experience");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Education ───────────────────────────────────────────────────────────────

router.post("/education", requireAdmin, async (req, res) => {
  try {
    const parsed = insertEducationSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const inserted = await db.insert(educationTable).values(parsed.data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create education");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/education/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const parsed = insertEducationSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const updated = await db.update(educationTable).set(parsed.data).where(eq(educationTable.id, id)).returning();
    if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update education");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/education/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    await db.delete(educationTable).where(eq(educationTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete education");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Achievements ─────────────────────────────────────────────────────────────

router.post("/achievements", requireAdmin, async (req, res) => {
  try {
    const parsed = insertAchievementSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const inserted = await db.insert(achievementsTable).values(parsed.data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create achievement");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/achievements/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const parsed = insertAchievementSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const updated = await db.update(achievementsTable).set(parsed.data).where(eq(achievementsTable.id, id)).returning();
    if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update achievement");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/achievements/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    await db.delete(achievementsTable).where(eq(achievementsTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete achievement");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Certificates ─────────────────────────────────────────────────────────────

router.post("/certificates", requireAdmin, async (req, res) => {
  try {
    const parsed = insertCertificateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const inserted = await db.insert(certificatesTable).values(parsed.data).returning();
    res.status(201).json(inserted[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to create certificate");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/certificates/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const parsed = insertCertificateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const updated = await db.update(certificatesTable).set(parsed.data).where(eq(certificatesTable.id, id)).returning();
    if (updated.length === 0) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to update certificate");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/certificates/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    await db.delete(certificatesTable).where(eq(certificatesTable.id, id));
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete certificate");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Contact ──────────────────────────────────────────────────────────────────

router.put("/contact", requireAdmin, async (req, res) => {
  try {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const rows = await db.select().from(contactTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(contactTable).values(parsed.data).returning();
      res.json(inserted[0]);
    } else {
      const updated = await db.update(contactTable).set(parsed.data).where(eq(contactTable.id, rows[0]!.id)).returning();
      res.json(updated[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update contact");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Settings ─────────────────────────────────────────────────────────────────

router.put("/settings", requireAdmin, async (req, res) => {
  try {
    const parsed = insertPortfolioSettingsSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }
    const rows = await db.select().from(portfolioSettingsTable).limit(1);
    if (rows.length === 0) {
      const inserted = await db.insert(portfolioSettingsTable).values(parsed.data).returning();
      res.json(inserted[0]);
    } else {
      const updated = await db.update(portfolioSettingsTable).set(parsed.data).where(eq(portfolioSettingsTable.id, rows[0]!.id)).returning();
      res.json(updated[0]);
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
