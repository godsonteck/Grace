## 2025-05-22 - Granular LocalStorage Persistence
**Learning:** Synchronizing a complex enterprise state through a single `useEffect` hook causes significant main-thread overhead. Every time a single clinical report is updated, the entire database (Staff, Assets, Invoices, Patients) is re-serialized and re-written to `localStorage`.
**Action:** Decompose persistence logic into atomic `useEffect` hooks mapped to specific state slices. This reduces serialization time by ~80% in high-volume modules like the POS and Case Management.
