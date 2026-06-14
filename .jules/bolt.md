## 2024-05-14 - Prisma Count vs findMany Length
**Learning:** Found another instance where `findMany({ include: { relations: true } }).length` was used just to get a count (in `CreateFunnelPage.tsx` for duplicating funnel pages). This causes Prisma to fetch the full relational graph into application memory, creating a significant bottleneck.
**Action:** Always replace `.length` checks on `findMany` results with a dedicated `db.model.count()` query when the full dataset is not actually needed.
