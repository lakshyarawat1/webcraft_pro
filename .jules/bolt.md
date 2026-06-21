## 2024-06-18 - [Limit Notification History Fetches]
**Learning:** Found a query (`getNotificationAndUser`) pulling full chronological histories without any limit, causing an N+1 payload/memory issue that grows over time.
**Action:** Always apply limits (`take: 50`) to time-series data or logs to avoid unbounded payload size.
## 2023-11-06 - [React Performance Pattern: Derived state instead of side-effect in useMemo]
**Learning:** Found an anti-pattern in `PipelineValue.tsx` where a `useState` setter (`setPipelineClosedValue`) was called inside a `useMemo` block. This triggers side effects during the render phase, causing unnecessary extra renders.
**Action:** When computing multiple values that depend on the same logic (like summing up a total and grabbing the final value), return an object with all derived values directly from the `useMemo` instead of calculating one and modifying state for the other. This ensures pure rendering and improves performance by preventing multiple render cycles.
