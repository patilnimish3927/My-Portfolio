import type { Request, Response, NextFunction } from "express";

const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_VALUE = "authenticated";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const session = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (session !== ADMIN_SESSION_VALUE) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function setAdminSession(res: Response): void {
  res.cookie(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAdminSession(res: Response): void {
  res.clearCookie(ADMIN_SESSION_COOKIE);
}
