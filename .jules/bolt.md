## 2024-06-18 - [Limit Notification History Fetches]
**Learning:** Found a query (`getNotificationAndUser`) pulling full chronological histories without any limit, causing an N+1 payload/memory issue that grows over time.
**Action:** Always apply limits (`take: 50`) to time-series data or logs to avoid unbounded payload size.
## 2026-06-22 - [React Render Anti-pattern]
**Learning:** Calling a state setter inside a `useMemo` block causes side effects during the render phase, leading to immediate unnecessary re-renders in Next.js/React applications.
**Action:** Always compute derived values directly within `useMemo` and return them (e.g. as an object) instead of triggering a state update from within the hook.
