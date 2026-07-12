import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ─── Profile ────────────────────────────────────────────────────────────────

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  headline: text("headline").notNull().default(""),
  bio: text("bio").notNull().default(""),
  location: text("location").notNull().default(""),
  githubUsername: text("github_username").notNull().default(""),
  profileImageUrl: text("profile_image_url"),
  resumeUrl: text("resume_url"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;

// ─── Skills ─────────────────────────────────────────────────────────────────

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: integer("level").notNull().default(80),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertSkillSchema = createInsertSchema(skillsTable).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;

// ─── Projects ───────────────────────────────────────────────────────────────

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  techStack: text("tech_stack").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  imageUrls: text("image_urls").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

// ─── Experience ─────────────────────────────────────────────────────────────

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  department: text("department"),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  current: boolean("current").notNull().default(false),
  responsibilities: text("responsibilities").array().notNull().default([]),
  achievements: text("achievements").array().notNull().default([]),
  technologies: text("technologies").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;

// ─── Education ──────────────────────────────────────────────────────────────

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  current: boolean("current").notNull().default(false),
  grade: text("grade"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertEducationSchema = createInsertSchema(educationTable).omit({ id: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationTable.$inferSelect;

// ─── Achievements ────────────────────────────────────────────────────────────

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date"),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertAchievementSchema = createInsertSchema(achievementsTable).omit({ id: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievementsTable.$inferSelect;

// ─── Certificates ────────────────────────────────────────────────────────────

export const certificatesTable = pgTable("certificates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date"),
  credentialUrl: text("credential_url"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertCertificateSchema = createInsertSchema(certificatesTable).omit({ id: true });
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificatesTable.$inferSelect;

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactTable = pgTable("contact", {
  id: serial("id").primaryKey(),
  github: text("github").notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  hackerrank: text("hackerrank"),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  showEmail: boolean("show_email").notNull().default(false),
  showPhone: boolean("show_phone").notNull().default(false),
});

export const insertContactSchema = createInsertSchema(contactTable).omit({ id: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactTable.$inferSelect;

// ─── Portfolio Settings ───────────────────────────────────────────────────────

export const portfolioSettingsTable = pgTable("portfolio_settings", {
  id: serial("id").primaryKey(),
  theme: text("theme").notNull().default("dark"),
  style: text("style").notNull().default("industrial"),
  animationsEnabled: boolean("animations_enabled").notNull().default(true),
  cursorEffects: boolean("cursor_effects").notNull().default(true),
  particleEffects: boolean("particle_effects").notNull().default(true),
  soundEnabled: boolean("sound_enabled").notNull().default(false),
  performanceMode: boolean("performance_mode").notNull().default(false),
  hiringEnabled: boolean("hiring_enabled").notNull().default(true),
});

export const insertPortfolioSettingsSchema = createInsertSchema(portfolioSettingsTable).omit({ id: true });
export type InsertPortfolioSettings = z.infer<typeof insertPortfolioSettingsSchema>;
export type PortfolioSettings = typeof portfolioSettingsTable.$inferSelect;

// ─── Visitors ────────────────────────────────────────────────────────────────

export const visitorsTable = pgTable("visitors", {
  id: serial("id").primaryKey(),
  count: integer("count").notNull().default(0),
});
