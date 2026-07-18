## 2024-05-14 - Prisma Count vs findMany Length
**Learning:** Found another instance where `findMany({ include: { relations: true } }).length` was used just to get a count (in `CreateFunnelPage.tsx` for duplicating funnel pages). This causes Prisma to fetch the full relational graph into application memory, creating a significant bottleneck.
**Action:** Always replace `.length` checks on `findMany` results with a dedicated `db.model.count()` query when the full dataset is not actually needed.
## 2024-05-15 - Unbounded FindMany Searches
**Learning:** Broad search queries (like autocomplete using `contains`) can result in massive payloads if no limit is set on the returned records.
**Action:** Always add `take: <limit>` to Prisma queries that fetch data for UI autocomplete dropdowns.

## 2024-05-16 - Prisma Include Fetching Unused Heavy Columns
**Learning:** Using `include: { Relation: true }` in Prisma queries blindly fetches all columns of the relation. In tables with heavy text or JSON columns (like `FunnelPages` which has a `content` column storing full page JSON), this results in massively oversized payloads being loaded into application memory just to calculate a simple sum or display small fields like `name` and `visits`.
**Action:** Always use a nested `select` within `include` blocks to only fetch the explicitly required fields from the relation when dealing with tables that have heavy columns.

## 2024-06-20 - Unbounded History Feeds
**Learning:** Fetching historical logs or feeds (like notifications) using `findMany` without bounds will cause performance to degrade over time as the database accumulates records, leading to unbounded payload growth and database execution delays.
**Action:** Always apply a reasonable limit (e.g., `take: 50`) when querying chronological feeds or history logs using Prisma `findMany`.
## 2024-06-15 - Prisma Memory Bloat on Includes
**Learning:** In Prisma queries, using a blanket `include` (e.g., `include: { FunnelPages: true }`) fetches every column of the related model. This creates a severe memory and performance bottleneck if the related table contains heavy fields (like a large `content` JSON string for funnel pages) that aren't actually needed for the component (e.g. only needing `visits` for a chart tooltip).
**Action:** Next time I see an `include` in a Prisma query that pulls in a model with potentially large payload columns, I should check if the UI actually uses those columns. If not, I should optimize it by replacing `include: { Relation: true }` with a nested `select` inside the include: `include: { Relation: { select: { id: true, name: true, neededField: true } } }`.
## 2024-06-18 - [Limit Notification History Fetches]
**Learning:** Found a query (`getNotificationAndUser`) pulling full chronological histories without any limit, causing an N+1 payload/memory issue that grows over time.
**Action:** Always apply limits (`take: 50`) to time-series data or logs to avoid unbounded payload size.
## 2023-11-06 - [React Performance Pattern: Derived state instead of side-effect in useMemo]
**Learning:** Found an anti-pattern in `PipelineValue.tsx` where a `useState` setter (`setPipelineClosedValue`) was called inside a `useMemo` block. This triggers side effects during the render phase, causing unnecessary extra renders.
**Action:** When computing multiple values that depend on the same logic (like summing up a total and grabbing the final value), return an object with all derived values directly from the `useMemo` instead of calculating one and modifying state for the other. This ensures pure rendering and improves performance by preventing multiple render cycles.
## 2026-06-22 - [React Render Anti-pattern]
**Learning:** Calling a state setter inside a `useMemo` block causes side effects during the render phase, leading to immediate unnecessary re-renders in Next.js/React applications.
**Action:** Always compute derived values directly within `useMemo` and return them (e.g. as an object) instead of triggering a state update from within the hook.
## 2024-07-23 - [Optimization: Avoid fetching heavy text content on getFunnels]
**Learning:** Found a performance bottleneck where querying funnels using Prisma's `include: { FunnelPages: true }` loaded heavy JSON/text `content` column data for all pages into memory unnecessarily, leading to huge payload size and massive latency hits.
**Action:** Used nested `select` inside `include` (e.g. `include: { FunnelPages: { select: { id: true, name: true, ... } } }`) to pick only necessary fields instead of implicitly fetching everything when `content` isn't needed. Next time, always check if all fields in a large relationship are needed, specifically large string fields.
## 2024-05-24 - [O(N*M) Rendering Anti-Patterns in Sidebar]
**Learning:** Found an instance in `web_app/src/components/sidebar/MenuOptions.tsx` where an array `.find()` was nested inside a `.map()` during render, and another in `web_app/src/components/sidebar/index.tsx` where `.find()` was nested inside `.filter()`. These create O(N*M) time complexity during critical render paths. The `MenuOptions` loop actually contained a bug where the callback was missing a `return` statement, causing silent lookup failures, which the refactor inherently fixed.
**Action:** When working with nested collections in render loops (like sidebar options or nested arrays), prioritize extracting the inner lookup into an O(1) Map or Set outside the component (or memoized) to avoid compounding render times.
## 2024-07-18 - [Optimize Intl.NumberFormat Instantiation]
**Learning:** Instantiating `Intl` objects (such as `Intl.NumberFormat`) is computationally expensive in JS engines. Avoid instantiating them inside loops or React render functions.
**Action:** Always look for `Intl` instantiations inside loops or render functions. Declare them outside the component or function scope to reuse a single instance.
