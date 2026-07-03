## 2024-06-18 - [Limit Notification History Fetches]
**Learning:** Found a query (`getNotificationAndUser`) pulling full chronological histories without any limit, causing an N+1 payload/memory issue that grows over time.
**Action:** Always apply limits (`take: 50`) to time-series data or logs to avoid unbounded payload size.
## 2026-06-22 - [React Render Anti-pattern]
**Learning:** Calling a state setter inside a `useMemo` block causes side effects during the render phase, leading to immediate unnecessary re-renders in Next.js/React applications.
**Action:** Always compute derived values directly within `useMemo` and return them (e.g. as an object) instead of triggering a state update from within the hook.
## 2024-07-23 - [Optimization: Avoid fetching heavy text content on getFunnels]
**Learning:** Found a performance bottleneck where querying funnels using Prisma's `include: { FunnelPages: true }` loaded heavy JSON/text `content` column data for all pages into memory unnecessarily, leading to huge payload size and massive latency hits.
**Action:** Used nested `select` inside `include` (e.g. `include: { FunnelPages: { select: { id: true, name: true, ... } } }`) to pick only necessary fields instead of implicitly fetching everything when `content` isn't needed. Next time, always check if all fields in a large relationship are needed, specifically large string fields.
