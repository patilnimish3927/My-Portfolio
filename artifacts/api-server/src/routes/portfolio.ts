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
} from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /portfolio/profile
router.get("/profile", async (req, res) => {
  try {
    const rows = await db.select().from(profileTable).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/skills
router.get("/skills", async (req, res) => {
  try {
    const rows = await db.select().from(skillsTable).orderBy(skillsTable.sortOrder);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list skills");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/projects
router.get("/projects", async (req, res) => {
  try {
    const rows = await db.select().from(projectsTable).orderBy(projectsTable.sortOrder);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list projects");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/projects/:id
router.get("/projects/:id", async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get project");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/experience
router.get("/experience", async (req, res) => {
  try {
    const rows = await db.select().from(experienceTable).orderBy(experienceTable.sortOrder);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list experience");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/education
router.get("/education", async (req, res) => {
  try {
    const rows = await db.select().from(educationTable).orderBy(educationTable.sortOrder);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list education");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/achievements
router.get("/achievements", async (req, res) => {
  try {
    const rows = await db.select().from(achievementsTable).orderBy(achievementsTable.sortOrder);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list achievements");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/certificates
router.get("/certificates", async (req, res) => {
  try {
    const rows = await db.select().from(certificatesTable).orderBy(certificatesTable.sortOrder);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list certificates");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/contact
router.get("/contact", async (req, res) => {
  try {
    const rows = await db.select().from(contactTable).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Contact not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get contact");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /portfolio/settings
router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(portfolioSettingsTable).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Settings not found" });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
