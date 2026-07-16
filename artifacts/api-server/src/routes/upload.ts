import { Router } from "express";
import multer from "multer";
import { put, del } from "@vercel/blob";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Store files in memory before uploading to Vercel Blob
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG, WebP, GIF) and PDFs are allowed"));
    }
  },
});

/**
 * POST /api/admin/upload
 * Multipart: field name = "file"
 * Returns: { url: string }
 */
router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const token = process.env["BLOB_READ_WRITE_TOKEN"];
    if (!token) {
      res.status(500).json({ error: "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN." });
      return;
    }

    const ext = req.file.originalname.split(".").pop() ?? "bin";
    const folder = req.file.mimetype === "application/pdf" ? "certificates/pdf" : "certificates/img";
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(filename, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,
      token,
    });

    res.json({ url: blob.url });
  } catch (err) {
    req.log.error({ err }, "Upload failed");
    res.status(500).json({ error: "Upload failed" });
  }
});

/**
 * DELETE /api/admin/upload
 * Body: { url: string }
 * Deletes a blob from Vercel Blob storage.
 */
router.delete("/", requireAdmin, async (req, res) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url) {
      res.status(400).json({ error: "url is required" });
      return;
    }

    const token = process.env["BLOB_READ_WRITE_TOKEN"];
    if (!token) {
      res.status(500).json({ error: "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN." });
      return;
    }

    await del(url, { token });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Delete blob failed");
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
