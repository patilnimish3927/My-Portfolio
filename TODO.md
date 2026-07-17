# TODO (Portfolio Hardening + Production Readiness)

## Step 1 — Repo audit fixes (no functional changes)
- [x] Remove Replit-only dependency from root `package.json` (and lockfile if needed)
- [x] Confirm build/typecheck still pass

## Step 2 — Env-based admin credentials (no plaintext env secrets)
- [ ] Update `artifacts/api-server/src/config/admin.ts` to read `ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH`
- [ ] Implement bcrypt password verification (no plaintext comparisons)
- [ ] Keep existing routes (`/admin/login`, `/admin/logout`, `/admin/me`) intact
- [ ] Run build + typecheck after each logical sub-step

## Step 3 — Signed, hardened cookies + session validation foundation
- [ ] Replace fixed cookie value auth with signed HTTP-only cookies
- [ ] Add SESSION_SECRET usage and production `secure` flag
- [ ] Add session validation middleware that checks signature + expiry
- [ ] Implement logout invalidation
- [ ] Run build + typecheck

## Step 4 — DB-backed sessions + trusted-device system
- [ ] Extend Drizzle schema without breaking existing frontend fields
- [ ] Add required tables: Trusted Devices, Admin Sessions (normalized)
- [ ] Implement TOTP 2FA challenge + verification endpoints by extending existing auth flow
- [ ] Implement trusted-device cookie token + hashing
- [ ] Admin endpoints: view/rename/remove/revoke trusted devices
- [ ] Run build + typecheck

## Step 5 — Certificates/Uploads hardening (compat-preserving)
- [ ] Ensure certificate delete deletes Vercel Blob objects
- [ ] Extend certificate schema to support required fields while preserving legacy fields used by frontend
- [ ] Strengthen file validation (type + size + consistency)
- [ ] Run build + typecheck

## Step 6 — SEO/Accessibility/Performance verification
- [ ] Verify meta tags / OG / Twitter / structured data
- [ ] Verify ARIA and keyboard support
- [ ] Verify lazy-loading

## Step 7 — Production compliance checks
- [ ] Ensure no Replit dependencies remain
- [ ] Ensure no SQLite or filesystem uploads remain
- [ ] Confirm Vercel deploy compatibility


