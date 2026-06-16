## 2024-05-14 - Prisma Count vs findMany Length
**Learning:** Found another instance where `findMany({ include: { relations: true } }).length` was used just to get a count (in `CreateFunnelPage.tsx` for duplicating funnel pages). This causes Prisma to fetch the full relational graph into application memory, creating a significant bottleneck.
**Action:** Always replace `.length` checks on `findMany` results with a dedicated `db.model.count()` query when the full dataset is not actually needed.
## 2024-05-15 - Unbounded FindMany Searches
**Learning:** Broad search queries (like autocomplete using `contains`) can result in massive payloads if no limit is set on the returned records.
**Action:** Always add `take: <limit>` to Prisma queries that fetch data for UI autocomplete dropdowns.
