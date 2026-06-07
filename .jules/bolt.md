## 2024-05-31 - [Prisma Performance: Count vs Length]
**Learning:** Using `findMany().length` to determine the count of records in Prisma is a significant performance bottleneck because it fetches all entire records from the database into memory just to return an integer length.
**Action:** Always use Prisma's `count()` method when only the number of records is needed, avoiding large memory footprints and potential N+1 issues.
