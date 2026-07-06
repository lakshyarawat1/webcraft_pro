## 2024-06-18 - [Limit Notification History Fetches]
**Learning:** Found a query (`getNotificationAndUser`) pulling full chronological histories without any limit, causing an N+1 payload/memory issue that grows over time.
**Action:** Always apply limits (`take: 50`) to time-series data or logs to avoid unbounded payload size.
## 2026-06-22 - [React Render Anti-pattern]
**Learning:** Calling a state setter inside a `useMemo` block causes side effects during the render phase, leading to immediate unnecessary re-renders in Next.js/React applications.
**Action:** Always compute derived values directly within `useMemo` and return them (e.g. as an object) instead of triggering a state update from within the hook.
## 2024-05-24 - [O(N*M) Rendering Anti-Patterns in Sidebar]
**Learning:** Found an instance in `web_app/src/components/sidebar/MenuOptions.tsx` where an array `.find()` was nested inside a `.map()` during render, and another in `web_app/src/components/sidebar/index.tsx` where `.find()` was nested inside `.filter()`. These create O(N*M) time complexity during critical render paths. The `MenuOptions` loop actually contained a bug where the callback was missing a `return` statement, causing silent lookup failures, which the refactor inherently fixed.
**Action:** When working with nested collections in render loops (like sidebar options or nested arrays), prioritize extracting the inner lookup into an O(1) Map or Set outside the component (or memoized) to avoid compounding render times.
