# Database Design

## ER diagram

```mermaid
erDiagram
  User ||--o{ Enrollment : has
  User ||--o{ Score : has
  User ||--o{ DailyVideoWatch : watches
  User ||--o{ DailyQuizAttempt : attempts
  User ||--o| Organization : member
  User ||--o{ Session : administers

  Organization ||--o{ Sponsorship : provides
  Organization ||--o{ User : members

  Session ||--o{ Enrollment : contains
  Session ||--o{ Video : has
  Session ||--o{ Quiz : has
  Session ||--o{ Sponsorship : receives

  Enrollment ||--o| Sponsorship : funded_by
  Quiz ||--o{ Score : scored
  Video ||--o{ DailyVideoWatch : tracked

  User {
    uuid id PK
    string email UK
    enum role
    bool profile_completed
    uuid organization_id FK
  }

  Session {
    uuid id PK
    uuid admin_id FK
    enum status
    datetime starts_at
    datetime ends_at
  }

  Enrollment {
    uuid id PK
    uuid user_id FK
    uuid session_id FK
    enum payment_type
    enum payment_status
    decimal amount
  }

  Sponsorship {
    uuid id PK
    uuid organization_id FK
    uuid user_id FK
    uuid session_id FK
    uuid enrollment_id FK UK
  }
```

## How sessions are modeled

- Each **Session** has `adminId` (fixed admin for the cohort), `startsAt`, `endsAt` (default 30 days), and `status`.
- Only one session may be `ACTIVE` at a time system-wide.
- A background job sets `ACTIVE` → `COMPLETED` when `endsAt` passes.

## Enrollment per session

- **Enrollment** links `userId` + `sessionId` with `@@unique([userId, sessionId])`.
- Users enroll separately for each session (re-enrollment after expiry creates a new row).
- `paymentType`: `SELF` | `SPONSORED`; `paymentStatus`: `PAID` required for learning features.

## Historical data preservation

- **Scores**, **DailyVideoWatch**, and **DailyQuizAttempt** retain `sessionId`.
- Expired sessions remain in DB with `COMPLETED` status; users read history via `GET /learning/history/:sessionId`.
- New content access is blocked when session is expired or not `ACTIVE`.
