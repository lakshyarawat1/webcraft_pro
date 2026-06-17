## 2024-05-14 - Prisma Count vs findMany Length
**Learning:** Found another instance where `findMany({ include: { relations: true } }).length` was used just to get a count (in `CreateFunnelPage.tsx` for duplicating funnel pages). This causes Prisma to fetch the full relational graph into application memory, creating a significant bottleneck.
**Action:** Always replace `.length` checks on `findMany` results with a dedicated `db.model.count()` query when the full dataset is not actually needed.
## 2024-05-15 - Unbounded FindMany Searches
**Learning:** Broad search queries (like autocomplete using `contains`) can result in massive payloads if no limit is set on the returned records.
**Action:** Always add `take: <limit>` to Prisma queries that fetch data for UI autocomplete dropdowns.

## 2024-05-16 - Prisma Include Fetching Unused Heavy Columns
**Learning:** Using `include: { Relation: true }` in Prisma queries blindly fetches all columns of the relation. In tables with heavy text or JSON columns (like `FunnelPages` which has a `content` column storing full page JSON), this results in massively oversized payloads being loaded into application memory just to calculate a simple sum or display small fields like `name` and `visits`.
**Action:** Always use a nested `select` within `include` blocks to only fetch the explicitly required fields from the relation when dealing with tables that have heavy columns.
