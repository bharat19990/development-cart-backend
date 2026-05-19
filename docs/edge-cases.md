# Edge Cases and Solutions

| # | Edge case | Solution |
|---|-----------|----------|
| 1 | **Session overlap** | Only one `ACTIVE` session; creating another returns 409 |
| 2 | **Payment conflict (user vs org)** | Block sponsorship if user already `SELF` + `PAID`; sponsor creates `SPONSORED` enrollment |
| 3 | **Late enrollments** | Allowed while session `ACTIVE` and before `endsAt`; after expiry user must wait for new session |
| 4 | **Admin expiry** | Session `COMPLETED` when `endsAt` passes; admin freed for new session assignment |
| 5 | **Duplicate enrollment** | `@@unique([userId, sessionId])` + 409 on second attempt |
| 6 | **Duplicate sponsorship** | `@@unique([organizationId, userId, sessionId])` |
| 7 | **Daily video limit** | `@@unique([userId, sessionId, activityDate])` on `DailyVideoWatch` |
| 8 | **Daily quiz limit** | `@@unique([userId, sessionId, activityDate])` on `DailyQuizAttempt` |
| 9 | **No active admin session** | Middleware returns 404; clear message for clients |
| 10 | **Unpaid enrollment** | `requirePaidEnrollment` blocks video/quiz until `PAID` |
| 11 | **Profile incomplete** | Learning routes require `profileCompleted: true` |
| 12 | **Wrong enrollment amount** | SELF requires `amount: 100` exactly |
| 13 | **Second superadmin** | Only one seeded; public register cannot create `SUPERADMIN` |
| 14 | **Expired session content access** | `getHistoricalData` read-only; write routes need active session |
| 15 | **Admin manages wrong session** | Content APIs verify `session.adminId === req.user.id` |
