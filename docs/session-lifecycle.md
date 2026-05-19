# Session Lifecycle Strategy

## Active vs expired sessions

| State | Meaning |
|-------|---------|
| `ACTIVE` | Current cohort; `endsAt >= now` |
| `COMPLETED` | Past `endsAt` or manually ended |
| `DRAFT` / `SCHEDULED` | Not yet live |

- Only **one** `ACTIVE` session globally.
- `SessionExpiryService` runs every 60s and flips `ACTIVE` → `COMPLETED` when `endsAt < now`.
- `getActiveSessionOrThrow()` expires sessions first, then loads the active session.

## User access after expiry

| Action | Expired session | Active session |
|--------|-----------------|----------------|
| Watch video / attempt quiz | Blocked (no active session) | Allowed if enrolled + paid |
| View scores / history | `GET /learning/history/:sessionId` | Allowed |
| New enrollment | N/A | `POST /enroll` on new active session |

Historical rows remain in `scores`, `daily_video_watches`, `daily_quiz_attempts`.

## Re-enrollment without data loss

1. Session A expires → enrollments for A stay in DB.
2. Superadmin creates Session B → user enrolls again (new `Enrollment` row).
3. User history for Session A: `GET /learning/history/:sessionAId`.

Unique constraint `(userId, sessionId)` allows one enrollment per session, not one per user ever.

## No active admin scenario

When no session is `ACTIVE` and unexpired:

- `POST /enroll`, `/users/complete-profile`, learning routes → **404**  
  `"No active admin session found..."`
- `GET /sessions/active` → **404**
- Users may still `GET /enroll/history` and `GET /learning/scores`.

## 30-day admin assignment

- On `POST /sessions`, `endsAt = startsAt + 30 days` (configurable).
- Admin cannot be assigned to two concurrent active sessions.
