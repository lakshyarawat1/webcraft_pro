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

## 2024-06-07 - Missing IDOR Prevention in deletePipeline Action
**Vulnerability:** The `deletePipeline` Server Action in `web_app/src/lib/queries.ts` lacked both authentication and authorization checks. It directly deleted a pipeline based on the provided `pipelineId`.
**Learning:** Next.js Server Actions function as publicly exposed API endpoints. Without verifying permissions, it allowed for Insecure Direct Object Reference (IDOR). Any caller could potentially exploit this to delete arbitrary pipelines by ID.
**Prevention:** Always verify `currentUser()` for authentication and cross-reference the user's agency ID against the target object's agency ID before performing sensitive operations in Server Actions. Ensure that users with roles like `SUBACCOUNT_USER` have explicit permissions for the subaccount.

## 2026-06-09 - Missing IDOR Prevention in upsertSubAccount Action
**Vulnerability:** The `upsertSubAccount` Server Action in `web_app/src/lib/queries.ts` lacked authentication and authorization checks. It could allow creating or modifying arbitrary subaccounts for other agencies.
**Learning:** Next.js Server Actions act as exposed API endpoints. Without verifying permissions via `currentUser()` and checking roles, it allowed for Insecure Direct Object Reference (IDOR).
**Prevention:** Always verify `currentUser()` for authentication and ensure the user has appropriate roles (e.g., `AGENCY_OWNER` or `AGENCY_ADMIN`) and their `agencyId` matches the target object's `agencyId` before performing modifications in Server Actions.

## 2026-06-10 - Missing IDOR Prevention in deleteLane Action
**Vulnerability:** The `deleteLane` Server Action in `web_app/src/lib/queries.ts` lacked authentication and authorization checks. It could allow deleting arbitrary lanes for other agencies' pipelines.
**Learning:** Next.js Server Actions act as exposed API endpoints. Without verifying permissions via `currentUser()` and checking roles or agency permissions against the nested lane -> pipeline -> subaccount -> agency relation, it allowed for Insecure Direct Object Reference (IDOR).
**Prevention:** Always verify `currentUser()` for authentication and ensure the user has appropriate roles and permissions corresponding to the nested relations of the target object before performing destructive modifications in Server Actions.
## 2024-10-27 - [High] Fix missing authentication/authorization in upsertPipeline
**Vulnerability:** Insecure Direct Object Reference (IDOR) via `upsertPipeline` allowing an attacker to modify pipelines for arbitrary subaccounts because there were no authentication or authorization checks.
**Learning:** Prisma `upsert` Server Actions exposed to the client must explicitly enforce authentication (`currentUser()`), verify the existing record ownership against the user's context (e.g., matching agency ID), and respect RBAC policies (e.g., verifying `SUBACCOUNT_USER` permissions via the `Permission` model). The client payload's foreign keys (like `subAccountId`) cannot be trusted for authorization without validation.
**Prevention:** Always implement explicit server-side authentication (`currentUser()`), agency ownership verification, and explicit RBAC checks using the `Permission` table for `upsert` queries. Do not rely solely on input data.
## 2024-10-27 - [High] Fix missing authentication/authorization in upsertPipeline (Update Path)
**Vulnerability:** Insecure Direct Object Reference (IDOR) via `upsertPipeline` allowing an attacker to modify an existing pipeline belonging to another agency by providing its `id` and a `subAccountId` they control, due to missing verification of the existing record's ownership.
**Learning:** For `upsert` Server Actions, it is not enough to verify the foreign keys provided in the payload (like `subAccountId`). If an `id` is provided (indicating an `update` operation), the database MUST be queried to verify that the existing record belongs to the authenticated user's context (e.g., matching agency ID). Otherwise, an attacker can overwrite arbitrary records by passing their IDs.
**Prevention:** Always query the database for the existing record by its ID in an `update` path of an `upsert` operation and verify its ownership before proceeding with the modification.
