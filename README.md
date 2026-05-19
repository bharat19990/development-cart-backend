# Development Cart API

A **session-based learning platform** backend built with **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. It provides JWT authentication, role-based access control (RBAC), learning session management, user enrollment, organization sponsorship, and profile completion tied to an active learning session.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Running the application](#running-the-application)
- [API reference](#api-reference)
- [Authentication & authorization](#authentication--authorization)
- [Business rules](#business-rules)
- [Example workflow](#example-workflow)
- [cURL examples](#curl-examples)
- [Error responses](#error-responses)
- [Testing](#testing)
- [Scripts](#scripts)
- [License](#license)

---

## Features

| Area | Description |
|------|-------------|
| **Authentication** | Register, login, JWT bearer tokens, bcrypt password hashing |
| **RBAC** | Roles: `SUPERADMIN`, `ADMIN`, `USER`, `ORGANIZATION` |
| **Sessions** | Superadmin creates sessions, assigns an admin, only one `ACTIVE` session at a time |
| **Enrollment** | Users enroll in the active session (`SELF` or `SPONSORED` payment type) |
| **Sponsorship** | Organizations sponsor users for the active session, linked to enrollment |
| **Profile** | Users complete profile when an active session exists |
| **Validation** | Request validation via `class-validator` / `class-transformer` |
| **ORM** | Prisma with PostgreSQL (users, sessions, enrollments, organizations, sponsorships, videos, quizzes, scores) |

---

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma 6
- **Auth:** JSON Web Tokens (`jsonwebtoken`), bcrypt
- **Validation:** class-validator, class-transformer, reflect-metadata
- **Testing:** Jest, Supertest
- **Linting:** ESLint, Prettier

---

## Architecture

```
src/
├── app.ts                 # Express app factory
├── server.ts              # HTTP server entry point
├── config/                # Env loading & validation
├── controllers/           # Route handlers
├── services/              # Business logic
├── routes/                # Route definitions + middleware chains
├── middlewares/           # Auth, RBAC, validation, errors
├── validators/            # DTO classes (request validation)
├── entities/              # Response shapes
├── enums/                 # Re-exports from Prisma / app enums
├── types/                 # TypeScript interfaces (JWT, request user)
└── utils/                 # Hash, JWT, errors, async handler
prisma/
├── schema.prisma          # Data model
└── migrations/            # SQL migrations
test/                      # E2E tests
```

### Request flow

1. **Global:** `express.json()` → `extractUser` (optional JWT → `req.user`)
2. **Route middleware:** `authenticateUser` → `authorizeRoles(...)` → `requireActiveSession` → `validateBody(Dto)`
3. **Controller** → **Service** → **Prisma**
4. **Errors:** Central `errorHandler` returns JSON with `statusCode`, `message`, `path`, `timestamp`

---

## Prerequisites

- **Node.js** 18+ (tested on 22+)
- **npm**
- **PostgreSQL** (local, Docker, or hosted e.g. Supabase)

---

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd development-cart-assessment
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL and JWT secret (see [Environment variables](#environment-variables)).

### 3. Database

**Option A — Docker**

```bash
docker compose up -d
```

**Option B — Existing PostgreSQL**

Create a database (e.g. `development_cart`) and set `DATABASE_URL` in `.env`.

### 4. Migrations

```bash
npm run prisma:migrate
```

### 5. Run

```bash
npm run build
npm run start
# or hot reload:
npm run start:dev
```

API base URL: **http://localhost:3000** (or your `PORT`).

Health check: `GET http://localhost:3000/health`

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | `development` \| `production` \| `test` (default: `development`) |
| `PORT` | No | HTTP port (default: `3000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `1d`) |

Example (`.env.example`):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/development_cart?schema=public"
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=1d
```

---

## Database

### Models

| Model | Purpose |
|-------|---------|
| `User` | Accounts, roles, `profileCompleted`, optional `organizationId` |
| `Organization` | Org profile (name, slug) |
| `Session` | Learning sessions, linked to admin, status lifecycle |
| `Enrollment` | User ↔ session (`paymentType`, `paymentStatus`), unique per user/session |
| `Sponsorship` | Org sponsors a user for a session, 1:1 with enrollment |
| `Video` | Session content (schema ready) |
| `Quiz` / `Score` | Assessments (schema ready) |

### Enums

- **Role:** `SUPERADMIN`, `ADMIN`, `USER`, `ORGANIZATION`
- **SessionStatus:** `DRAFT`, `SCHEDULED`, `ACTIVE`, `COMPLETED`, `CANCELLED`
- **PaymentStatus:** `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `WAIVED`
- **PaymentType:** `SELF`, `SPONSORED`

### Useful Prisma commands

```bash
npm run prisma:generate   # Regenerate client
npm run prisma:migrate    # Apply migrations (dev)
npm run prisma:studio     # DB GUI
```

---

## Running the application

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm run start` | Run compiled `dist/server.js` |
| `npm run start:dev` | Dev server with `tsx watch` |
| `npm run lint` | ESLint + Prettier |
| `npm run format` | Format source files |

> If using **nodemon** with `node dist/server.js`, run `npm run build` after code changes, or prefer `npm run start:dev`.

---

## API reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Auth | Role / notes |
|--------|----------|------|----------------|
| `GET` | `/` | — | Health status |
| `GET` | `/health` | — | Health status |
| `POST` | `/auth/register` | — | Create account |
| `POST` | `/auth/login` | — | Login, returns `accessToken` |
| `GET` | `/users/me` | JWT | Current user profile |
| `GET` | `/users/admin` | JWT | `ADMIN`, `SUPERADMIN` |
| `GET` | `/users/organization` | JWT | `ORGANIZATION` |
| `POST` | `/users/complete-profile` | JWT | Requires **ACTIVE** session |
| `POST` | `/sessions` | JWT | `SUPERADMIN` only |
| `GET` | `/sessions/active` | JWT | Current active session |
| `POST` | `/enroll` | JWT | Requires **ACTIVE** session |
| `POST` | `/sponsor` | JWT | `ORGANIZATION` + **ACTIVE** session |

### Request bodies

**POST `/auth/register`**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER"
}
```

`role` optional: `SUPERADMIN` \| `ADMIN` \| `USER` \| `ORGANIZATION` (default: `USER`).

**POST `/auth/login`**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST `/sessions`**

```json
{
  "title": "Leadership Bootcamp",
  "description": "Optional",
  "adminId": "uuid-of-admin-user",
  "organizationId": "optional-org-uuid",
  "status": "ACTIVE",
  "startsAt": "2026-06-01T09:00:00.000Z",
  "endsAt": "2026-06-01T17:00:00.000Z"
}
```

**POST `/enroll`**

```json
{
  "paymentType": "SELF"
}
```

```json
{
  "paymentType": "SPONSORED",
  "organizationId": "org-uuid"
}
```

**POST `/sponsor`**

```json
{
  "userId": "user-uuid-to-sponsor",
  "amount": 500,
  "paymentStatus": "PAID"
}
```

`paymentStatus` optional (default: `PAID`).

### Success responses

- Register: `201` + `{ accessToken, user }`
- Login: `200` + `{ accessToken, user }`
- Create session: `201` + session object
- Enroll / sponsor: `201` + enrollment/sponsorship details

Use header on protected routes:

```http
Authorization: Bearer <accessToken>
```

---

## Authentication & authorization

### JWT

- Issued on register/login
- Payload: `sub` (user id), `email`, `role`
- Verified on protected routes via `authenticateUser`

### Middleware

| Middleware | Purpose |
|------------|---------|
| `extractUser` | Global; attaches `req.user` when Bearer token is valid |
| `authenticateUser` | Requires `req.user` (401 if missing) |
| `authorizeRoles(...roles)` | Requires user role in allowed list (403) |
| `requireActiveSession` | Requires one `ACTIVE` session in DB (404 if none) |
| `validateBody(Dto)` | Validates body; whitelist + forbid unknown fields |

---

## Business rules

1. **Single active session** — Only one session may have `status: ACTIVE` at a time.
2. **Session admin** — Creating a session requires a valid `adminId` for a user with role `ADMIN`.
3. **Enrollment** — One enrollment per user per session (`@@unique([userId, sessionId])`).
4. **SELF enroll** — `paymentStatus` → `PENDING`.
5. **SPONSORED enroll** — Requires existing sponsorship for user + organization + active session; status follows sponsorship.
6. **Sponsorship** — Organization account sponsors a user; creates/updates enrollment and links sponsorship; duplicate blocked per `(organizationId, userId, sessionId)`.
7. **Profile completion** — Only when an active session exists; sets `profileCompleted: true`.

---

## Example workflow

1. Register **SUPERADMIN** → save `accessToken`.
2. Register **ADMIN** → note `user.id` for `adminId`.
3. `POST /sessions` with `"status": "ACTIVE"` (as superadmin).
4. Register **USER** → `POST /enroll`, optionally `POST /users/complete-profile`.
5. Register **ORGANIZATION** (ensure `organizationId` is set on user if needed) → `POST /sponsor` for a user.

---

## cURL examples

Set variables (PowerShell):

```powershell
$BASE = "http://localhost:3000"
$TOKEN = "your-jwt-access-token"
```

Use `curl.exe` on Windows.

```bash
# Health
curl.exe -X GET "$BASE/health"

# Register
curl.exe -X POST "$BASE/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"

# Login
curl.exe -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"

# Profile
curl.exe -X GET "$BASE/users/me" -H "Authorization: Bearer $TOKEN"

# Create session (superadmin)
curl.exe -X POST "$BASE/sessions" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"title\":\"Bootcamp\",\"adminId\":\"ADMIN_UUID\",\"status\":\"ACTIVE\"}"

# Active session
curl.exe -X GET "$BASE/sessions/active" -H "Authorization: Bearer $TOKEN"

# Enroll
curl.exe -X POST "$BASE/enroll" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"paymentType\":\"SELF\"}"

# Complete profile
curl.exe -X POST "$BASE/users/complete-profile" -H "Authorization: Bearer $TOKEN"

# Sponsor (organization)
curl.exe -X POST "$BASE/sponsor" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\"userId\":\"USER_UUID\",\"amount\":500}"
```

Bash:

```bash
export BASE=http://localhost:3000
export TOKEN=your-jwt-access-token
curl -s "$BASE/health"
curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
curl -s "$BASE/users/me" -H "Authorization: Bearer $TOKEN"
```

---

## Error responses

Errors return JSON:

```json
{
  "statusCode": 400,
  "timestamp": "2026-05-19T12:00:00.000Z",
  "path": "/enroll",
  "method": "POST",
  "message": "Error description or array of validation messages"
}
```

| Status | Typical cause |
|--------|----------------|
| `400` | Validation failed, bad request |
| `401` | Missing or invalid JWT |
| `403` | Insufficient role |
| `404` | Resource not found, no active session |
| `409` | Conflict (duplicate email, enrollment, sponsorship, active session) |
| `500` | Server error |

---

## Testing

```bash
# E2E (health + auth flows; requires DATABASE_URL)
npm run test:e2e

# Unit tests (if present)
npm run test

# Coverage
npm run test:cov
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | TypeScript compile |
| `npm run start` | Production start |
| `npm run start:dev` | Development with watch |
| `npm run lint` | Lint & fix |
| `npm run format` | Prettier |
| `npm run test` | Jest unit tests |
| `npm run test:e2e` | E2E tests |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations |
| `npm run prisma:studio` | Prisma Studio |

---

## License

UNLICENSED — private assessment project.
