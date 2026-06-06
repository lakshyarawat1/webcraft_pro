## 2024-06-05 - Missing IDOR Prevention in deleteUser Action
**Vulnerability:** The `deleteUser` Server Action in `web_app/src/lib/queries.ts` lacked both authentication and authorization checks. It directly deleted a user based on the provided `userId`.
**Learning:** Next.js Server Actions function as publicly exposed API endpoints. Because this action took an ID as a parameter without verifying permissions, it allowed for Insecure Direct Object Reference (IDOR). Any caller could potentially exploit this to delete arbitrary users by ID.
**Prevention:** Always verify `currentUser()` for authentication and cross-reference the user's role (e.g., `AGENCY_OWNER` or `AGENCY_ADMIN`) and agency ID against the target object's agency ID before performing sensitive operations in Server Actions.
## 2024-06-05 - Missing IDOR Prevention in deleteUser Action
**Vulnerability:** The `deleteUser` Server Action in `web_app/src/lib/queries.ts` lacked both authentication and authorization checks. It directly deleted a user based on the provided `userId`.
**Learning:** Next.js Server Actions function as publicly exposed API endpoints. Because this action took an ID as a parameter without verifying permissions, it allowed for Insecure Direct Object Reference (IDOR). Any caller could potentially exploit this to delete arbitrary users by ID.
**Prevention:** Always verify `currentUser()` for authentication and cross-reference the user's role (e.g., `AGENCY_OWNER` or `AGENCY_ADMIN`) and agency ID against the target object's agency ID before performing sensitive operations in Server Actions.

## 2024-06-06 - Missing IDOR Prevention in changeUserPermissions Action
**Vulnerability:** The `changeUserPermissions` Server Action in `web_app/src/lib/queries.ts` lacked both authentication and authorization checks. It directly upserted permission records based on the provided parameters.
**Learning:** Next.js Server Actions function as publicly exposed API endpoints. Without verifying permissions, it allowed for Insecure Direct Object Reference (IDOR) / Privilege Escalation. Any caller could potentially exploit this to give themselves or others unauthorized access to subaccounts.
**Prevention:** Always verify `currentUser()` for authentication and cross-reference the user's agency ID against the target object's agency ID before performing sensitive operations in Server Actions.
