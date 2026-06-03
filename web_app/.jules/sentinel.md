## 2026-06-03 - [Missing Authorization in Next.js Server Actions]
**Vulnerability:** Found `updateAgencyDetails` exposed as a Server Action without any user authentication or authorization checks. It could be called by anyone with an `agencyId` to maliciously overwrite agency details in the database (Insecure Direct Object Reference).
**Learning:** Next.js Server Actions are public API endpoints and implicitly lack authentication context. Assuming that UI checks are sufficient leaves the underlying server function completely exposed.
**Prevention:** Every Next.js Server Action that modifies or fetches sensitive data MUST explicitly fetch the `currentUser()` and verify their Prisma `Role` relative to the object being acted upon.
